const puppeteer = require('puppeteer-extra');
const pupcore = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), "puppeteer-cors-"));

  const browser = await puppeteer.launch({
    executablePath: pupcore.executablePath('chrome') || '/path/to/your/chrome',
    headless: false,
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--allow-running-insecure-content",
      `--user-data-dir=${tempProfile}`,
    ],
  });

  const page = await browser.newPage();


  // 1) Listen for console messages and pick out our streaming ones
page.on('console', async (msg) => {
  if (msg.type() !== 'debug') return;
  const text = msg.text();
  if (!text.startsWith('___STREAM__ ')) return;

  // payload is after the prefix; keep it compact to avoid console limits
  try {
    const { url, chunk } = JSON.parse(text.slice('___STREAM__ '.length));
    process.stdout.write(chunk); // or route per-URL
  } catch (_) { /* ignore parse errors */ }
});

await page.evaluateOnNewDocument(() => {
  const STREAM_PREFIX = '___STREAM__ ';

  const shouldTap = (url, headers) => /conversation/.test(url);

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

            // 2) Emit via console.debug so Node can listen without exposeFunction
            // Keep the payload small & JSON-safe
            // If you worry about weird characters, base64-encode chunk instead.
            try {
              // Avoid huge logs: split very large chunks (optional)
              const MAX = 20_000; // conservative cap to dodge devtools truncation
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
            } catch (e) {
              // swallow; never break page fetch
            }
          }
        }
      }
    } catch (e) {
      // swallow – we don't want to break page fetch
      console.debug('stream tap error', String(e));
    }

    return res;
  };
});



  await page.goto('https://chatgpt.com', { waitUntil: 'domcontentloaded' });

  // Your helper to send a prompt
  async function ask(prompt = 'hi') {
    await page.waitForSelector('#prompt-textarea', { visible: true });
    await page.focus('#prompt-textarea');
    await page.keyboard.type(prompt);
    await page.keyboard.press('Enter');
  }

  console.log(await page.title());
//   await ask('Hello from Puppeteer – please stream!');

  // Optionally, also see console logs from the page
  page.on('console', (msg) => console.log('[page]', msg.text()));

  // keep the browser open
  // await browser.close();
})();

