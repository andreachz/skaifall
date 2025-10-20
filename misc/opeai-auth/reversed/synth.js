// import {SentinelSDK} from './sdk.js'
// console.log(SentinelSDK)
// window.SentinelSDK = SentinelSDK

let window = {}

import { JSDOM } from "jsdom";

// crea un documento simulato
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
const document = dom.window.document;

// sentinel.client-DEt-Ymep.js
function a({
    useSentinelDomain: e
}) {
    return new Promise((t, i) => {
        const n = document.createElement("script");
        n.type = "text/javascript", n.src = e ? "https://sentinel.openai.com/backend-api/sentinel/sdk.js" : "https://chatgpt.com/backend-api/sentinel/sdk.js", n.async = !0, n.defer = !0, n.onload = t, n.onerror = i, document.getElementsByTagName("head")[0].appendChild(n)
    })
}
const o = async () => {
    try {
        // await a({
        //     useSentinelDomain: !0
        // })
    } catch (e) {
        r.addError(e, {
            message: "Failed to load Sentinel SDK script, retrying with chatgpt.com domain"
        });
        try {
            await a({
                useSentinelDomain: !1
            })
        } catch (t) {
            throw r.addError(t, {
                message: "Failed to load Sentinel SDK script from chatgpt.com domain after trying sentinel domain"
            }), t
        }
    }
}, s = (() => {
    let e;
    return () => (e || (e = o().then(() => {
        try {
            // window.SentinelSDK.init("login_web_init")
        } catch (t) {
            r.addError(t, {
                message: "Sentinel SDK init failed"
            })
        }
    })), e)
})();

function d(e) {
    const t = {};
    return t["OpenAI-Sentinel-Token"] = e, t
}

function l(e) {
        // const t = window.SentinelSDK;
        // console.log(t)
        // t.token()
        // return
    return s().then(() => {
        const t = window.SentinelSDK;
        // console.log(t,'aa')
        if (t === void 0) return JSON.stringify({
            e: "q2n8w7x5z1"
        });
        try {
            return t.token(e)
        } catch (i) {
            return r.addError(i, {
                message: "Sentinel SDK token fetch failed",
                flow: e
            }), JSON.stringify({
                e: "k9d4s6v3b2"
            })
        }
    })
}
///

// utils-BGG_ggsw.js
function Ad(d, $) {
    const e = new Promise((t, r) => {
        setTimeout(() => {
            r(new Nd)
        }, $)
    });
    return Promise.race([d, e])
}

class Nd extends Error {
    constructor($ = "Operation timed out") {
        super($), this.name = "TimeoutError"
    }
}




const Lt = sn,

        Ft = "https://chatgpt.com/backend-api/sentinel/" || Lt(5);
// Determina l'URL base del backend/sentinel
const Gt = (function computeBaseUrl() {
  // Prova a dedurre dal <script> corrente
  if (typeof document !== "undefined") {
    const current = document.currentScript;
    if (current?.src) {
      try {
        const url = new URL(current.src);
        // Se lo script vive sotto /sentinel/, usa l'endpoint backend corrispondente
        if (url.pathname.includes("/sentinel/")) {
          return url.origin + "/backend-api/sentinel/";
        }
      } catch {
        // ignora errori di parsing
      }
    }
  }
  // Fallback globale definito altrove
  return Ft;
})();

// URL della pagina frame usata dal sentinel
const Jt = new URL("frame.html", Gt);

// Siamo dentro l’iframe del sentinel?
const zt = (() => {
  // Se non siamo in un iframe, certamente false
  if (window.top === window) return false;

  try {
    const here = new URL(window.location.href);
    // Considera "dentro" se il pathname corrisponde a quello del frame previsto
    return Jt.pathname === here.pathname;
  } catch {
    return false;
  }
})();

    function sn(t, n) {
        const e = on();
        return (sn = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }
    function on() {
        const t = ["string", "search", "getRequirementsToken", "length", "flow", "https://chatgpt.com/backend-api/sentinel/", "appendChild", "contentWindow", "createElement", "__auto", "__sentinel_token_pending", "source", "get", "race", "replace", "delete", "response", "set", "/sentinel/", "postMessage", "body", "href", "src", "currentScript", "location", "addEventListener", "POST", "iframe", "then", "json", "data", "constructor", "none", "toString", "req_", "now", "init", "stringify", "message", "getEnforcementToken", "__sentinel_init_pending", "pathname", "top", "cachedProof", "turnstile", "include", "load", "forEach", "apply", "origin", "req", "token"];
        return (on = function() {
            return t
        })()
    }
    const Bt = 5e3;
    let Ht = null,
        Wt = null,
        Vt = 0;
    const C = _;
    class O_orig {
        answers = new Map;
        // [C(61)] = 5e5;
        // [C(15)] = function() {
        //     const t = function() {
        //             let t = !0;
        //             return function(n, e) {
        //                 const r = t ? function() {
        //                     if (e) {
        //                         const t = e[_(40)](n, arguments);
        //                         return e = null, t
        //                     }
        //                 } : function() {};
        //                 return t = !1, r
        //             }
        //         }(),
        //         n = t(this, (function() {
        //             const t = _;
        //             return n[t(64)]()[t(59)](t(7))[t(64)]()[t(33)](n)[t(59)](t(7))
        //         }));
        //     return n(), "" + Math.random()
        // }();
        // [C(9)] = A();
        // errorPrefix = C(53);
        // async [C(21)](t) {
        //     this[C(41)](t)
        // }
        // async [C(55)](t) {
        //     this[C(41)](t)
        // } [C(52)](t) {
        //     const n = C,
        //         e = this[n(41)](t);
        //     return typeof e === n(20) ? e : null
        // }
        // async getEnforcementToken(t, n) {
        //     const e = C;
        //     return this[e(41)](t, n?.[e(37)])
        // }
        async getRequirementsToken() {
            const t = C;
            return !this.answers[t(24)](this[t(15)]) && this.answers[t(0)](this[t(15)], this[t(3)](this[t(15)], "0")), "gAAAAAC" + await this[t(19)][t(63)](this[t(15)])
        } [C(30)]() {
            return C(29) + this._generateRequirementsTokenAnswerBlocking()
        } [C(41)](t, n = !1) {
            const e = C,
                r = e(32);
            if (!t?.proofofwork?.[e(2)]) return null;
            const {
                seed: o,
                difficulty: i
            } = t[e(13)];
            if ("string" != typeof o || typeof i !== e(20)) return null;
            const c = this.answers[e(63)](o);
            if (typeof c === e(20)) return c;
            if (n) {
                const t = this[e(16)](o, i),
                    n = r + t;
                return this[e(19)][e(0)](o, n), n
            }
            return !this.answers[e(24)](o) && this.answers[e(0)](o, this[e(3)](o, i)), Promise[e(18)]()[e(51)]((async () => {
                const t = e;
                return r + await this[t(19)].get(o)
            })).then((t => (this[e(19)].set(o, t), t)))
        } [C(47)] = (t, n, e, r, o) => {
            const i = C;
            r[3] = o, r[9] = Math[i(43)](performance[i(10)]() - t);
            const c = T(r),
                s = function(t) {
                    const n = _;
                    let e = 2166136261;
                    for (let r = 0; r < t[n(31)]; r++) e ^= t[n(34)](r), e = Math[n(11)](e, 16777619) >>> 0;
                    return e ^= e >>> 16, e = Math[n(11)](e, 2246822507) >>> 0, e ^= e >>> 13, e = Math[n(11)](e, 3266489909) >>> 0, e ^= e >>> 16, (e >>> 0).toString(16)[n(48)](8, "0")
                }(n + c);
            return s[i(1)](0, e.length) <= e ? c + "~S" : null
        };
        [C(8)](t) {
            return this.errorPrefix + T(String(t ?? "e"))
        } [C(16)](t, n) {
            const e = C,
                r = performance.now();
            try {
                const o = this[e(35)]();
                for (let i = 0; i < this[e(61)]; i++) {
                    const c = this[e(47)](r, t, n, o, i);
                    if (c) return c
                }
            } catch (t) {
                return this[e(8)](t)
            }
            return this.buildGenerateFailMessage()
        }
        async _generateAnswerAsync(t, n) {
            const e = C,
                r = performance[e(10)]();
            try {
                let o = null;
                const i = this[e(35)]();
                for (let c = 0; c < this[e(61)]; c++) {
                    (!o || o[e(54)]() <= 0) && (o = await new Promise((t => {
                        const n = _,
                            e = window[n(5)] || x;
                        e((n => {
                            t(n)
                        }), {
                            timeout: 10
                        })
                    })));
                    const s = this[e(47)](r, t, n, i, c);
                    if (s) return s
                }
            } catch (t) {
                return this.buildGenerateFailMessage(t)
            }
            return this[e(8)]()
        } [C(22)]() {
            const t = C;
            let n = "e";
            const e = performance[t(10)]();
            try {
                const n = this[t(35)]();
                return n[3] = 1, n[9] = Math.round(performance.now() - e), T(n)
            } catch (t) {
                n = T(String(t))
            }
            return this[t(56)] + n
        } [C(35)]() {
            const t = C;
            return [screen?.[t(45)] + screen?.height, "" + new Date, performance?.[t(12)]?.[t(25)], Math?.random(), navigator.userAgent, j(Array.from(document[t(62)])[t(57)]((n => n?.[t(60)]))[t(4)]((t => t))), (Array[t(28)](document[t(62)] || [])[t(57)]((n => n?.src?.[t(14)]("c/[^/]*/_")))[t(4)]((n => n?.[t(31)]))[0] ?? [])[0] ?? document[t(50)].getAttribute(t(23)), navigator[t(17)], navigator[t(49)]?.join(","), Math?.[t(27)](), E(), j(Object[t(38)](document)), j(Object[t(38)](window)), performance[t(10)](), this[t(9)],
                [...new URLSearchParams(window[t(6)][t(59)])[t(38)]()][t(44)](","), navigator?.[t(39)], performance.timeOrigin
            ]
        }
    }
    // Helpers assumed to exist exactly like in your snippet:
    // - T(obj) -> base64(JSON.stringify(obj)), using TextEncoder if available
    // - j(arr) -> returns a random element from array
    // - E()    -> picks a random navigator prop name and returns "<name>−<value.toString()>"
    // - x(cb)  -> requestIdleCallback polyfill
    // And the globals it reads: screen, navigator, performance, document, window.

    class O {
    // stringslist[19] = "answers"
    answers = new Map();

    // stringslist[61] = "maxAttempts"
    maxAttempts = 500000;

    // stringslist[56] = "errorPrefix"  (the original constant)
    errorPrefix = "wQ8Lk5FbGpA2NcR9dShT6gYjU7VxZ4D";

    // stringslist[9] = "sid"
    // stringslist[15] = "requirementsSeed"
    // The original obfuscated code had fancier initializers; these are faithful & sufficient.
    sid = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(16).slice(2);
    requirementsSeed = Math.random().toString(16).slice(2);

    // stringslist[21] = "initializeAndGatherData"  (not used directly in your active subset)

    // stringslist[2]  = "required" (used via challenge.proofofwork.required)
    // stringslist[13] = "proofofwork"
    // stringslist[32] = "gAAAAAB"
    // stringslist[41] = "_getAnswer"
    _getAnswer(challenge, forceSync = false) {
        const TOKEN_PREFIX = "gAAAAAB";
        if (!challenge?.proofofwork?.required) return null;

        const { seed, difficulty } = challenge.proofofwork;
        if (typeof seed !== "string" || typeof difficulty !== "number") return null;

        const cached = this.answers.get(seed);
        if (typeof cached === "string") return cached; // already solved string

        if (forceSync) {
        const answer = this._generateAnswerSync(seed, difficulty);
        const full = TOKEN_PREFIX + answer;
        this.answers.set(seed, full);
        return full;
        }

        // Seed a pending promise if not present, then return promise that resolves to full token
        if (!this.answers.has(seed)) {
        this.answers.set(seed, this._generateAnswerAsync(seed, difficulty));
        }
        return Promise.resolve()
        .then(async () => TOKEN_PREFIX + await this.answers.get(seed))
        .then(full => (this.answers.set(seed, full), full));
    }

    // stringslist[47] = "_runCheck"
    // internal hashing/check function used by both sync/async generators
    _runCheck(startTimeMs, seed, difficulty, state, attemptIndex) {
        // mutate the probe state with attempt index & elapsed
        state[3] = attemptIndex;
        state[9] = Math.round(performance.now() - startTimeMs);

        // encode the probe state to base64
        const packed = T(state);

        // simple FNV-like hash over (seed + packed)
        const fnvHex = (input) => {
        let h = 0x811c9dc5 >>> 0;
        for (let i = 0; i < input.length; i++) {
            h ^= input.charCodeAt(i);
            h = Math.imul(h, 16777619) >>> 0;
        }
        // extra mixing like the original
        h ^= h >>> 16; h = Math.imul(h, 2246822507) >>> 0;
        h ^= h >>> 13; h = Math.imul(h, 3266489909) >>> 0;
        h ^= h >>> 16;
        return (h >>> 0).toString(16).padStart(8, "0");
        };

        const digest = fnvHex(seed + packed);

        // Acceptance rule: if digest.substring(0, difficulty.length) <= difficultyString
        // (The original compares lexicographically using .substring <= e)
        if (digest.substring(0, String(difficulty).length) <= String(difficulty)) {
        return packed + "~S";
        }
        return null;
    }

    // stringslist[8] = "buildGenerateFailMessage"
    buildGenerateFailMessage(err) {
        return this.errorPrefix + T(String(err ?? "e"));
    }

    // stringslist[16] = "_generateAnswerSync"
    _generateAnswerSync(seed, difficulty) {
        const started = performance.now();
        try {
        const state = this.getConfig();
        for (let i = 0; i < this.maxAttempts; i++) {
            const ok = this._runCheck(started, seed, difficulty, state, i);
            if (ok) return ok;
        }
        } catch (e) {
        return this.buildGenerateFailMessage(e);
        }
        return this.buildGenerateFailMessage();
    }

    // stringslist[3] = "_generateAnswerAsync"
    async _generateAnswerAsync(seed, difficulty) {
        const started = performance.now();
        try {
        let idleDeadline = null;
        const state = this.getConfig();

        for (let i = 0; i < this.maxAttempts; i++) {
            // throttle to idle slices
            if (!idleDeadline || idleDeadline.timeRemaining() <= 0) {
            idleDeadline = await new Promise((res) => {
                const ric = window.requestIdleCallback || x; // x is the polyfill from your snippet
                ric((deadline) => res(deadline), { timeout: 10 });
            });
            }
            const ok = this._runCheck(started, seed, difficulty, state, i);
            if (ok) return ok;
        }
        } catch (e) {
        return this.buildGenerateFailMessage(e);
        }
        return this.buildGenerateFailMessage();
    }

    // stringslist[22] = "_generateRequirementsTokenAnswerBlocking"
    _generateRequirementsTokenAnswerBlocking() {
        let packedFallback = "e";
        const started = performance.now();
        try {
        const state = this.getConfig();
        state[3] = 1; // single attempt marker
        state[9] = Math.round(performance.now() - started);
        return T(state);
        } catch (e) {
        packedFallback = T(String(e));
        }
        return this.errorPrefix + packedFallback;
    }

    // stringslist[30] = "getRequirementsTokenBlocking"
    getRequirementsTokenBlocking() {
        return "gAAAAAC" + this._generateRequirementsTokenAnswerBlocking();
    }

    // stringslist[2] = "required"  (used above)
    // stringslist[29] = "gAAAAAC"
    // stringslist[24] = "has"
    // stringslist[0]  = "set"
    // stringslist[19] = "answers"
    // stringslist[63] = "get"
    // stringslist[15] = "requirementsSeed"
    // stringslist[21] = "initializeAndGatherData" (conceptually)
    async getRequirementsToken() {
        if (!this.answers.has(this.requirementsSeed)) {
        this.answers.set(this.requirementsSeed, this._generateAnswerAsync(this.requirementsSeed, "0"));
        }
        return "gAAAAAC" + await this.answers.get(this.requirementsSeed);
    }

    // stringslist[35] = "getConfig"
    // Builds the fingerprint-ish probe array used by the PoW/answer generation.
    getConfig() {
        // stringslist lookups used below (names shown directly instead)
        return [
        // screen.width + screen.height
        (typeof screen !== "undefined" ? (screen.width + screen.height) : 0),

        // "" + new Date
        String(new Date()),

        // performance?.memory?.jsHeapSizeLimit
        (typeof performance !== "undefined" && performance.memory ? performance.memory.jsHeapSizeLimit : undefined),

        // Math.random()
        Math.random(),

        // navigator.userAgent
        (typeof navigator !== "undefined" ? navigator.userAgent : ""),

        // sample of <script src> values (truthy), filtered & mapped
        j(
            Array.from((typeof document !== "undefined" ? document.scripts : [])).map(n => n?.src).filter(Boolean)
        ),

        // a specific script pattern's length or <html data-build> attribute
        (Array.from((typeof document !== "undefined" ? document.scripts : []) || [])
            .map(n => n?.src?.match("c/[^/]*/_"))
            .map(m => m?.length)[0] ?? [])[0]
            ?? (typeof document !== "undefined" ? document.documentElement.getAttribute("data-build") : null),

        // navigator.language
        (typeof navigator !== "undefined" ? navigator.language : undefined),

        // navigator.languages?.join(",")
        (typeof navigator !== "undefined" && Array.isArray(navigator.languages) ? navigator.languages.join(",") : undefined),

        // Math.random()
        Math.random(),

        // E() – random navigator prop name & value
        E(),

        // a random own key from document
        j(Object.keys(typeof document !== "undefined" ? document : {})),

        // a random own key from window
        j(Object.keys(typeof window !== "undefined" ? window : {})),

        // performance.now()
        (typeof performance !== "undefined" ? performance.now() : 0),

        // this.sid
        this.sid,

        // URLSearchParams(window.location.search) entries joined by ","
        (typeof window !== "undefined" && window.location ?
            [...new URLSearchParams(window.location.search).keys()].join(",") :
            ""),

        // navigator?.hardwareConcurrency
        (typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined),

        // performance.timeOrigin
        (typeof performance !== "undefined" ? performance.timeOrigin : undefined),
        ];
    }
    }


    function _(t, n) {
        const e = M();
        return (_ = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }

    function j(t) {
        const n = C;
        return t[Math[n(36)](Math.random() * t[n(31)])]
    }

    function E() {
        const t = C,
            n = j(Object[t(38)](Object[t(65)](navigator)));
        try {
            return n + "−" + navigator[n][t(64)]()
        } catch {
            return "" + n
        }
    }

    function T(t) {
        const n = C;
        return t = JSON[n(26)](t), window[n(58)] ? btoa(String[n(42)](...(new TextEncoder)[n(46)](t))) : btoa(unescape(encodeURIComponent(t)))
    }

    function x(t) {
        return setTimeout((() => {
            t({
                timeRemaining: () => 1,
                didTimeout: !1
            })
        }), 0), 0
    }

    function M() {
        const t = ["set", "substring", "required", "_generateAnswerAsync", "filter", "requestIdleCallback", "location", "(((.+)+)+)+$", "buildGenerateFailMessage", "sid", "now", "imul", "memory", "proofofwork", "match", "requirementsSeed", "_generateAnswerSync", "language", "resolve", "answers", "string", "initializeAndGatherData", "_generateRequirementsTokenAnswerBlocking", "data-build", "has", "jsHeapSizeLimit", "stringify", "random", "from", "gAAAAAC", "getRequirementsTokenBlocking", "length", "gAAAAAB", "constructor", "charCodeAt", "getConfig", "floor", "forceSync", "keys", "hardwareConcurrency", "apply", "_getAnswer", "fromCharCode", "round", "join", "width", "encode", "_runCheck", "padStart", "languages", "documentElement", "then", "getEnforcementTokenSync", "wQ8Lk5FbGpA2NcR9dShT6gYjU7VxZ4D", "timeRemaining", "startEnforcement", "errorPrefix", "map", "TextEncoder", "search", "src", "maxAttempts", "scripts", "get", "toString", "getPrototypeOf"];
        console.log(t.map((x,i)=>{return{x,i}}))
        return (M = function() {
            return t
        })()
    }


    const I = 0,
        N = 1,
        q = 2,
        D = 3,
        $ = 4,
        L = 5,
        F = 6,
        G = 24,
        J = 7,
        z = 8,
        B = 9,
        H = 10,
        W = 11,
        V = 12,
        Z = 13,
        K = 14,
        Q = 15,
        Y = 16,
        X = 17,
        tt = 18,
        nt = 19,
        et = 23,
        rt = 20,
        ot = 21,
        it = 22,
        ct = 25,
        st = 26,
        ut = 27,
        at = 28,
        ft = 29,
        lt = 30,
        dt = 31,
        pt = 32,
        ht = 33,
        gt = new Map;
    let wt = 0;

    function mt() {
        const t = ["clear", "fromCharCode", "set", "abs", "match", "bind", "filter", "isArray", "charCodeAt", "get", "constructor", "scripts", "max", "stringify", "shift", "search", "length", "toString", "apply", "map", "(((.+)+)+)+$", "parse", "from"];
        return (mt = function() {
            return t
        })()
    }

    function yt(t, n) {
        const e = mt();
        return (yt = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }

    function vt() {
        const t = yt;
        for (; gt[t(9)](B)[t(16)] > 0;) {
            const [n, ...e] = gt[t(9)](B)[t(14)]();
            gt[t(9)](n)(...e), wt++
        }
    }

    function bt(t) {
        return new Promise(((n, e) => {
            const r = yt;
            let o = !1;
            setTimeout((() => {
                o = !0, n("" + wt)
            }), 100), gt.set(D, (t => {
                !o && (o = !0, n(btoa("" + t)))
            })), gt[r(2)]($, (t => {
                !o && (o = !0, e(btoa("" + t)))
            })), gt[r(2)](lt, ((t, n, e, i) => {
                const c = r,
                    s = Array[c(7)](i),
                    u = s ? e : [],
                    a = (s ? i : e) || [];
                gt.set(t, ((...t) => {
                    const e = c;
                    if (o) return;
                    const r = [...gt[e(9)](B)];
                    let i;
                    try {
                        if (s)
                            for (let n = 0; n < u[e(16)]; n++) {
                                const r = u[n],
                                    o = t[n];
                                gt[e(2)](r, o)
                            }
                        gt[e(2)](B, [...a]), vt(), i = gt[e(9)](n)
                    } catch (t) {
                        i = "" + t
                    } finally {
                        gt[e(2)](B, r)
                    }
                    return i
                }))
            }));
            try {
                gt[r(2)](B, JSON[r(21)](St(atob(t), "" + gt[r(9)](Y)))), vt()
            } catch (t) {
                n(btoa(wt + ": " + t))
            }
        }))
    }

    function kt(t) {
        (function() {
            const t = yt;
            gt[t(0)](), gt[t(2)](I, bt), gt[t(2)](N, ((n, e) => gt[t(2)](n, St("" + gt[t(9)](n), "" + gt[t(9)](e))))), gt[t(2)](q, ((n, e) => gt[t(2)](n, e))), gt.set(L, ((n, e) => {
                const r = t,
                    o = gt[r(9)](n);
                Array[r(7)](o) ? o.push(gt[r(9)](e)) : gt[r(2)](n, o + gt[r(9)](e))
            })), gt[t(2)](ut, ((n, e) => {
                const r = t,
                    o = gt[r(9)](n);
                Array[r(7)](o) ? o.splice(o.indexOf(gt[r(9)](e)), 1) : gt.set(n, o - gt[r(9)](e))
            })), gt.set(ft, ((n, e, r) => gt.set(n, gt.get(e) < gt[t(9)](r)))), gt[t(2)](ht, ((n, e, r) => {
                const o = t,
                    i = Number(gt[o(9)](e)),
                    c = Number(gt.get(r));
                gt[o(2)](n, i * c)
            })), gt.set(F, ((n, e, r) => gt[t(2)](n, gt[t(9)](e)[gt[t(9)](r)]))), gt[t(2)](J, ((n, ...e) => gt[t(9)](n)(...e[t(19)]((n => gt[t(9)](n)))))), gt.set(X, ((n, e, ...r) => gt.set(n, gt[t(9)](e)(...r[t(19)]((n => gt[t(9)](n))))))), gt[t(2)](Z, ((n, e, ...r) => {
                const o = t;
                try {
                    gt[o(9)](e)(...r)
                } catch (t) {
                    gt[o(2)](n, "" + t)
                }
            })), gt[t(2)](z, ((n, e) => gt.set(n, gt[t(9)](e)))), gt[t(2)](H, window), gt[t(2)](W, ((n, e) => gt.set(n, (Array[t(22)](document[t(11)] || [])[t(19)]((n => n?.src?.[t(4)](gt[t(9)](e))))[t(6)]((n => n?.[t(16)]))[0] ?? [])[0] ?? null))), gt[t(2)](V, (t => gt.set(t, gt))), gt[t(2)](K, ((n, e) => gt[t(2)](n, JSON[t(21)]("" + gt.get(e))))), gt[t(2)](Q, ((n, e) => gt.set(n, JSON[t(13)](gt[t(9)](e))))), gt[t(2)](tt, (n => gt[t(2)](n, atob("" + gt[t(9)](n))))), gt[t(2)](nt, (t => gt.set(t, btoa("" + gt.get(t))))), gt.set(rt, ((n, e, r, ...o) => gt[t(9)](n) === gt[t(9)](e) ? gt.get(r)(...o) : null)), gt[t(2)](ot, ((n, e, r, o, ...i) => Math[t(3)](gt.get(n) - gt.get(e)) > gt[t(9)](r) ? gt[t(9)](o)(...i) : null)), gt.set(et, ((n, e, ...r) => void 0 !== gt[t(9)](n) ? gt[t(9)](e)(...r) : null)), gt[t(2)](G, ((n, e, r) => gt[t(2)](n, gt.get(e)[gt[t(9)](r)][t(5)](gt.get(e))))), gt[t(2)](it, ((n, e) => {
                const r = t,
                    o = [...gt[r(9)](B)];
                gt[r(2)](B, [...e]);
                try {
                    vt()
                } catch (t) {
                    gt[r(2)](n, "" + t)
                } finally {
                    gt[r(2)](B, o)
                }
            })), gt[t(2)](dt, (n => {
                const e = t,
                    r = gt[e(9)](n) || 0;
                gt[e(2)](n, r + 1)
            })), gt[t(2)](pt, ((n, e, r, o, i) => {
                const c = t,
                    s = gt[c(9)](n) || 0,
                    u = Math[c(12)](0, s - 1);
                gt[c(2)](n, u);
                const a = gt.get(e) || 0,
                    f = gt.get(i) || 0;
                if (u === a && 1 === f) try {
                    const t = String(gt[c(9)](r) ?? "");
                    if (!t) return;
                    const n = St(atob(t), "" + gt.get(o)),
                        e = JSON.parse(n),
                        i = [...gt[c(9)](B)];
                    gt[c(2)](B, [...e]), vt(), gt[c(2)](B, i)
                } catch {}
            })), gt.set(at, (() => {})), gt.set(st, (() => {})), gt[t(2)](ct, (() => {}))
        })(), wt = 0, gt.set(Y, t)
    }

    function St(t, n) {
        const e = yt;
        let r = "";
        for (let o = 0; o < t[e(16)]; o++) r += String[e(1)](t[e(8)](o) ^ n[e(8)](o % n[e(16)]));
        return r
    }
    var At = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function cn(type, flow, extra) {
    return new Promise((resolve, reject) => {
        sendRequest()
        function sendRequest() {
        const requestId = "req_" + (++en);
        console.log(requestId)
        // resolve()
        // registra la richiesta pendente
        nn.set(requestId, { resolve, reject });

        // invia il messaggio all’iframe
        Xt?.contentWindow?.postMessage(
            {
            type,
            flow,
            requestId,
            ...extra
            },
            Yt
        );
        }
        // return
        if (Xt) {
        if (tn) {
            sendRequest();
        } else {
            Xt.addEventListener("load", () => {
            tn = true;
            sendRequest();
            });
        }
        } else {
        Xt = rn(); // crea l’iframe nascosto
        Xt.addEventListener("load", () => {
            tn = true;
            sendRequest();
        });
        }
    });
    }


        let Xt = null,
        tn = !1;
    const nn = new Map;
    let en = 0;

    var P = new O;
 const Yt = Jt[Lt(49)];
    // function rn() {
    //     const t = Lt
    //         const n = document[t(8)](t(27));
    //     return n.style.display = t(32), n.src = Jt[t(21)], document[t(20)][t(6)](n), n
    // }

    function rn() {
        console.log(Jt.href)
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = Jt.href;
  document.body.appendChild(iframe);
  return iframe;
}




const xe = l
const Se = d
const Ne = Ad


window.SentinelSDK = {token: an}



// const m = await Ne(xe("authorize_continue"), 5e3)
;(async()=>{
    console.log(Lt(8))
    // console.log(Lt(2)) // getRequirementsToken
const m = await Ne(xe("authorize_continue"), 5e3);
// console.log(m)
})()

async function an_orig(t) {
    console.log('a')
    const n = Lt;
    // if (zt) throw new Error("token() should not be called from within an iframe.");
    const e = Date[n(35)]();
    if (!Wt || e - Vt > 54e4) {
        const e = await P[n(2)](); 
        Ht = e, kt(Ht);
        const r = await cn(n(51), t, {
            p: e
        });
        if (typeof r === n(0)) return r;
        Wt = r.cachedChatReq, Ht = r[n(43)]
    }
    try {
        const e = await P[n(39)](Wt),
            r = Kt({
                p: e,
                t: Wt?.turnstile?.dx ? await bt(Wt[n(44)].dx) : null,
                c: Wt.token
            }, t);
        return Wt = null, setTimeout((async () => {
            const e = n,
                r = t + e(9),
                o = await P[e(2)]();
            Ht = o, kt(Ht), cn(e(36), r, {
                p: o
            })
        }), Bt), r
    } catch (n) {
        const e = Kt({
            e: n.message,
            p: Wt?.p
        }, t);
        return Wt = null, e
    }
}

// De-obfuscated version of `an(t)`
async function an(flow) {
  // NOTE: the original guards against being called inside the sentinel iframe:
  // if (zt) throw new Error("token() should not be called from within an iframe.");

  const now = Date.now();

  // If there is no cached challenge, or it is older than 9 minutes (540,000 ms),
  // fetch a fresh one via the iframe/back-end.
  if (!Wt || (now - Vt) > 540_000) {
    // Build a fresh "requirements" proof (fingerprint bundle)
    // console.log('a')
    const p = await P.getRequirementsToken();
    // console.log(p,'aa')
    // Cache it and (re)seed the tiny VM/runtime with this proof
    Ht = p;
    kt(Ht);
    
    // Ask the iframe/back-end for a TOKEN challenge for this flow
    const resp = await cn("token", flow, { p });
    console.log(resp)
    // If back-end already returned a final string token, just return it
    if (typeof resp === "string") {
      return resp;
    }

    // Otherwise it returned a challenge envelope + (optionally) a refreshed proof
    Wt = resp.cachedChatReq;
    Ht = resp.cachedProof;
  }

  try {
    // Compute the requirements/enforcement answer for the cached challenge.
    // (In some builds this is `_getAnswer(Wt)`; in yours it’s accessed by index.)
    const requirementsAnswer = await P.getEnforcementToken(Wt);

    // If the challenge includes a mini-VM "turnstile" program, run it to get its answer.
    const turnstileAnswer =
      (Wt?.turnstile?.dx) ? await bt(Wt.turnstile.dx) : null;

    // Compose the final serialized token (also injects device id in Kt(...))
    const tokenString = Kt({
      p: requirementsAnswer,
      t: turnstileAnswer,
      c: Wt.token
    }, flow);

    // Clear the one-shot cache…
    Wt = null;

    // …and warm up the next round in the background after 5s.
    setTimeout(async () => {
      const warmupFlow = flow + "/sentinel/";
      const p2 = await P.getRequirementsToken();
      Ht = p2;
      kt(Ht);
      // fire-and-forget init to refresh cached challenge/proof
      cn("init", warmupFlow, { p: p2 });
    }, Bt); // Bt = 5000

    return tokenString;

  } catch (err) {
    // On any failure, return a serialized *error token* so the backend can decide.
    const errorToken = Kt({ e: err.message, p: Wt?.p }, flow);
    Wt = null;
    return errorToken;
  }
}






// return ge(o, "https://auth.openai.com/api/accounts/authorize/continue", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         ...Se(m)
//     },
//     body: JSON.stringify(Ee(l.value))
// })