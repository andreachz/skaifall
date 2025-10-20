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
  console.log(res)
    res.client_hashes = await Promise.all(
        res.client_hashes.map(x => sha256Base64(x))
    )
    
    res.meta.origin = "https://duckduckgo.com"
    res.meta.stack = "Error\nat l (https://duckduckgo.com/dist/wpm.main.26e905c8fd9c901bbbeb.js:1:364990)\nat async https://duckduckgo.com/dist/wpm.main.26e905c8fd9c901bbbeb.js:1:340615"
    res.meta.duration = "7"
    
    return res
}


// const https = require('https');

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

    const encoded = ''|| headers['x-vqd-hash-1'];
    if (!encoded) {
      // No point retrying for "missing header" unless you want to; treat as a hard error.
      throw new Error('Missing x-vqd-hash-1 header in response.');
    }

    const decoded = atob(encoded);

    try {
      // Your original logic: eval the decoded script/payload
      const resultOfEval = await eval(decoded); // eslint-disable-line no-eval

      // Then build the plain result using your existing buildDuckHash
      /* global buildDuckHash */
      const plain = await buildDuckHash(resultOfEval);
    //   console.log(plain)
      // Return base64-encoded JSON string (same as your console "b64 result")
      let hashB64 = btoa(JSON.stringify(plain));
      console.log(plain)
      console.log('hash attempt', attempt)
      return {plain, hashB64}
    } catch (err) {
      // Only retry on eval failure, as requested
      lastError = err;
      if (attempt >= maxAttempts) break;
      // loop continues → fetch fresh headers and try again
    }
  }

  // If we’re here, all eval attempts failed
  const msg = lastError && lastError.stack ? lastError.stack : String(lastError || 'Unknown eval error');
  throw new Error(`Failed to compute hash after ${maxAttempts} attempt(s): ${msg}`);
}
/* eslint-disable no-console */
/**
 * Minimal HTTPS API for your DuckChat "generate" function.
 * - Native https (no Express)
 * - JSON POST /v1/generate { prompt, options? }
 * - CORS, health check, timeouts, small body limit
 *
 * Requires Node 18+ (global fetch).
 */

"use strict";

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

// --------- BEGIN: your duckchat logic (uses your existing getDuckChatHash) ---------
// const { getDuckChatHash } = require("./duckchat-hash"); // <-- implement/export in your project

// Helper b64 (Node)
const btoa = (str) => Buffer.from(str, "utf8").toString("base64");

/**
 * Call once with current hashes. Returns { ok, text?, errorAction? }.
 * Requires getDuckChatHash() to exist (as in your snippet).
 */
async function chatOnce(prompt, { plain, hashB64 }) {
  const startTs = parseInt(plain?.meta?.timestamp, 10);
  if (!Number.isFinite(startTs)) {
    throw new Error("chatOnce: invalid plain.meta.timestamp");
  }

  // Build x-fe-signals (your original logic, keep as-is)
  const xfesignals = btoa(JSON.stringify({ start: startTs - 1111, events: [], end: 10630 }));

  const resp = await fetch("https://duckduckgo.com/duckchat/v1/chat", {
    method: "POST",
    headers: {
      accept: "text/event-stream",
      "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-fe-signals": xfesignals,
      "x-fe-version": "serp_20250901_205406_ET-d5c1d30fb1f0d32e28b0",
      "x-vqd-hash-1": hashB64,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
      Referer: "https://duckduckgo.com/",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      metadata: {
        toolChoice: { NewsSearch: false, VideosSearch: false, LocalSearch: false, WeatherForecast: false },
      },
      messages: [{ role: "user", content: prompt }],
      canUseTools: true,
      canUseApproxLocation: false,
    }),
  });

  const allText = await resp.text();
  console.log(allText,'xx')
  // function isJson(d){
  //   try{
  //     JSON.parse(d)
  //     return true
  //   }
  //   catch{
  //     return false
  //   }
  // }

  // if(isJson(allText)){
  //   let m = JSON.parse(allText)
  //   if(m.action == 'error'){
  //     return {ok: false, msg: m}
  //   }
  // }

  // Robust SSE parser: collect "data: " lines, stop on explicit { action: "error" }
  let out = "";
  let errorAction = null;

  for (const rawLine of allText.split("\n")) {
    const line = rawLine.trim();
    if (!line || !line.startsWith("data:")) continue;

    const jsonStr = line.replace(/^data:\s*/, "");
    try {
      const evt = JSON.parse(jsonStr);
      console.log(evt,'aa')
      if (evt && typeof evt === "object") {
        if (evt.action === "error") {
          errorAction = evt;
          break;
        }
        if (typeof evt.message === "string") out += evt.message;
      }
    } catch {
      // ignore keepalives / comments
    }
  }

  if (errorAction) return { ok: false, errorAction };
  if (out && out.trim().length) return { ok: true, text: out };
  return { ok: false, errorAction: { action: "error", error: "empty_response" } };
}

let _HASHES = null;

/**
 * Generates a reply with automatic hash refresh & chat retries.
 * @param {string} prompt
 * @param {object} [opts]
 * @param {number} [opts.maxChatAttempts=3]
 * @param {number} [opts.maxHashAttempts=15]
 * @param {object} [opts.requestOptions] - passed to getDuckChatHash
 * @returns {Promise<string>}
 */
async function generate(
  prompt,
  { maxChatAttempts = 3, maxHashAttempts = 15, requestOptions = {} } = {}
) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("generate: prompt must be a non-empty string");
  }

  let attempt = 0;
  let lastErr = null;
  let hashes = _HASHES;

  while (attempt < maxChatAttempts) {
    attempt += 1;
    try {
      if (!hashes) {
        hashes = await getDuckChatHash({ maxAttempts: maxHashAttempts, requestOptions });
      }

      const result = await chatOnce(prompt, hashes);
      if (result.ok) {
        _HASHES = hashes;
        return result.text;
      }

      hashes = null; // force refresh on next loop
      lastErr = new Error(`chat error: ${result.errorAction?.error || "unknown"}`);
      continue;
    } catch (e) {
      hashes = null;
      lastErr = e instanceof Error ? e : new Error(String(e));
      continue;
    }
  }

  const msg = lastErr?.message || "Unknown chat failure";
  throw new Error(`Failed to generate after ${maxChatAttempts} chat attempt(s): ${msg}`);
}
// --------- END: your duckchat logic ---------


// ========================= HTTPS API SERVER =========================

const PORT = Number(process.env.PORT || 8443);
const HOST = process.env.HOST || "0.0.0.0";

// TLS: paths to PEM files (no external deps)
const TLS_KEY_PATH  = process.env.TLS_KEY_PATH  || path.resolve("certs", "server.key");
const TLS_CERT_PATH = process.env.TLS_CERT_PATH || path.resolve("certs", "server.crt");
const TLS_CA_PATH   = process.env.TLS_CA_PATH   || ""; // optional

// CORS
const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || "*"; // set to your domain in prod
const CORS_ALLOW_HEADERS = "Content-Type";
const CORS_ALLOW_METHODS = "POST, OPTIONS, GET";
const BODY_LIMIT_BYTES = Number(process.env.BODY_LIMIT_BYTES || 64 * 1024); // 64KB

// Basic concurrency guard (optional)
let inFlight = 0;
const MAX_IN_FLIGHT = Number(process.env.MAX_IN_FLIGHT || 20);

// Small helper: write JSON response
function writeJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "access-control-allow-origin": CORS_ALLOW_ORIGIN,
    "access-control-allow-methods": CORS_ALLOW_METHODS,
    "access-control-allow-headers": CORS_ALLOW_HEADERS,
    "x-content-type-options": "nosniff",
  });
  res.end(body);
}

// Read & parse JSON body with size cap
function readJsonBody(req, limit = BODY_LIMIT_BYTES) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error("Payload too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        if (!raw) return resolve({});
        const json = JSON.parse(raw);
        resolve(json);
      } catch (e) {
        reject(Object.assign(new Error("Invalid JSON"), { statusCode: 400 }));
      }
    });
    req.on("error", (e) => reject(Object.assign(e, { statusCode: 400 })));
  });
}

// Route handler
async function handleRequest(req, res) {
  // Global headers (CORS)
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": CORS_ALLOW_ORIGIN,
      "access-control-allow-methods": CORS_ALLOW_METHODS,
      "access-control-allow-headers": CORS_ALLOW_HEADERS,
      "access-control-max-age": "600",
    });
    res.end();
    return;
  }

  // Normalize URL
  const u = new URL(req.url, `https://${req.headers.host || "localhost"}`);

  // Health check
  if (req.method === "GET" && (u.pathname === "/healthz" || u.pathname === "/")) {
    writeJson(res, 200, { ok: true, status: "healthy" });
    return;
  }

  // Only one API endpoint for now
  if (req.method === "POST" && u.pathname === "/v1/generate") {
    if (inFlight >= MAX_IN_FLIGHT) {
      writeJson(res, 429, { ok: false, error: "too_many_requests" });
      return;
    }

    // Request timeout (server-side)
    req.setTimeout(Number(process.env.REQUEST_TIMEOUT_MS || 60000), () => {
      try { res.writeHead(408, { "content-type": "application/json" }); } catch {}
      try { res.end(JSON.stringify({ ok: false, error: "request_timeout" })); } catch {}
    });

    inFlight++;
    try {
      const body = await readJsonBody(req);

      const prompt = body?.prompt;
      const options = body?.options || {};
      if (typeof prompt !== "string" || !prompt.trim()) {
        writeJson(res, 400, { ok: false, error: "prompt_required" });
        return;
      }

      // Whitelist options to avoid surprises
      const safeOpts = {
        maxChatAttempts: Number.isFinite(options.maxChatAttempts) ? options.maxChatAttempts : undefined,
        maxHashAttempts: Number.isFinite(options.maxHashAttempts) ? options.maxHashAttempts : undefined,
        requestOptions: options.requestOptions || {}, // passed to getDuckChatHash
      };

      const text = await generate(prompt, safeOpts);
      writeJson(res, 200, { ok: true, text });
    } catch (e) {
      const status = e?.statusCode && Number.isFinite(e.statusCode) ? e.statusCode : 500;
      writeJson(res, status, { ok: false, error: e?.message || "internal_error" });
    } finally {
      inFlight--;
    }
    return;
  }

  // Fallback 404
  writeJson(res, 404, { ok: false, error: "not_found" });
}

// Load TLS materials
function loadTlsOpts() {
  return {}
  const opts = {
    key: fs.readFileSync(TLS_KEY_PATH),
    cert: fs.readFileSync(TLS_CERT_PATH),
  };
  if (TLS_CA_PATH) {
    opts.ca = fs.readFileSync(TLS_CA_PATH);
  }
  // Strong defaults; can be tuned further if needed
  opts.honorCipherOrder = true;
  opts.minVersion = "TLSv1.2";
  return opts;
}

// Start server
function start() {
  const tlsOpts = loadTlsOpts();
  const server = http.createServer(tlsOpts, handleRequest);

  // Keep-Alive & timeouts
  server.keepAliveTimeout = Number(process.env.KEEP_ALIVE_TIMEOUT_MS || 5000);
  server.headersTimeout = Number(process.env.HEADERS_TIMEOUT_MS || 6000);
  server.requestTimeout = Number(process.env.REQUEST_TIMEOUT_MS || 60000);

  server.listen(PORT, HOST, () => {
    console.log(`[https] listening on https://${HOST}:${PORT}`);
  });

  server.on("clientError", (err, socket) => {
    try { socket.end("HTTP/1.1 400 Bad Request\r\n\r\n"); } catch {}
  });

  return server;
}

if (require.main === module) {
  start();
}

module.exports = { start, generate }; // export for tests or embedding
