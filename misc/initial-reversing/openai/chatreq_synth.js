const qz = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto)
  , oR = {
    randomUUID: qz
};

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
        return [screen?.width + screen?.height, "" + new Date, performance?.memory?.jsHeapSizeLimit, Math?.random(), navigator.userAgent, vm(Array.from(document.scripts).map(t => t?.src).filter(t => t)), (Array.from(document.scripts || []).map(t => t?.src?.match("c/[^/]*/_")).filter(t => t?.length)[0] ?? [])[0] ?? document.documentElement.getAttribute("data-build"), navigator.language, navigator.languages?.join(","), Math?.random(), dwe(), vm(Object.keys(document)), vm(Object.keys(window)), performance.now(), this.sid, [...new URLSearchParams(window.location.search).keys()].join(","), navigator?.hardwareConcurrency, performance.timeOrigin]
    }
}


// fetch("https://chatgpt.com/backend-anon/sentinel/chat-requirements", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "it-IT,it;q=0.9",
//     "cache-control": "no-cache",
//     "content-type": "application/json",
//     "oai-client-version": "prod-9d358314d30a26d59ec2f2390d079c86e2c0018f",
//     "oai-device-id": "b83b32ec-805f-44f9-b36e-1007cbcb734e",
//     "oai-language": "it-IT",
//     "pragma": "no-cache",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://chatgpt.com/",
//   "body": "{\"p\":\"gAAAAACWzMwMDAsIkZyaSBTZXAgMDUgMjAyNSAyMjoxMDo1MiBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwxLCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTM5LjAuMC4wIFNhZmFyaS81MzcuMzYiLG51bGwsInByb2QtOWQzNTgzMTRkMzBhMjZkNTllYzJmMjM5MGQwNzljODZlMmMwMDE4ZiIsIml0LUlUIiwiaXQtSVQiLDAsImxvZ2lu4oiSW29iamVjdCBOYXZpZ2F0b3JMb2dpbl0iLCJfcmVhY3RMaXN0ZW5pbmd1d2U5YjB5cDVqaCIsInJlc2l6ZUJ5Iiw3MjUuMjk5OTk5OTgyMTE4NiwiMTQ4MTAyODMtNzEzNS00NjljLThmZTItOTY4ZDYyZTE4MzE0IiwiIiwxMiwxNzU3MTAzMDUyMTk4LjFd\"}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
const SS = new cwe

const t = SS.getRequirementsTokenBlocking();

console.log({p: t})


fetch("https://chatgpt.com/backend-anon/sentinel/chat-requirements", {
  "headers": {
    "accept": "*/*",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "oai-client-version": "prod-9d358314d30a26d59ec2f2390d079c86e2c0018f",
    "oai-device-id": "b83b32ec-805f-44f9-b36e-1007cbcb734e",
    "oai-language": "it-IT",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://chatgpt.com/",
  "body": "{\"p\":\"gAAAAACWzMwMDAsIkZyaSBTZXAgMDUgMjAyNSAyMjoxMDo1MiBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwxLCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTM5LjAuMC4wIFNhZmFyaS81MzcuMzYiLG51bGwsInByb2QtOWQzNTgzMTRkMzBhMjZkNTllYzJmMjM5MGQwNzljODZlMmMwMDE4ZiIsIml0LUlUIiwiaXQtSVQiLDAsImxvZ2lu4oiSW29iamVjdCBOYXZpZ2F0b3JMb2dpbl0iLCJfcmVhY3RMaXN0ZW5pbmd1d2U5YjB5cDVqaCIsInJlc2l6ZUJ5Iiw3MjUuMjk5OTk5OTgyMTE4NiwiMTQ4MTAyODMtNzEzNS00NjljLThmZTItOTY4ZDYyZTE4MzE0IiwiIiwxMiwxNzU3MTAzMDUyMTk4LjFd\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});


// function getRequirementsTokenBlocking() {
//     return "gAAAAAC" + _generateRequirementsTokenAnswerBlocking()
// }

// const errorPrefix = "wQ8Lk5FbGpA2NcR9dShT6gYjU7VxZ4D";

// function _generateRequirementsTokenAnswerBlocking() {
//         let t = "e";
//         const n = performance.now();
//         try {
//             const r = getConfig();
//             return r[3] = 1,
//             r[9] = Math.round(performance.now() - n),
//             Fp(r)
//         } catch (r) {
//             t = Fp(String(r))
//         }
//         return errorPrefix + t
//     }
// function getConfig() {
//         return [screen?.width + screen?.height, "" + new Date, performance?.memory?.jsHeapSizeLimit, Math?.random(), navigator.userAgent, vm(Array.from(document.scripts).map(t => t?.src).filter(t => t)), (Array.from(document.scripts || []).map(t => t?.src?.match("c/[^/]*/_")).filter(t => t?.length)[0] ?? [])[0] ?? document.documentElement.getAttribute("data-build"), navigator.language, navigator.languages?.join(","), Math?.random(), dwe(), vm(Object.keys(document)), vm(Object.keys(window)), performance.now(), this.sid, [...new URLSearchParams(window.location.search).keys()].join(","), navigator?.hardwareConcurrency, performance.timeOrigin]
//     }