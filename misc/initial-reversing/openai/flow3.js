const qz = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto)
  , oR = {
    randomUUID: qz
};

function lwe(e) {
    let t = 2166136261;
    for (let n = 0; n < e.length; n++)
        t ^= e.charCodeAt(n),
        t = Math.imul(t, 16777619) >>> 0;
    return t ^= t >>> 16,
    t = Math.imul(t, 2246822507) >>> 0,
    t ^= t >>> 13,
    t = Math.imul(t, 3266489909) >>> 0,
    t ^= t >>> 16,
    (t >>> 0).toString(16).padStart(8, "0")
}

function vm(e) {
    return e[Math.floor(Math.random() * e.length)]
}
function uwe() {
    return "" + Math.random()
}
function dwe() {
    const e = vm(Object.keys(Object.getPrototypeOf(navigator)));
    try {
        return `${e}−${navigator[e].toString()}`
    } catch {
        console.log('error1')
        return `${e}`
    }
}
function Fp(e) {
    return e = JSON.stringify(e),
    window.TextEncoder ? btoa(String.fromCharCode(...new TextEncoder().encode(e))) : btoa(unescape(encodeURIComponent(e)))
}
function fwe() {
    return new Promise(e => {
        (window.requestIdleCallback || hwe)(n => {
            e(n)
        }
        , {
            timeout: 10
        })
    }
    )
}
function hwe(e) {
    return setTimeout( () => {
        e({
            timeRemaining: () => 1,
            didTimeout: !1
        })
    }
    , 0),
    0
}
function KK(e, t, n) {
    if (oR.randomUUID && !e)
        return oR.randomUUID();
    e = e || {};
    const i = e.random ?? e.rng?.() ?? Gz();
    if (i.length < 16)
        throw new Error("Random bytes length must be >= 16");
    return i[6] = i[6] & 15 | 64,
    i[8] = i[8] & 63 | 128,
    Fz(i)
}
const Ts = KK
class cwe {
    answers = new Map;
    maxAttempts = 5e5;
    requirementsSeed = uwe();
    sid = Ts();
    errorPrefix = "wQ8Lk5FbGpA2NcR9dShT6gYjU7VxZ4D";
    async initializeAndGatherData(t) {
        this._getAnswer(t)
    }
    async startEnforcement(t) {
        this._getAnswer(t)
    }
    getEnforcementTokenSync(t) {
        const n = this._getAnswer(t);
        return typeof n == "string" ? n : null
    }
    async getEnforcementToken(t, n) {
        return this._getAnswer(t, n?.forceSync)
    }
    async getRequirementsToken() {
        return this.answers.has(this.requirementsSeed) || this.answers.set(this.requirementsSeed, this._generateAnswerAsync(this.requirementsSeed, "0")),
        "gAAAAAC" + await this.answers.get(this.requirementsSeed)
    }
    getRequirementsTokenBlocking() {
        return "gAAAAAC" + this._generateRequirementsTokenAnswerBlocking()
    }
    _getAnswer(t, n=!1) {
        const r = "gAAAAAB";
        if (!t?.proofofwork?.required)
            return null;
        const {seed: s, difficulty: o} = t.proofofwork;
        if (!(typeof s == "string" && typeof o == "string"))
            return null;
        const i = this.answers.get(s);
        if (typeof i == "string")
            return i;
        if (n) {
            const a = this._generateAnswerSync(s, o)
              , l = r + a;
            return this.answers.set(s, l),
            l
        }
        return this.answers.has(s) || this.answers.set(s, this._generateAnswerAsync(s, o)),
        Promise.resolve().then(async () => r + await this.answers.get(s)).then(a => (this.answers.set(s, a),
        a))
    }
    _runCheck = (t, n, r, s, o) => {
        s[3] = o,
        s[9] = Math.round(performance.now() - t);
        const i = Fp(s);
        return lwe(n + i).substring(0, r.length) <= r ? i + "~S" : null
    }
    ;
    buildGenerateFailMessage(t) {
        return this.errorPrefix + Fp(String(t ?? "e"))
    }
    _generateAnswerSync(t, n) {
        const r = performance.now();
        try {
            const s = this.getConfig();
            for (let o = 0; o < this.maxAttempts; o++) {
                const i = this._runCheck(r, t, n, s, o);
                if (i)
                    return i
            }
        } catch (s) {
            console.log(s)
            return this.buildGenerateFailMessage(s)
        }
        return this.buildGenerateFailMessage()
    }
    async _generateAnswerAsync(t, n) {
        const r = performance.now();
        try {
            let s = null;
            const o = this.getConfig();
            for (let i = 0; i < this.maxAttempts; i++) {
                (!s || s.timeRemaining() <= 0) && (s = await fwe());
                const a = this._runCheck(r, t, n, o, i);
                if (a)
                    return a
            }
        } catch (s) {
            console.log(s)
            return this.buildGenerateFailMessage(s)
        }
        return this.buildGenerateFailMessage()
    }
    _generateRequirementsTokenAnswerBlocking() {
        let t = "e";
        const n = performance.now();
        try {
            const r = this.getConfig();
            return r[3] = 1,
            r[9] = Math.round(performance.now() - n),
            Fp(r)
        } catch (r) {
            console.log(r)
            t = Fp(String(r))
        }
        return this.errorPrefix + t
    }
    getConfig() {
        return [
        screen?.width + screen?.height,
        "" + new Date(),
        performance?.memory?.jsHeapSizeLimit,
        Math?.random(),
        navigator.userAgent,
        vm(
            Array.from(document.scripts)
            .map(t => t?.src)
            .filter(t => t)
        ),
        (
            Array.from(document.scripts || [])
            .map(t => t?.src?.match("c/[^/]*/_"))
            .filter(t => t?.length)[0] ?? []
        )[0] ?? document.documentElement.getAttribute("data-build"),
        navigator.language,
        navigator.languages?.join(","),
        Math?.random(),
        dwe(),
        vm(Object.keys(document)),
        vm(Object.keys(window)),
        performance.now(),
        this.sid,
        [...new URLSearchParams(window.location.search).keys()].join(","),
        navigator?.hardwareConcurrency,
        performance.timeOrigin
        ];
        // return [screen?.width + screen?.height, "" + new Date, performance?.memory?.jsHeapSizeLimit, Math?.random(), navigator.userAgent, vm(Array.from(document.scripts).map(t => t?.src).filter(t => t)), (Array.from(document.scripts || []).map(t => t?.src?.match("c/[^/]*/_")).filter(t => t?.length)[0] ?? [])[0] ?? document.documentElement.getAttribute("data-build"), navigator.language, navigator.languages?.join(","), Math?.random(), dwe(), vm(Object.keys(document)), vm(Object.keys(window)), performance.now(), this.sid, [...new URLSearchParams(window.location.search).keys()].join(","), navigator?.hardwareConcurrency, performance.timeOrigin]
    }
}

var ff = (e => (e.NOAUTH = "chatgpt-noauth",
e.FREEACCOUNT = "chatgpt-freeaccount",
e.PAID = "chatgpt-paid",
e))(ff || {})

class JEe {
    app = ff.NOAUTH;
    status = "idle";
    turnstileInstancePromise = null;
    enforcementTokenPromise = null;
    enforcementTokenCache = new WeakMap;
    requestStartTimeMs = 0;
    _onCompleted;
    _onError;
    async initializeAndGatherData(t) {
        this._getOrCreateInstance(t)
    }
    async _getOrCreateInstance(t) {
        return !t.turnstile?.required || t.turnstile?.dx ? null : (this.app !== t.persona && (this.app = t.persona,
        this.turnstileInstancePromise = this._getTurnstileInstancePromise()),
        this.turnstileInstancePromise ?? new O3("Turnstile instance not initialized."))
    }
    getEnforcementTokenSync(t) {
        return this.enforcementTokenCache.get(t) ?? null
    }
    async getEnforcementToken(t) {
        return t.turnstile?.dx ? wS(t.turnstile.dx) : this.startEnforcement(t).then(n => (this.enforcementTokenPromise = null,
        n ? n.toString() : null))
    }
    async startEnforcement(t) {
        return t.turnstile?.required ? t.turnstile?.dx ? wS(t.turnstile.dx).then(n => (n && this.enforcementTokenCache.set(t, n),
        n)) : this.enforcementTokenPromise !== null ? this.enforcementTokenPromise : this.enforcementTokenPromise = this._getEnforcementToken(t) : null
    }
    async _getEnforcementToken(t, n) {
        const r = await this._getOrCreateInstance(t);
        return r instanceof yg || r === null ? r : new Promise( (s, o) => {
            this.setOnCompleted(i => {
                const a = performance.now() - this.requestStartTimeMs;
                q.addAction("turnstile_get_token_success", {
                    app: this.app.toString(),
                    durationMs: a
                }),
                s(i)
            }
            ),
            this.setOnError(i => {
                if (!n)
                    this._getEnforcementToken(t, !0).then(s, o);
                else {
                    const a = performance.now() - this.requestStartTimeMs;
                    q.addAction("turnstile_get_token_error", {
                        app_release: "9d358314d30a26d59ec2f2390d079c86e2c0018f",
                        error: i,
                        app: this.app.toString(),
                        durationMs: a
                    }),
                    s(new ZEe(i))
                }
            }
            ),
            this.setStatus("ready"),
            this.requestStartTimeMs = performance.now(),
            r.reset(),
            r.execute()
        }
        )
    }
    setStatus(t) {
        this.status = t
    }
    onCompleted(t) {
        this._onCompleted?.(t)
    }
    setOnCompleted(t) {
        this._onCompleted = t
    }
    onError(t) {
        this._onError?.(t)
    }
    setOnError(t) {
        this._onError = t
    }
    onExpired() {
        this.enforcementTokenPromise = null
    }
    _getTurnstileInstancePromise(t) {
        if (this.turnstileInstancePromise !== null)
            if (t)
                this.turnstileInstancePromise.then(n => {
                    n instanceof yg || n.remove()
                }
                ),
                this.turnstileInstancePromise = null;
            else
                return this.turnstileInstancePromise;
        return this.turnstileInstancePromise = new Promise( (n, r) => {
            const s = "onloadTurnstileCallback";
            Object.defineProperty(window, s, {
                value: () => {
                    if (this.status === "ready")
                        return;
                    this.setStatus("script_loaded");
                    const {turnstile: c} = window;
                    if (c === null) {
                        this.setStatus("error"),
                        t ? (q.addAction("turnstile_instance_missing", {
                            app_release: "9d358314d30a26d59ec2f2390d079c86e2c0018f",
                            app: this.app.toString()
                        }),
                        n(new O3("Turnstile instance missing"))) : this._getTurnstileInstancePromise(!0).then(n, r);
                        return
                    }
                    c.render("#" + o, {
                        sitekey: YEe[this.app],
                        execution: "execute",
                        callback: this.onCompleted.bind(this),
                        "error-callback": this.onError.bind(this),
                        "expired-callback": this.onExpired.bind(this)
                    }),
                    n(c)
                }
            });
            const o = "cf-turnstile"
              , i = "cf-turnstile-script";
            document.getElementById(o)?.remove(),
            document.getElementById(i)?.remove();
            const a = document.createElement("div");
            a.id = o,
            a.hidden = !0,
            document.body.appendChild(a),
            this.setStatus("loading");
            const l = document.createElement("script");
            l.id = i,
            l.src = KEe + `?onload=${s}`,
            l.async = !0,
            l.defer = !0,
            l.onerror = () => {
                this.setStatus("error"),
                t ? (q.addAction("turnstile_script_load_error", {
                    app_release: "9d358314d30a26d59ec2f2390d079c86e2c0018f",
                    app: this.app.toString()
                }),
                n(new O3("Turnstile script failed to load"))) : this._getTurnstileInstancePromise(!0).then(n, r)
            }
            ,
            document.body.appendChild(l)
        }
        ),
        this.turnstileInstancePromise
    }
}
const VR = new JEe;

// ==========

const SS = new cwe
  , pwe = 0
  , mwe = 1
  , gwe = 2
  , vwe = 3
  , _we = 4
  , ywe = 5
  , bwe = 6
  , Cwe = 24
  , Swe = 7
  , wwe = 8
  , _s = 9
  , Ewe = 10
  , xwe = 11
  , Twe = 12
  , kwe = 13
  , Owe = 14
  , Awe = 15
  , XH = 16
  , Mwe = 17
  , Iwe = 18
  , Rwe = 19
  , Nwe = 23
  , Pwe = 20
  , Dwe = 21
  , Lwe = 22
  , Fwe = 25
  , jwe = 26
  , Uwe = 27
  , Bwe = 28
  , qwe = 29
  , Gwe = 30
  , Vwe = 31
  , Hwe = 32
  , zwe = 33
  , z = new Map;
  let gg = 0;


// No need for node-fetch if you're on Node.js 18 or newer

// Node.js 18+ (built-in fetch)
async function getWithCookies() {
  try {
    const response = await fetch("https://chatgpt.com", {
      method: "GET",
      headers: {
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        // "Accept": "application/json",
      },
      redirect: "follow", // so we can inspect headers before following redirects
    });

    // Extract cookies from headers
    const cookies = response.headers.get("set-cookie");
    return cookies

    // If the response also has JSON:
    try {
      const data = await response.json();
      console.log("Response JSON:", data);
    } catch {
      console.log("Response is not JSON.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}


// simulator

const screen = {
  "availHeight": 1032,
  "availLeft": 1920,
  "availTop": 0,
  "availWidth": 1920,
  "colorDepth": 24,
  "height": 1080,
  "isExtended": true,
  "onchange": null,
  "orientation": {
    "angle": 0,
    "type": "landscape-primary",
    "onchange": null
  },
  "pixelDepth": 24,
  "width": 1920
}

// const performance = {
//     memory: {jsHeapSizeLimit: 4294705152}
// }

// const navigator = {language: 'it-IT', 
//     languages: ['it-IT', 'it', 'en-US', 'en'],
//     userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'}

const document = {scripts: Array(21).fill({src:''}),
documentElement: {getAttribute: function(a){
    if(a=='data-build'){return 'prod-020b38a5c1ebf6898b75c8f15a1972bba2ff83e2-c'}
}}
}
const window = {document: '', location: {search: ''}}

// console.log(Math?.random())

// navigator-mock.js
// Create a prototype with enumerable properties (functions + getters)
const NavigatorProto = {};
Object.defineProperties(NavigatorProto, {

  hardwareConcurrency: { get() { return 12; }, enumerable: true },
  language: { get() { return "it-IT"; }, enumerable: true },
  languages: { get() { return ["it-IT", "it", "en-US", "en"]; }, enumerable: true },
  userAgent: { get() { 
    return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
           "AppleWebKit/537.36 (KHTML, like Gecko) " +
           "Chrome/139.0.0.0 Safari/537.36"; 
  }, enumerable: true },

  platform: { get() { return "Win32"; }, enumerable: true },
  vendor: { get() { return "Google Inc."; }, enumerable: true },
  webdriver: { get() { return false; }, enumerable: true },

  plugins: {
    get() {
      return {
        length: 0,
        item() { return null; },
        namedItem() { return null; },
        toString() { return "[object PluginArray]"; }
      };
    },
    enumerable: true
  },
  mimeTypes: {
    get() {
      return {
        length: 0,
        item() { return null; },
        namedItem() { return null; },
        toString() { return "[object MimeTypeArray]"; }
      };
    },
    enumerable: true
  },
  connection: {
    get() {
      return {
        downlink: 10,
        effectiveType: "4g",
        rtt: 50,
        saveData: false,
        toString() { return "[object NetworkInformation]"; }
      };
    },
    enumerable: true
  },

  // Methods
  javaEnabled: { value: () => false, enumerable: true },
  sendBeacon: { value: () => true, enumerable: true },
  vibrate: { value: () => false, enumerable: true },
  getBattery: { 
    value: () => Promise.resolve({
      charging: true,
      level: 0.85,
      toString() { return "[object BatteryManager]"; }
    }), 
    enumerable: true 
  }
});
// Instance with the above prototype
const navigator = Object.create(NavigatorProto);

// (Optional) make it look a bit like a real object
Object.defineProperty(navigator, Symbol.toStringTag, { value: "Navigator" });

// Expose globally if you like
global.navigator = navigator;

// Export for modules
// module.exports = navigator;

//  ---- test ----
function dwe() {
  const e = vm(Object.keys(Object.getPrototypeOf(navigator)));
  try {
    return `${e}−${navigator[e].toString()}`;
  } catch {
    console.log('error1');
    return `${e}`;
  }
}
function vm(e) {
  return e[Math.floor(Math.random() * e.length)];
}

console.log(dwe()); // e.g., "plugins−[object PluginArray]" or "language−en-US"

// performance.timeOrigin = new Date().valueOf()+0.7

// console.log(performance.timeOrigin)
const { performance } = require('perf_hooks');

performance.memory={jsHeapSizeLimit: 4294705152}

  function getConfig() {
        return [
        screen?.width + screen?.height,
        "" + new Date(),
        performance?.memory?.jsHeapSizeLimit,
        Math?.random(),
        navigator.userAgent,
        vm(
            Array.from(document.scripts)
            .map(t => t?.src)
            .filter(t => t)
        ),
        (
            Array.from(document.scripts || [])
            .map(t => t?.src?.match("c/[^/]*/_"))
            .filter(t => t?.length)[0] ?? []
        )[0] ?? document.documentElement.getAttribute("data-build"),
        navigator.language,
        navigator.languages?.join(","),
        Math?.random(),
        dwe(),
        vm(Object.keys(document)),
        vm(Object.keys(window)),
        performance.now(),
        this.sid,
        [...new URLSearchParams(window.location.search).keys()].join(","),
        navigator?.hardwareConcurrency,
        performance.timeOrigin
        ];
        // return [screen?.width + screen?.height, "" + new Date, performance?.memory?.jsHeapSizeLimit, Math?.random(), navigator.userAgent, vm(Array.from(document.scripts).map(t => t?.src).filter(t => t)), (Array.from(document.scripts || []).map(t => t?.src?.match("c/[^/]*/_")).filter(t => t?.length)[0] ?? [])[0] ?? document.documentElement.getAttribute("data-build"), navigator.language, navigator.languages?.join(","), Math?.random(), dwe(), vm(Object.keys(document)), vm(Object.keys(window)), performance.now(), this.sid, [...new URLSearchParams(window.location.search).keys()].join(","), navigator?.hardwareConcurrency, performance.timeOrigin]
    }

setTimeout(()=>{
console.log(getConfig())
},1)
///

setTimeout(()=>{
(async ()=>{
let cookie = await getWithCookies();
console.log(cookie,'x')

const t = SS.getRequirementsTokenBlocking();
console.log({p: t})

let body = JSON.stringify(
  {p: t} 
  // || \
  //   {
  //   "p": "gAAAAACWzMwMDAsIlNhdCBTZXAgMDYgMjAyNSAxMzowODowNyBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwxLCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTM5LjAuMC4wIFNhZmFyaS81MzcuMzYiLG51bGwsbnVsbCwiaXQtSVQiLCJpdC1JVCxpdCxlbi1VUyxlbiIsMSwiYmx1ZXRvb3Ro4oiSW29iamVjdCBCbHVldG9vdGhdIiwibG9jYXRpb24iLCJvbnRpbWV1cGRhdGUiLDkwMDc4Ni45MDAwMDAwMDYsImMxZGU3MmExLTMyYjctNGQwOS04MGUxLTkyMzRkNGM1YThjZiIsIiIsMTIsMTc1NzE1NTk4NjQ0Mi44XQ=="
  //   }
)




const oaidid = SS.sid || '1696f699-9390-4016-b451-52d1dd9cc7df'






let r = await fetch("https://chatgpt.com/backend-anon/sentinel/chat-requirements", {
  "headers": {
    "accept": "*/*",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "oai-client-version": "prod-9d358314d30a26d59ec2f2390d079c86e2c0018f",
    "oai-device-id": oaidid || "b83b32ec-805f-44f9-b36e-1007cbcb734e",
    "oai-language": "it-IT",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": cookie
  },
  "referrer": "https://chatgpt.com/",
  "body": body,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

let chatReq_ = await r.json()
console.log(chatReq_)

// const fs = require('fs')
// fs.writeFileSync('chatreq.json',JSON.stringify(chatReq_))


// SS.getEnforcementToken(chatReq_).then(d=>{console.log('enforcement token', d)})

XEe(chatReq_).then(d=>{console.log(d,'tokens')


  fetch("https://chatgpt.com/backend-anon/f/conversation", {
  "headers": {
    "accept": "text/event-stream",
    "content-type": "application/json",
    "oai-client-version": "prod-020b38a5c1ebf6898b75c8f15a1972bba2ff83e2", // you can get it from main html page chatgpt.com
    "oai-device-id": oaidid||"e0a209d7-06b6-4b2c-a989-ed7c28ba0723",
    "oai-echo-logs": "0,887,1,5264,0,62078,1,68932,0,111401,1,117072,0,203351,1,207982,0,228153",
    "oai-language": "it-IT",
    "openai-sentinel-chat-requirements-token": d.req_token || "gAAAAABovcxmrzfOtaXSgCQ5ln58a_J9XZWli8UtshG5zXCg83qu_pFs6T1sPJzTK7ylQGtFzn-1Kz6u-YAGY0KwqHckR45-qFyel8ZnEguXshSHd6h2NbuVLiG51YITaqWVGH-OMk8oS5zxmbTGf6ZQl9UgmxFg5Q_l9O1JGmxiEITXDtHan-o19hi3TUrMGmqJj3tkOPzgH-wwowDIir2Zgb3jCV4sOCBf2lrUtBdeZSQ5bV1FFvTT5t9f8JoCe9O-WjLMUHCLemwPU6_iWZBvjnL9-gC2ttg7OXNXweZ7uiaU6FOsDpv1BOS9tTNUZVtfFKmeD_5XQ4l0j0ONq0Vnc1uwxIxQ7ILoXyuh-SWx2GDDJls4orspQD7AyzRPFGIwVlE2z55X-ykop6j50T28JDsEWGy10RNFIRyQLHT__XJdUJbUTyZUa6oSlyrX69mWwbxqjt9LyyGWvja_fcdlw8ktpWsWsKOHfKMNLNKZ03MiihQeVZYbSuIJd4WP8QTzmygN9gJTgIsgXbGqnz-8ZenOTeQpsAEezM_8n8VZlGYs-JY_JII9SV_yhwFeLJiedU0Cgif54xo-JLiZzRGAKKlw2n-y4xY7PJ8Twlwc0HOWgKX5Uzgmu7ukdNYcTWO3ksNnUdO7pI6lY3Nq6APlCofEknbUNPXcg7DYasae0oite0NZUxSApNLv4bbQCHakHbPJpuiDDMdL8h6zpeP7BJYmF_13DUf8EJskgDHkgcAuXKjK_JFxv63HpdhUgYJexnItdqaEd-YNj5cCjeG3Ah94LafFJ3YKkYoz8GLa42sLcAxaK2fnlMw1JFZRKkuAR15hcUQ5Ynqs458jzqiYpMhbuV6iupwspnQ7CstDVkbyzfTZIQ0m4h2zUljqmgjaBp2b2Cp83hMF1EREKK9XSH7Cok53Y2OH0hE1ZIRDwwWnvT8hMQh15Owjybr-rPPGSNbsqlmdFRYu_xRhgdI6lhPsIcxEOOAMEf4b5eo6HjVOFiIUzQrdXHpW90Is233W1QX_CEwPLSWvXXcbDbxVp-QmswIxCvF7rSH23UM6w45xOQTu1g3nWbWfXrbEVgSQW4ubwaGWnpxhrdsjA_DSgV6wR8C1c5oAEApPPhDgr68qG5w86kwhOj9GjFitTUOZ10WAWCu83LJjguGuBAixEv5dHu3rVyNAbr54qmPPKeu3EbWrhDPBByCGcitUGMNZug_Om23k-FNbsAcfUWBWZZfEFvy6Roqs0qVs5drrKbUSEmt5ZP-XIr1atAcvRq7DRH0u6C1weL-TXlYO_UNmtdyhk_wBf1xHB-FiLaBSbeLNpnQuBPs=",
    "openai-sentinel-proof-token": d.proofToken || "gAAAAABWzMwMDAsIlN1biBTZXAgMDcgMjAyNSAyMDoxODoxNCBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1Miw1NSwiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzOS4wLjAuMCBTYWZhcmkvNTM3LjM2IixudWxsLCJwcm9kLTAyMGIzOGE1YzFlYmY2ODk4Yjc1YzhmMTVhMTk3MmJiYTJmZjgzZTIiLCJpdC1JVCIsIml0LUlUIiw4NCwibWVkaWFDYXBhYmlsaXRpZXPiiJJbb2JqZWN0IE1lZGlhQ2FwYWJpbGl0aWVzXSIsImxvY2F0aW9uIiwib25zY3JvbGwiLDIzMDI1NCwiMDhjZjQyNmEtNzA2Mi00YzlhLWFmY2EtYzJiYzJmZWQxMzljIiwiIiwxMiwxNzU3MjY4ODY0NDc5Ljld~S",
    "openai-sentinel-turnstile-token": d.turnstileToken || "TBEfBR0PERQRcU8DSnJEentvSwdzcllQd39UY3dxQH5LcUQKDgwfEQIGAAMKFQkMcURHentUR2FlRVthYnJjf3thcmxxcQ5xe19cbmZCBndmcUZRZwdxSWZfbXJIZUsFYUJDUVJfXmBgYWl7Zl8GVHxYQFVia0dgZmV8UXJxeWZiA3F7e2Zpc2RFdVdmcV5yYAdXZmtfBnl/cQpuZkVQUGJYSndrZUtMZVh1QnlYcVZkQgJyYV9gXWAGeUthewZxTVhpc2QdR3dmdWRVYl8KTWVfWHd4AkNjex51YGBbRmBrXH1vdHUGcU1YaXNkHF9QbVhKcmAGCkhWX094e18KTWRCAlZgWHxyYAZQSGR1fXtmdXl/Yh8DUG9lRkpkB1dMVQJ9V01fcWJlQgZ7YV9gAmJhS2ZmWHFCeVhxYmseClJvX2RxcltLfWtbT2N/A31ye2txUFRYZHthWXV9ZGUGf39rV1JiawJVYl8bVmAHdVlkAkd/dmZXXWQfS2RiX2AFYF8KTWVfWHF7WH1/Ym91YmJYSgFlXH1PYWVtV01YUFViaENgZQN8UmBlAm9mWHVXeV9LbVFrV2t/Ynd2dUB2aHFUemRvcn5Va2sKUn91dHdrXHJNZAJ9V3wBfWBla0ccb3V0a1JbeWZmWw59dgJDZGt4XFZidUZxa3FpSGVYU394SwZyZUUCcWFYY1ViYXlPdHV9Vn8Dcm5re3VKZVhgUVYHcXlhawJ/f3ZxYGVrR0RvdmRXZF8Kb2ICfVJ/dUNme3gCe2JfeFVgBUtPZksHVWxyXHFxfAt3dER/d3JbS31rW09jfwN9cntrQ2RiZmRmVWFpZmICR3J4dnJVa2sKUn91dHdrXHJNYgJ9UnhYdXNraEMFb2t8UGJyV3lnA1MEfwNxZGseeUtiX0JXYAd1QnFiCg4MHxECBwAFEQ0RbGIOChECEQsFHR8LEQ0Rb3JydnJvcnJ2cm9ycnZyb3JydnJvcnJ2EQIRAQYdFwARDQMAAgMHCxwFBAEEHAYBBQMXBx8VAgABChUJDFFxcUN2dUtmax5AZ1JfQmJydXZIdWRle3ZicnF2f3p/f0RKRhEbERkCHQEBDAkReUl3Rn5zahMRHxUHHh0GBhEUEVF1dnRwWwd1bHJycHBWWHB/Yl1hdE91GGZYcWR2ZUNUdnxAYVUDYHRkBkN+dmEPZWxLB1NxWXZ7f2JdYXRPdkhxcQd1bEtYc3FsZUYVHwwHChkBHBEJFX16VEZ6WWsOERsRFwAdBwAMCRFjcWhkdmZYZntET3hrYgN8e1l6VXFmfHtlB1dIdmFmcm9xWHN0SWZ/dnJ3cHZhR31kWFtRfEtmfXtvald2WxZ+YQZLZnZhZnhvVGpRd2t1UmJ1WlJ2ZlhrcnJ2d2xEdnt0f2pVcWVocWEHV3drVEB5bVRicXJvalVxZRd/ZWJQeHBhAnwMHxEDCwAEAhUJDGsDU1J/A3J5e291YmACdHtgYn1mdGV1cXZbRAoRUw==",
    "cookie": cookie
  },
  "referrer": "https://chatgpt.com/",
  // "body": "{\"action\":\"next\",\"messages\":[{\"id\":\"be85befd-4c46-4fab-a08a-ecc802d5cf7c\",\"author\":{\"role\":\"user\"},\"create_time\":1757269095.471,\"content\":{\"content_type\":\"text\",\"parts\":[\"ciao\"]},\"metadata\":{\"selected_github_repos\":[],\"selected_all_github_repos\":false,\"serialization_metadata\":{\"custom_symbol_offsets\":[]}}}],\"conversation_id\":\"68bdcbf1-82b0-8007-a6ef-f0fdaf253fce\",\"parent_message_id\":\"9f233ce9-b42a-46da-a797-6e5532ecdec9\",\"model\":\"auto\",\"timezone_offset_min\":-120,\"timezone\":\"Europe/Rome\",\"history_and_training_disabled\":true,\"conversation_mode\":{\"kind\":\"primary_assistant\"},\"enable_message_followups\":true,\"system_hints\":[],\"supports_buffering\":true,\"supported_encodings\":[\"v1\"],\"client_contextual_info\":{\"is_dark_mode\":true,\"time_since_loaded\":231,\"page_height\":911,\"page_width\":582,\"pixel_ratio\":1,\"screen_height\":1080,\"screen_width\":1920},\"paragen_cot_summary_display_override\":\"allow\",\"force_parallel_switch\":\"auto\"}",
  "body": 
  JSON.stringify({
  "action": "next",
  "messages": [
    {
      "id": "be85befd-4c46-4fab-a08a-ecc802d5cf7c",
      "author": {
        "role": "user"
      },
      "create_time": 1757269095.471,
      "content": {
        "content_type": "text",
        "parts": [
          "ciao"
        ]
      },
      "metadata": {
        "selected_github_repos": [],
        "selected_all_github_repos": false,
        "serialization_metadata": {
          "custom_symbol_offsets": []
        }
      }
    }
  ],
  // "conversation_id": "68bdcbf1-82b0-8007-a6ef-f0fdaf253fce",
  "parent_message_id": "9f233ce9-b42a-46da-a797-6e5532ecdec9",
  "model": "auto",
  "timezone_offset_min": -120,
  "timezone": "Europe/Rome",
  "history_and_training_disabled": true,
  "conversation_mode": {
    "kind": "primary_assistant"
  },
  "enable_message_followups": true,
  "system_hints": [],
  "supports_buffering": true,
  "supported_encodings": [
    "v1"
  ],
  "client_contextual_info": {
    "is_dark_mode": true,
    "time_since_loaded": 231,
    "page_height": 911,
    "page_width": 582,
    "pixel_ratio": 1,
    "screen_height": 1080,
    "screen_width": 1920
  },
  "paragen_cot_summary_display_override": "allow",
  "force_parallel_switch": "auto"
}),

  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
}).then(d=>d.text()).then(d=>console.log(d))
;

})




})();
},100)

// Get chatReq, turnstileToken, and proofToken with a fresh flow.
async function XEe(chatReq_) {
  // 1) Fresh chat requirements
  const chatReq = chatReq_

  // 2) If server says we must login, trigger the login flow
  if (chatReq.force_login) {
    Au(ctx, { fallbackScreenHint: "login" });
  }

  // 3) Fresh Turnstile token
  const turnstileToken = await VR.getEnforcementToken(chatReq);

  // 4) Fresh Proof-of-Work token
  const proofToken = await SS.getEnforcementToken(chatReq);

  // 5) Return the bundle
  return { chatReq, turnstileToken, proofToken, req_token: chatReq_.token };
}



function Ws(e) {
    function t(n, r) {
        if (zf(r))
            return e.decorate_20223_(n, r);
        Hf(n, r, e)
    }
    return Object.assign(t, e)
}

function zf(e) {
    return typeof e == "object" && typeof e.kind == "string"
}

function Hf(e, t, n) {
    ci(e, ko) || Vf(e, ko, ga({}, e[ko])),
    IW(n) || (e[ko][t] = n)
}

function ci(e, t) {
    return Gf.hasOwnProperty.call(e, t)
}

var RN = Object.assign
  , Cm = Object.getOwnPropertyDescriptor
  , Mo = Object.defineProperty
  , Gf = Object.prototype
  , L3 = [];

function Vf(e, t, n) {
    Mo(e, t, {
        enumerable: !1,
        writable: !0,
        configurable: !0,
        value: n
    })
}

var ko = Symbol("mobx-stored-annotations");

function ga() {
    return ga = Object.assign ? Object.assign.bind() : function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
                ({}).hasOwnProperty.call(n, r) && (e[r] = n[r])
        }
        return e
    }
    ,
    ga.apply(null, arguments)
}


function IW(e) {
    return e.annotationType_ === BN
}

var BN = "override"


function wS(e) {
    return new Promise( (t, n) => {
        let r = !1;
        setTimeout( () => {
            r = !0,
            t("" + gg)
        }
        , 100),
        z.set(vwe, s => {
            r || (r = !0,
            t(btoa("" + s)))
        }
        ),
        z.set(_we, s => {
            r || (r = !0,
            n(btoa("" + s)))
        }
        ),
        z.set(Gwe, (s, o, i, a) => {
            const l = Array.isArray(a)
              , c = l ? i : []
              , u = (l ? a : i) || [];
            z.set(s, (...d) => {
                if (r)
                    return;
                const p = [...z.get(_s)];
                let m;
                try {
                    if (l)
                        for (let v = 0; v < c.length; v++) {
                            const _ = c[v]
                              , y = d[v];
                            z.set(_, y)
                        }
                    z.set(_s, [...u]),
                    vg(),
                    m = z.get(o)
                } catch (v) {
                    m = "" + v
                } finally {
                    z.set(_s, p)
                }
                return m
            }
            )
        }
        );
        try {
            z.set(_s, JSON.parse(ES(atob(e), "" + z.get(XH)))),
            vg()
        } catch (s) {
            t(btoa(gg + ": " + s))
        }
    }
    )
}

