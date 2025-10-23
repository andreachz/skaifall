// openai-code.js
const {window, screen, document, navigator, performance} = require('./page-env-emulator.js')



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
            t = Fp(String(r))
        }
        return this.errorPrefix + t
    }
    getConfig() {
        // return [
        // screen?.width + screen?.height,
        // "" + new Date(),
        // performance?.memory?.jsHeapSizeLimit,
        // Math?.random(),
        // navigator.userAgent,
        // vm(
        //     Array.from(document.scripts)
        //     .map(t => t?.src)
        //     .filter(t => t)
        // ),
        // (
        //     Array.from(document.scripts || [])
        //     .map(t => t?.src?.match("c/[^/]*/_"))
        //     .filter(t => t?.length)[0] ?? []
        // )[0] ?? document.documentElement.getAttribute("data-build"),
        // navigator.language,
        // navigator.languages?.join(","),
        // Math?.random(),
        // dwe(),
        // vm(Object.keys(document)),
        // vm(Object.keys(window)),
        // performance.now(),
        // this.sid,
        // [...new URLSearchParams(window.location.search).keys()].join(","),
        // navigator?.hardwareConcurrency,
        // performance.timeOrigin
        // ];
        return [screen?.width + screen?.height, "" + new Date, performance?.memory?.jsHeapSizeLimit, Math?.random(), navigator.userAgent, vm(Array.from(document.scripts).map(t => t?.src).filter(t => t)), (Array.from(document.scripts || []).map(t => t?.src?.match("c/[^/]*/_")).filter(t => t?.length)[0] ?? [])[0] ?? document.documentElement.getAttribute("data-build"), navigator.language, navigator.languages?.join(","), Math?.random(), dwe(), vm(Object.keys(document)), vm(Object.keys(window)), performance.now(), this.sid, [...new URLSearchParams(window.location.search).keys()].join(","), navigator?.hardwareConcurrency, performance.timeOrigin]
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

///


// Get chatReq, turnstileToken, and proofToken with a fresh flow.
async function XEe(chatReq_) {
  // 1) Fresh chat requirements
  const chatReq = chatReq_
  
  // 2) If server says we must login, trigger the login flow
//   if (chatReq.force_login) {
//     Au(ctx, { fallbackScreenHint: "login" });
//   }
  if (chatReq.force_login) {
    // Au(ctx, { fallbackScreenHint: "login" });
    console.warn('!! ChatGPT server requires login')
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

module.exports={SS, XEe}

console.log('openai-code loaded')
