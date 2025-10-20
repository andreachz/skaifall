function checkNodeVersion(minMajor = 22) {
  const version = process.version; // e.g. "v22.3.0"
  const [major, minor, patch] = version.replace(/^v/, '').split('.').map(Number);

  if (major >= minMajor) {
    // console.log(`✅ Node.js version ${version} is supported (>=${minMajor}).`);
    return true;
  } else {
    console.error(`❌ Node.js version ${version} is too old. Please upgrade to >=${minMajor}.`);
    return false;
  }
}

// Example usage:
if (!checkNodeVersion(22)) {
  process.exit(1);
}

// --- Unified DOM/Browser stubs to satisfy ALL three anti-automation scripts ---
//
// Goals:
// • Run the three async IIFEs outside a real browser without throwing
// • Provide stable shapes/behaviors the scripts probe for
// • Keep “risky” heuristics mostly falsy (except webdriver=true, as requested)
//
// Coverage across scripts:
//   - navigator.userAgent, navigator.webdriver
//   - window branding: Object.prototype.toString.call(window) === "[object Window]"
//   - window.toString() includes "pxjzr"
//   - DOM append/remove: document.body.children length increments
//   - querySelectorAll('*') → non-array NodeList-like w/ constructor.name === "NodeList"
//   - HTMLElement/HTMLDivElement chain + instanceof checks
//   - #jsa “iframe anchor” with CSP meta + sandbox (script #3 needs this)
//   - createElement('iframe') → contentWindow null (keeps Proxy/Viewport checks falsy)
//   - window.top keys exist but minimal (avoids “duplicate global” detections)
//   - Safe presence for window.self, window.JSON, window.Symbol (as namespaced props)

//
// ------------------------------- navigator -----------------------------------
//
let navigator = {
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
  webdriver: false, // keep true so the automation scores include it
};

//
// ----------------------- Basic constructor chain (DOM-ish) --------------------
//
class Element {}

class HTMLElement extends Element {
  constructor() {
    super();
    this._innerHTML = "";
  }
  get innerHTML() {
    return this._innerHTML;
  }
  set innerHTML(v) {
    this._innerHTML = String(v ?? "");
  }
  // Only '*' is required by the scripts
  querySelectorAll(selector) {
    if (selector === "*") {
      // Count simple tag openings like <div to emulate a DOM tree size
      const count = (this._innerHTML.match(/<\w+/g) || []).length;
      return new NodeListMock(new Array(count).fill({}));
    }
    return new NodeListMock([]);
  }
}

class HTMLDivElement extends HTMLElement {}

// Non-array NodeList-like (has .length; constructor.name === "NodeList")
function NodeListMock(items = []) {
  this.items = items;
  Object.defineProperty(this, "length", {
    enumerable: false,
    configurable: false,
    get() {
      return this.items.length;
    },
  });
}
// Ensure instance.constructor.name === "NodeList"
Object.defineProperty(NodeListMock, "name", { value: "NodeList" });

//
// ----------------------------------- window ----------------------------------
//
let window = {
  // Keep a few enumerable props so Object.keys(window.top) works yet stays small
  top: {
    __DDG_BE_VERSION__: "v",
    __DDG_FE_CHAT_HASH__: "h",
  },

  // Expose constructors on window like browsers do
  Element,
  HTMLElement,
  HTMLDivElement,
  NodeList: NodeListMock,

  // Safe namespaced props (not the real JS builtins, but fine for name checks)
  JSON: globalThis.JSON,
  Symbol: {},

  // window.self point-back
  get self() {
    return this;
  },

  // The 2nd/3rd scripts check that window.toString() includes "pxjzr"
  toString() {
    return "[object Window] pxjzr";
  },
};

// Make Object.prototype.toString.call(window) === "[object Window]"
Object.defineProperty(window, Symbol.toStringTag, { value: "Window" });

//
// ---------------------------------- document ---------------------------------
//
// We'll also provide a persistent “#jsa” pseudo-iframe for script #3.
const JSA_IFRAME_ANCHOR = {
  // emulate getAttribute('sandbox')
  getAttribute(attr) {
    if (attr === "sandbox") return "allow-scripts allow-same-origin";
    return null;
  },
  // emulate contentDocument with a CSP meta tag
  contentDocument: {
    querySelector(q) {
      if (q === 'meta[http-equiv="Content-Security-Policy"]') {
        return {
          getAttribute(name) {
            if (name === "content") {
              return "default-src 'none'; script-src 'unsafe-inline';";
            }
            return null;
          },
        };
      }
      return null;
    },
  },
  // also expose a minimal contentWindow with a document reference (not used for scale)
  contentWindow: {
    document: null, // filled below once document is created
  },
};

window.document = {
  // Only bits used by the scripts are implemented

  // Very small selector handling: only "#jsa" is required
  querySelector(q) {
    if (q === "#jsa") return JSA_IFRAME_ANCHOR;
    return null;
  },

  // Return a non-array NodeList-like object
  querySelectorAll(_q) {
    return new NodeListMock([]);
  },

  // createElement supports 'div' and 'iframe'
  createElement(tag) {
    if (tag === "div") {
      return new HTMLDivElement();
    }
    if (tag === "iframe") {
      // Other probes check iframe.contentWindow?.self?.get or .visualViewport.scale
      // Keep contentWindow null so those checks remain falsy.
      return {
        srcdoc: "",
        contentWindow: null,
      };
    }
    return new HTMLElement();
  },

  // Minimal body with children tracking; scripts check .children.length changes
  body: (function () {
    const children = [];
    return {
      get children() {
        return children;
      },
      appendChild(el) {
        children.push(el);
      },
      removeChild(el) {
        const i = children.indexOf(el);
        if (i >= 0) children.splice(i, 1);
      },
    };
  })(),
};

// Hook up references that depend on document existence
let document = window.document;
JSA_IFRAME_ANCHOR.contentWindow.document = document;

// Expose a document on window.top too (scripts access window.top.document)
window.top.document = document;

//
// --------------------------- Expose as global-like ----------------------------
//
globalThis.Element = Element;
globalThis.HTMLElement = HTMLElement;
globalThis.HTMLDivElement = HTMLDivElement;
globalThis.NodeList = NodeListMock;
globalThis.window = window;
globalThis.document = document;
globalThis.navigator = navigator;

// Optional: provide a global Error that supports captureStackTrace if present (engine-defined).
// We do not polyfill; scripts accept either undefined or a function.



async function sha256Base64(s) {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(s));
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function buildDuckHash(res) {
    res.client_hashes = await Promise.all(
        res.client_hashes.map(x => sha256Base64(x))
    )
    
    res.meta.origin = "https://duckduckgo.com"
    res.meta.stack = "Error\nat l (https://duckduckgo.com/dist/wpm.main.26e905c8fd9c901bbbeb.js:1:364990)\nat async https://duckduckgo.com/dist/wpm.main.26e905c8fd9c901bbbeb.js:1:340615"
    res.meta.duration = "7"
    
    return res
}


const https = require('https');

/**
 * Fetches DuckDuckGo's duckchat status, evaluates the header payload, and returns the base64 hash string.
 * Retries with a new GET only if the eval step throws.
 *
 * @param {object} opts
 * @param {number} [opts.maxAttempts=3] - Maximum number of eval retries (each retry makes a new GET).
 * @param {object} [opts.requestOptions] - Optional override/extend of the HTTPS request options.
 * @returns {Promise<string>} Base64-encoded hash string (btoa(JSON.stringify(plain_result))).
 *
 * NOTE: Expects a global or in-scope async function `buildDuckHash(value)` to exist,
 *       exactly like in your original snippet.
 */
async function getDuckChatHash({ maxAttempts = 15, requestOptions = {} } = {}) {
  // Node-friendly atob/btoa
  const atob = (str) => Buffer.from(str, 'base64').toString('utf8');
  const btoa = (str) => Buffer.from(str, 'utf8').toString('base64');

  const defaultOptions = {
    method: 'GET',
    hostname: 'duckduckgo.com',
    path: '/duckchat/v1/status',
    headers: {
      'accept': '*/*',
      'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
      'cache-control': 'no-store',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'referer': 'https://duckduckgo.com/',
      'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      'x-vqd-accept': '1'
    },
    ...requestOptions,
  };

  // Helper: perform the GET and return response headers
  const fetchHeaders = () =>
    new Promise((resolve, reject) => {
      const req = https.request(defaultOptions, (res) => {
        // console.log(res.headers,'pizza1')
        // Drain body to free the socket, but we only need headers
        res.on('data', () => {});
        res.on('end', () => resolve(res.headers));
      });
      req.on('error', reject);
      req.end();
    });

  let attempt = 0;
  let lastError;

  while (attempt < maxAttempts) {
    attempt += 1;
    const headers = await fetchHeaders();
    // console.log(headers,'pizza2')

    const encoded = ''|| headers['x-vqd-hash-1'];
    console.log(encoded.substring(0,30),'...encoded from status')
    if (!encoded) {
      // No point retrying for "missing header" unless you want to; treat as a hard error.
      throw new Error('Missing x-vqd-hash-1 header in response.');
    }

    const decoded = atob(encoded);

    try {
      console.log('hash request', attempt)
      // Your original logic: eval the decoded script/payload
      const resultOfEval = await eval(decoded); // eslint-disable-line no-eval

      // Then build the plain result using your existing buildDuckHash
      /* global buildDuckHash */
      const plain = await buildDuckHash(resultOfEval);
    //   console.log(plain)
      // Return base64-encoded JSON string (same as your console "b64 result")
      let hashB64 = btoa(JSON.stringify(plain));
      
      return {plain, hashB64}
    } catch (err) {
      console.log('[JS eval error]',err)
      // Only retry on eval failure, as requested
      lastError = err;
      if (attempt >= maxAttempts) break;
      
      // loop continues → fetch fresh headers and try again
    }
    await delay(222)
  }

  // If we’re here, all eval attempts failed
  const msg = lastError && lastError.stack ? lastError.stack : String(lastError || 'Unknown eval error');
  throw new Error(`Failed to compute hash after ${maxAttempts} attempt(s): ${msg}`);
}

/**
 * Call once with current hashes. Returns { ok, text?, errorAction? }.
 * Requires getDuckChatHash() to exist (as in your snippet).
 */
async function chatOnce(prompt, model, { plain, hashB64 }) {
    // console.log('chatonce')
  // Build x-fe-signals from the timestamp in plain.meta (your original logic)
  const btoa = (str) => Buffer.from(str, 'utf8').toString('base64');
  const startTs = parseInt(plain?.meta?.timestamp, 10);
  if (!Number.isFinite(startTs)) {
    throw new Error("chatOnce: invalid plain.meta.timestamp");
  }
  const xfesignals = btoa(JSON.stringify({ start: startTs - 1111, events: [], end: 10630 }));

  const resp = await fetch("https://duckduckgo.com/duckchat/v1/chat", {
    method: "POST",
    headers: {
      "accept": "text/event-stream",
      "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-fe-signals": xfesignals,
      // Keep your version string (or wire your own)
      "x-fe-version": "serp_20250901_205406_ET-d5c1d30fb1f0d32e28b0",
      "x-vqd-hash-1": hashB64,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
      "Referer": "https://duckduckgo.com/"
    },
    body: JSON.stringify({
      // gpt-4o-mini
      // gpt-5-mini
      // meta-llama/Llama-4-Scout-17B-16E-Instruct
      // mistralai/Mistral-Small-24B-Instruct-2501
      model: model || "gpt-4o-mini",
      metadata: {
        toolChoice: {
          NewsSearch: false,
          VideosSearch: false,
          LocalSearch: false,
          WeatherForecast: false
        }
      },
      messages: 
      isJson(prompt)?JSON.parse(prompt):[{ role: "user", content: prompt }],
      canUseTools: true,
      canUseApproxLocation: false
    })
  });

  const allText = await resp.text();

  // Robust SSE parser:
  // - collect message fragments from lines that start with "data: "
  // - if any JSON chunk has { action: "error" }, return that to trigger a retry upstream
  let out = "";
  let errorAction = null;

  for (const rawLine of allText.split("\n")) {
    const line = rawLine.trim();
    if (!line || !line.startsWith("data:")) continue;

    const jsonStr = line.replace(/^data:\s*/, "");
    try {
      const evt = JSON.parse(jsonStr);
      if (evt && typeof evt === "object") {
        if (evt.action === "error") {
          errorAction = evt;
          break; // stop early on explicit error
        }
        if (typeof evt.message === "string") {
          out += evt.message;
        }
      }
    } catch (_) {
      // Non-JSON data line; ignore to be resilient to keepalives/comments
    }
  }

  if (errorAction) {
    return { ok: false, errorAction };
  }
  // If we got no error and some output, success
  if (out && out.trim().length) {
    return { ok: true, text: out };
  }

  // If server returned nothing useful, mark as a soft error to trigger a retry
  return { ok: false, errorAction: { action: "error", error: "empty_response" } };
}

async function chatOnceStream(prompt, model, { plain, hashB64, onChunk, signal: externalSignal, timeoutMs = 0 }) {
  const btoa = (str) => Buffer.from(str, 'utf8').toString('base64');

  const startTs = parseInt(plain?.meta?.timestamp, 10);
  if (!Number.isFinite(startTs)) throw new Error("chatOnce: invalid plain.meta.timestamp");

  const xfesignals = btoa(JSON.stringify({ start: startTs - 1111, events: [], end: 10630 }));

  // Allow caller to cancel; also support our own timeout
  const ac = new AbortController();
  const { signal } = ac;
  if (externalSignal) {
    // If caller cancels, abort our request
    externalSignal.addEventListener('abort', () => ac.abort(externalSignal.reason), { once: true });
  }
  let timeoutId = null;
  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => ac.abort(new Error('chatOnceStream: timeout')), timeoutMs);
  }

  const resp = await fetch("https://duckduckgo.com/duckchat/v1/chat", {
    method: "POST",
    headers: {
      "accept": "text/event-stream",
      "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-fe-signals": xfesignals,
      "x-fe-version": "serp_20250901_205406_ET-d5c1d30fb1f0d32e28b0",
      "x-vqd-hash-1": hashB64,
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
      "Referer": "https://duckduckgo.com/"
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      metadata: {
        toolChoice: { NewsSearch: false, VideosSearch: false, LocalSearch: false, WeatherForecast: false }
      },
      messages: isJson(prompt) ? JSON.parse(prompt) : [{ role: "user", content: prompt }],
      canUseTools: true,
      canUseApproxLocation: false
    }),
    signal
  });

  if (!resp.ok) {
    if (timeoutId) clearTimeout(timeoutId);
    return { ok: false, errorAction: { action: "error", error: `http_${resp.status}` } };
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = "";           // raw text buffer for chunked decoding
  let out = "";              // full assembled assistant text
  let errorAction = null;    // first error event seen

  // Minimal SSE parser: events are separated by a blank line.
  // We concatenate all "data:" lines for an event, then try JSON.parse each
  // line separately to be robust to keepalives or comments.
  const processEvent = (eventStr) => {
    // Ignore comments and fields other than "data"
    const dataLines = [];
    for (const line of eventStr.split(/\r?\n/)) {
      if (line.startsWith("data:")) {
        dataLines.push(line.replace(/^data:\s?/, ""));
      }
    }
    // DuckDuckGo sends one JSON per data line; handle each
    for (const jsonStr of dataLines) {
      if (!jsonStr || jsonStr === "[DONE]") continue; // generic SSE terminator pattern, just in case
      try {
        const evt = JSON.parse(jsonStr);
        if (evt && typeof evt === "object") {
          if (evt.action === "error") {
            errorAction = evt;
          } else if (typeof evt.message === "string") {
            out += evt.message;
            if (typeof onChunk === "function") {
              onChunk(evt.message, evt); // stream to caller
            }
          }
        }
      } catch {
        // Non-JSON keepalive or stray data: ignore safely
      }
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Split by SSE event boundary (blank line). Keep the last partial.
      const parts = buffer.split(/\r?\n\r?\n/);
      buffer = parts.pop(); // last piece may be incomplete
      for (const evt of parts) {
        processEvent(evt);
        if (errorAction) break;
      }
      if (errorAction) break;
    }

    // Flush any trailing data
    if (buffer) processEvent(buffer);

  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    try { reader.releaseLock?.(); } catch {}

    // If we saw an explicit error event, surface it
    if (errorAction) return { ok: false, errorAction };
  }

  if (out && out.trim().length) {
    return { ok: true, text: out };
  }
  return { ok: false, errorAction: { action: "error", error: "empty_response" } };
}


let _HASHES=null

/**
 * Generates a reply with automatic hash refresh & chat retries.
 *
 * @param {string} prompt - The user prompt to send.
 * @param {string} model - The llm model.
 * @param {object} [opts]
 * @param {number} [opts.maxChatAttempts=3] - Max number of /chat attempts (each can fetch new hashes).
 * @param {number} [opts.maxHashAttempts=15] - Passed to getDuckChatHash for each hash fetch attempt.
 * @param {object} [opts.requestOptions] - Passed to getDuckChatHash (HTTPS request overrides).
 * @returns {Promise<string>} - The concatenated message from the SSE stream.
 */
async function generate(
  prompt,
  model = 'gpt-4o-mini',
  {
    maxChatAttempts = 5,
    maxHashAttempts = 5,
    requestOptions = {},
    stream = false,            // ← NEW: choose chatOnce vs chatOnceStream
    onChunk = undefined,       // ← NEW: optional callback for streaming
    streamSignal = undefined,  // ← NEW: optional AbortSignal for streaming
  } = {}
) {
  if(prompt.length && prompt[0].role && prompt[0].content){
    prompt = JSON.stringify(prompt)
  }
  if (typeof prompt !== "string" || !prompt.trim() || !isJson(prompt)) {
    console.log('invalid prompt input:', prompt);
    throw new Error("generate: prompt must be a non-empty string or json strigified object with role ('user','assistant') and content");
  }

  let attempt = 0;
  let lastErr = null;

  // We reuse hashes within an attempt; if chat fails, we refresh for the next try.
  let hashes = _HASHES;

  while (attempt < maxChatAttempts) {
    if (attempt > 0) await delay(222);

    attempt += 1;

    try {
      if (!hashes) {
        // (Re)fetch hashes before this chat attempt
        hashes = await getDuckChatHash({ maxAttempts: maxHashAttempts, requestOptions });
      }
      console.log('send chat request', attempt);

      // Use chatOnce or chatOnceStream based on the new flag
      const result = stream
        ? await chatOnceStream(
            prompt,
            model,
            { ...hashes, onChunk, signal: streamSignal } // stream-specific extras
          )
        : await chatOnce(
            prompt,
            model,
            hashes
          );

      if (result.ok) {
        _HASHES = hashes;
        if (!stream) {
          console.log(result.text);
          console.log('[DONE]');
        }
        return result.text;
      }

      // If server explicitly sent an error action, clear hashes and retry
      hashes = null;
      lastErr = new Error(`chat error: ${result.errorAction?.error || "unknown"}`);
      console.log('[chatonce error]', lastErr);
      continue; // next attempt
    } catch (e) {
      console.log('[chatonce error]', e);
      // Network/parse/etc. Clear hashes to force a fresh set on next loop.
      hashes = null;
      lastErr = e instanceof Error ? e : new Error(String(e));
      continue; // next attempt
    }
  }

  // Exhausted attempts
  const msg = lastErr?.message || "Unknown chat failure";
  throw new Error(`Failed to generate after ${maxChatAttempts} chat attempt(s): ${msg}`);
}

// --- Example ---
(async () => {
  try {
    // const text = await generate("Say hello in one sentence.", { maxChatAttempts: 3, maxHashAttempts: 15 });
    // console.log("Reply:", text);
    // console.log(await generate("Say hello in one sentence.", { maxChatAttempts: 5, maxHashAttempts: 5 }))
    // console.log(await generate("say something short", { maxChatAttempts: 5, maxHashAttempts: 15 }))
    // console.log(await generate("say something short", { maxChatAttempts: 5, maxHashAttempts: 15 }))
    // console.log(await generate("say something short", { maxChatAttempts: 5, maxHashAttempts: 15 }))
    
  } catch (e) {
    console.error(e);
  }
})();


// A reusable delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const available_models = [ 'gpt-4o-mini', 'gpt-5-mini', 'meta-llama/Llama-4-Scout-17B-16E-Instruct','mistralai/Mistral-Small-24B-Instruct-2501']

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
    // Serve index.html
    const filePath = path.join(__dirname, "index.html");
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        // res.end("Error loading index.html");
        res.end(NO_INDEX_WARNING);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });

  }
  else if (req.url === "/generate-stream" && req.method === "POST") {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    if (!body) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: "Empty body" }));
    }

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
    }

    try {
      console.log(parsed);

      // Prepare SSE headers
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      });

      // Optional: tell the client to retry quickly if the connection drops
      res.write(`retry: 1000\n\n`);

      const prompt = parsed.prompt || JSON.stringify(parsed.messages) || "";
      const model  = parsed.model;

      // Handle client disconnect -> abort the upstream request
      const ac = new AbortController();
      const { signal } = ac;
      req.on("close", () => {
        try { ac.abort(new Error("client closed")); } catch {}
      });

      let finalText = "";

      // Stream chunks as SSE "data" events
      const onChunk = (chunk, evt) => {
        finalText += chunk;
        // Keep payload small (just the chunk); add more fields if you need them
        res.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
      };

      try {
        
        const full = await generate(prompt, model, {
          maxChatAttempts: 5,
          maxHashAttempts: 5,
          stream: true,          // ← use streaming path
          onChunk,
          streamSignal: signal,
        });

        // Send a final event with the assembled text
        res.write(`data: ${JSON.stringify({ done: true, text: full })}\n\n`);
        // Optional end-of-stream sentinel
        res.write(`event: done\ndata: {}\n\n`);
        res.end();
      } catch (err) {
        // Stream an error as an SSE event; then end
        res.write(`event: error\ndata: ${JSON.stringify({ ok: false, error: err.message })}\n\n`);
        res.end();
      }
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: e.toString() }));
    }
  });
}

  else if (req.url === "/generate" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: false, error: "Empty body" }));
      }

      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
      }
      try{
        console.log(parsed)
      const prompt = parsed.prompt || JSON.stringify(parsed.messages) || "";
      
      generate(prompt, parsed.model, { maxChatAttempts: 5, maxHashAttempts: 5 })
        .then(d => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ response: d, ok: true, available_models }));
        })
        .catch(err => {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: err.message }));
        });
      }
      catch(e){
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: e.toString()}));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: 'not found' }));
  }
});

function isJson(s){
  try{
    JSON.parse(s)
    return true
  }
  catch{
    return false
  }
}
const { exec } = require("child_process");
const NO_INDEX_WARNING = 'Warning: index.html for frontend page not found. You can keep using POST /generate API'
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  const url = `http://localhost:${PORT}`;
  
  if(fs.existsSync('index.html')){
    setTimeout(()=>{
    // Open default browser depending on OS
  switch (process.platform) {
    case "darwin": // macOS
      exec(`open ${url}`);
      break;
    case "win32": // Windows
      exec(`start ${url}`);
      break;
    default: // Linux, etc.
      exec(`xdg-open ${url}`);
  }
  },200)
}else{
  console.log(NO_INDEX_WARNING)
}
});
