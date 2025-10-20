const OPEN_AT_STARTUP = !true
const HEADLESS = !true

const puppeteer = require('puppeteer-extra');
const pupcore = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

// ---------- internal state ----------
let page;
let currentStreamUrl = null;
let currentBuffer = '';
let currentResolve, currentReject;
let inFlight = false;

// streaming control
let streamingMode = false;
let onChunkCb = null;
let abortSignal = null;

// tiny helper to make a one-shot deferred
function makeDeferred() {
  let resolve, reject;
  const p = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise: p, resolve, reject };
}

const b = async () => {
  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'puppeteer-cors-'));

  const browser = await puppeteer.launch({
    executablePath: pupcore.executablePath('chrome') || '/path/to/your/chrome',
    headless: HEADLESS,
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--allow-running-insecure-content',
      `--user-data-dir=${tempProfile}`,
    ],
  });

  page = await browser.newPage();

    // Set viewport size
  await page.setViewport({
    width: 1280,
    height: 800,
    deviceScaleFactor: 1, // optional, controls zoom / DPI
  });

  // Node-side listener: collect chunks, emit to onChunk when streaming, resolve on end
  page.on('console', (msg) => {
    if (msg.type() !== 'debug') return;
    const text = msg.text();
    if (!text.startsWith('___STREAM__ ')) return;

    try {
      const payload = JSON.parse(text.slice('___STREAM__ '.length));
      // console.log(payload, 'payload')
      // ignore if no generation is in flight
      if (!inFlight) return;

      // start of new stream?
      if ((payload.chunk || payload.end) && !currentStreamUrl) {
        currentStreamUrl = payload.url;
      }

      // only handle the first in-flight URL
      if (payload.url !== currentStreamUrl) return;

      if (typeof payload.chunk === 'string') {
        currentBuffer += payload.chunk;
        if (streamingMode && typeof onChunkCb === 'function') {
          console.log(payload.chunk)
          // try { onChunkCb(payload.chunk, payload); } catch {}
          try { '__DATA: '+onChunkCb(extractUsefulTextFromChunk(payload.chunk)||'', payload); } catch {}
        }
      }

function extractUsefulTextFromChunk(chunk) {
  const texts = [];

  function extractTextsFromObj(obj) {
    // Caso 1: {"p": "...", "o": "append", "v": "testo"}
    if (typeof obj.v === "string" && obj.o === "append") {
      texts.push(obj.v);
      return;
    }

    // Caso 2: Patch con lista di operazioni
    if (obj.o === "patch" && Array.isArray(obj.v)) {
      for (const op of obj.v) {
        if (op && op.o === "append" && typeof op.v === "string") {
          texts.push(op.v);
        }
      }
      return;
    }

    // Caso 3: Oggetto con message completo
    if (obj.v && typeof obj.v === "object" && obj.c != 1) {
      // Esempio: {"v": {"message": {...}}}
      const msg = obj.v.message;
      if (msg && msg.content && msg.content.content_type === "text") {
        const parts = msg.content.parts;
        if (Array.isArray(parts)) {
          const joined = parts.filter(p => typeof p === "string").join("");
          if (joined) texts.push(joined);
        }
      }

      // Caso raro: {"v": {"v": "testo"}}
      if (typeof obj.v.v === "string" && !("message" in obj.v)) {
        texts.push(obj.v.v);
      }
      return;
    }

    // Caso 4: {"v": "testo"}
    if (typeof obj.v === "string") {
      texts.push(obj.v);
    }
  }

  for (const line of chunk.split("\n")) {
    if (!line.startsWith("data:")) continue;

    const payload = line.slice(5).trim();

    // ignora non-JSON (tipo "v1", "DONE")
    if (!(payload.startsWith("{") && payload.endsWith("}"))) continue;

    let obj;
    try {
      obj = JSON.parse(payload);
    } catch {
      continue;
    }

    // ignora metadati
    if (["server_ste_metadata", "message_stream_complete", "conversation_detail_metadata"]
        .includes(obj.type)) {
      continue;
    }

    extractTextsFromObj(obj);
  }

  return texts.join("");
}


      if (payload.end === true) {
        const buf = currentBuffer;
        // reset state first for reentrancy
        currentStreamUrl = null;
        currentBuffer = '';
        inFlight = false;

        const resolve = currentResolve;
        const reject = currentReject;
        currentResolve = currentReject = undefined;

        // clear streaming state
        streamingMode = false;
        onChunkCb = null;
        abortSignal = null;

        if (resolve) resolve({ text: buf, url: payload.url });
      }
    } catch (_) {
      // ignore parse errors
    }
  });

  // Inject fetch tap + explicit end marker
  await page.evaluateOnNewDocument(() => {
    const STREAM_PREFIX = '___STREAM__ ';
    // const shouldTap = (url, _headers) =>
    //   /conversation|chat\/completions|stream/i.test(url);
    const shouldTap = (url, _headers) =>
      /f\/conversation/i.test(url);

    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : input.url;
      const method =
        (init && init.method) ||
        (typeof input !== 'string' && input.method) ||
        'GET';

      const res = await origFetch(...args);

      try {
        const ct = (res.headers && res.headers.get('content-type')) || '';
        const isStream =
          ct.includes('text/event-stream') ||
          ct.includes('application/x-ndjson') ||
          ct.includes('application/event-stream');

        if (method.toUpperCase() === 'POST' && isStream && shouldTap(url, res.headers)) {
          const clone = res.clone();
          if (clone.body && clone.body.getReader) {
            const reader = clone.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });

              try {
                const MAX = 20000;
                if (chunk.length > MAX) {
                  for (let i = 0; i < chunk.length; i += MAX) {
                    const part = chunk.slice(i, i + MAX);
                    console.debug(
                      STREAM_PREFIX + JSON.stringify({ url, chunk: part })
                    );
                  }
                } else {
                  console.debug(
                    STREAM_PREFIX + JSON.stringify({ url, chunk })
                  );
                }
              } catch (_) {}
            }

            // explicit end marker
            try {
              console.debug(
                STREAM_PREFIX + JSON.stringify({ url, end: true })
              );
            } catch (_) {}
          }
        }
      } catch (e) {
        console.debug('stream tap error', String(e));
      }

      return res;
    };
  });
console.log('loading')
  await page.goto('https://chatgpt.com', { waitUntil: 'domcontentloaded' });
console.log('loaded')
  // Helper to send a prompt (adjust selectors for your site)
  async function ask(prompt = 'hi') {
    console.log('asking')
    await page.evaluate(()=>{
      let el = document.querySelector('#thread-bottom');
      el.style.position = 'fixed';
      el.style.bottom = '0';
      el.style.left = '0';
      el.style.width = '100%';
      el.style.zIndex = '2147483647';

          const button = Array.from(document.querySelectorAll("a"))
    .find(el => el.textContent.trim() === "Stay logged out");

    if (button) {
      button.click(); // example usage
    }
    })


    console.log('textarea waiting')
    await page.waitForSelector('#prompt-textarea', { visible: false });
    await page.focus('#prompt-textarea');
    await page.keyboard.type(prompt);
    await page.keyboard.press('Enter');
    console.log('textarea ok')
    // await page.screenshot({ path: 'fullpage.png', fullPage: true });
  }

  // expose ask so generate() can call it
  global.__tapAsk = ask;
}

if(OPEN_AT_STARTUP)
b()

// ---------- Public API ----------
//
// generate(prompt, model, stream = false, opts?)
//   - stream === false  -> returns full text when stream ends (current behavior)
//   - stream === true   -> calls opts.onChunk(chunk[, evt]) for each piece; promise resolves to full text at end
//   - opts.signal (AbortSignal) to abort; promise rejects with AbortError
//
async function generate(prompt = 'hi', _model = undefined, stream = false, opts = {}) {
  
  if(OPEN_AT_STARTUP){
    if(!page)
    await b()  
  }
  else{
    if (!page) throw new Error('Page not ready yet. Wait for the browser to initialize.');
  }
  
  if (inFlight) throw new Error('A generation is already in progress. Please wait for it to finish.');

  inFlight = true;
  currentStreamUrl = null;
  currentBuffer = '';

  streamingMode = !!stream;
  onChunkCb = typeof opts.onChunk === 'function' ? opts.onChunk : null;
  abortSignal = opts.signal || null;

  const { promise, resolve, reject } = makeDeferred();
  currentResolve = resolve;
  currentReject = reject;

  // abort wiring (cannot cancel the page fetch easily; we just stop emitting/resolve with error)
  let abortHandler;
  // console.log(abortSignal)
  if (abortSignal && abortSignal.aborted && 0) {
    abortHandler = () => {
      // cleanup local state; ignore any later console events
      inFlight = false;
      streamingMode = false;
      onChunkCb = null;
      currentStreamUrl = null;
      const err = new Error('Aborted');
      err.name = 'AbortError';
      const rej = currentReject;
      currentResolve = currentReject = undefined;
      if (rej) rej(err);
    };
    if (abortSignal.aborted) abortHandler();
    else abortSignal.addEventListener('abort', abortHandler, { once: true });
  }

  try {
    await global.__tapAsk(prompt);
  } catch (e) {
    inFlight = false;
    streamingMode = false;
    onChunkCb = null;
    currentStreamUrl = null;
    currentBuffer = '';
    if (abortSignal && abortHandler) abortSignal.removeEventListener('abort', abortHandler);
    throw e;
  }

  try {
    const { text } = await promise; // resolves on { end:true }
    if (abortSignal && abortHandler) abortSignal.removeEventListener('abort', abortHandler);
    return text;
  } finally {
    // state is mostly cleared when the end marker is processed
  }
}

// function reloadPage(){
//   // implement this such that when called from backend server (or whatever external module) it performs page.reload()
// }
async function reloadPage() {
  if (!page) {
    return
    throw new Error('Page not ready yet. Wait for the browser to initialize.');
  }
  await page.goto('https://chatgpt.com', { waitUntil: 'domcontentloaded' });
}

module.exports = { generate, reloadPage };
