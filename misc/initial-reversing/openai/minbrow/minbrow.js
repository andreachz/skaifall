#!/usr/bin/env node
// Minimal browser-like loader with script execution and CORS-bypassing fetch/XHR.
// - Loads HTML
// - Executes inline and external <script> via jsdom
// - Replaces window.fetch and XMLHttpRequest so page code can call cross-origin without CORS
// - Ignores script/runtime errors (logs only)
// - Waits for 'load' + a brief idle grace, then dumps the final DOM

import { JSDOM, VirtualConsole } from "jsdom";
import { writeFile } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { resolve as pathResolve } from "node:path";

const URL_ARG = process.argv[2];
const EXTRA_IDLE_MS = Number(process.argv[3] ?? 1500);
const TIMEOUT_MS = Number(process.argv[4] ?? 30000);
if (!URL_ARG) {
  console.error("Usage: node html-runner-nocors.mjs <url> [extraIdleMs=1500] [timeoutMs=30000]");
  process.exit(1);
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0.0.0 Safari/537.36";

const outDir = pathResolve(process.cwd(), "dom_artifacts_nocors");
mkdirSync(outDir, { recursive: true });

function nowISO() { return new Date().toISOString(); }

async function fetchHtml(u) {
  const res = await fetch(u, { headers: { "user-agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch HTML: ${res.status} ${res.statusText}`);
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  return { text, contentType };
}

// --- CORS-bypassing shims injected into the page ----------------------------

function installNoCorsFetchAndXHR(window) {
  // 1) FETCH: route to Node's global fetch directly (Node ignores "mode: cors")
  if (globalThis.fetch) {
    const nodeFetch = globalThis.fetch.bind(globalThis);
    window.fetch = async (input, init = {}) => {
      // Ensure a UA by default (many sites branch on UA)
      init.headers = Object.assign({ "user-agent": UA }, init.headers || {});
      return nodeFetch(input, { redirect: "follow", ...init });
    };
  }

  // 2) XHR: tiny implementation backed by Node fetch
  class NoCorsXHR {
    constructor() {
      this.readyState = 0; // UNSENT
      this.status = 0;
      this.statusText = "";
      this.responseURL = "";
      this.responseText = "";
      this.response = null;
      this.onreadystatechange = null;
      this._headers = {};
      this._method = "GET";
      this._url = "";
      this._aborted = false;
      this._controller = new AbortController();
      this.timeout = 0;
      this.ontimeout = null;
      this.onerror = null;
      this.onload = null;
    }
    open(method, url, async = true /* ignored */, user = null, pass = null) {
      this._method = method?.toUpperCase?.() || "GET";
      this._url = new URL(url, window.location.href).toString();
      this._aborted = false;
      this.readyState = 1; // OPENED
      this._fire();
    }
    setRequestHeader(name, value) {
      this._headers[name] = value;
    }
    abort() {
      this._aborted = true;
      try { this._controller.abort(); } catch {}
    }
    _timeoutArm() {
      if (this.timeout > 0) {
        setTimeout(() => {
          if (this.readyState !== 4) {
            this.ontimeout?.();
            this.abort();
          }
        }, this.timeout);
      }
    }
    async send(body = undefined) {
      if (!globalThis.fetch) throw new Error("Global fetch not available in Node.");
      this._timeoutArm();
      try {
        const res = await globalThis.fetch(this._url, {
          method: this._method,
          headers: { "user-agent": UA, ...this._headers },
          body,
          redirect: "follow",
          signal: this._controller.signal,
        });
        this.status = res.status;
        this.statusText = res.statusText || "";
        this.responseURL = res.url || this._url;
        const buf = Buffer.from(await res.arrayBuffer());
        // XHR default responseType: "", return text
        this.responseText = buf.toString("utf8");
        this.response = this.responseText;
        this.readyState = 4; // DONE
        this._fire();
        this.onload?.();
      } catch (err) {
        if (this._aborted) return;
        this.readyState = 4;
        this._fire();
        this.onerror?.(err);
      }
    }
    // Minimal event pump
    _fire() {
      try { this.onreadystatechange?.(); } catch {}
    }
    // No-ops / simple stubs for compatibility
    getAllResponseHeaders() { return ""; }
    getResponseHeader() { return null; }
    overrideMimeType() {}
    addEventListener(type, handler) {
      if (type === "readystatechange") this.onreadystatechange = handler;
      else if (type === "load") this.onload = handler;
      else if (type === "error") this.onerror = handler;
      else if (type === "timeout") this.ontimeout = handler;
    }
    removeEventListener(type, handler) {
      if (type === "readystatechange" && this.onreadystatechange === handler) this.onreadystatechange = null;
      if (type === "load" && this.onload === handler) this.onload = null;
      if (type === "error" && this.onerror === handler) this.onerror = null;
      if (type === "timeout" && this.ontimeout === handler) this.ontimeout = null;
    }
    dispatchEvent() { return false; }
  }

  window.XMLHttpRequest = NoCorsXHR;
}

// --- jsdom bootstrap & lifecycle -------------------------------------------

function createJsdom(html, pageUrl) {
  const vconsole = new VirtualConsole().sendTo(console);
  vconsole.on("jsdomError", (e) => {
    console.error("[jsdomError]", e?.stack || e?.message || String(e));
  });

  const dom = new JSDOM(html, {
    url: pageUrl,
    referrer: pageUrl,
    contentType: "text/html",
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    virtualConsole: vconsole,
    userAgent: UA,
    beforeParse(window) {
      // swallow page errors per your request
      window.addEventListener("error", (ev) => {
        try { console.error("[window.error]", ev?.error?.stack || ev?.message || String(ev)); } catch {}
        ev.preventDefault?.();
      });
      window.addEventListener("unhandledrejection", (ev) => {
        try { console.error("[unhandledrejection]", ev?.reason?.stack || ev?.reason || String(ev)); } catch {}
        ev.preventDefault?.();
      });

      // basic stubs that many sites touch
      if (!("scrollTo" in window)) window.scrollTo = () => {};
      if (!("scrollBy" in window)) window.scrollBy = () => {};
      if (!("matchMedia" in window)) window.matchMedia = () => ({ matches: false, addListener(){}, removeListener(){} });

      // Make Node's fetch visible and bypass CORS
      installNoCorsFetchAndXHR(window);
    },
  });

  return dom;
}

function waitForLoadAndIdle(window, { extraIdleMs, timeoutMs }) {
  return new Promise((resolve) => {
    let done = false;
    const t0 = Date.now();
    const finish = () => { if (done) return; done = true; resolve({ durationMs: Date.now() - t0 }); };

    const killer = setTimeout(() => {
      console.warn(`[timeout] Giving up after ${timeoutMs} ms.`);
      finish();
    }, timeoutMs);

    const afterLoadIdle = () => {
      setTimeout(() => { clearTimeout(killer); finish(); }, extraIdleMs);
    };

    if (window.document.readyState === "complete") afterLoadIdle();
    else {
      window.addEventListener("load", afterLoadIdle, { once: true });
      window.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          if (window.document.readyState !== "complete") {
            console.warn("[fallback] DOMContentLoaded reached; proceeding after idle grace.");
            afterLoadIdle();
          }
        }, extraIdleMs);
      }, { once: true });
    }
  });
}

// --- main ------------------------------------------------------------------

(async () => {
  const startedAt = nowISO();
  console.log(`Fetching ${URL_ARG} ...`);
  const { text: html, contentType } = await fetchHtml(URL_ARG);
  await writeFile(pathResolve(outDir, "document_initial.html"), html, "utf8");

  console.log("Booting jsdom with CORS-bypassing fetch/XHR ...");
  const dom = createJsdom(html, URL_ARG);
  const { window } = dom;

  const { durationMs } = await waitForLoadAndIdle(window, { extraIdleMs: EXTRA_IDLE_MS, timeoutMs: TIMEOUT_MS });

  const finalHtml = dom.serialize();
  await writeFile(pathResolve(outDir, "document_final.html"), finalHtml, "utf8");

  const summary = {
    url: URL_ARG,
    startedAt,
    finishedAt: nowISO(),
    durationMs,
    userAgent: UA,
    initialContentType: contentType,
    title: window.document.title || "",
    readyState: window.document.readyState,
  };
  await writeFile(pathResolve(outDir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");

  console.log("=== Summary ===");
  console.log(summary);
  console.log(`Artifacts saved in ${outDir}`);
})().catch((err) => {
  console.error("Fatal:", err?.stack || err);
  process.exit(1);
});
