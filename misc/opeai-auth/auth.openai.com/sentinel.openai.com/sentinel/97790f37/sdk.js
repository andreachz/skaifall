var SentinelSDK = function(t) {
    "use strict";
    const n = o,
        e = function() {
            let t = !0;
            return function(n, e) {
                const r = t ? function() {
                    if (e) {
                        const t = e[o(1)](n, arguments);
                        return e = null, t
                    }
                } : function() {};
                return t = !1, r
            }
        }(),
        r = e(void 0, (function() {
            const t = o;
            return r.toString()[t(7)](t(6))[t(2)]()[t(3)](r)[t(7)]("(((.+)+)+)+$")
        }));

    function o(t, n) {
        const e = c();
        return (o = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }
    r();
    const i = [];
    for (let t = 0; t < 256; ++t) i[n(5)]((t + 256)[n(2)](16)[n(4)](1));

    function c() {
        const t = ["toLowerCase", "apply", "toString", "constructor", "slice", "push", "(((.+)+)+)+$", "search"];
        return (c = function() {
            return t
        })()
    }
    const s = function() {
            let t = !0;
            return function(n, e) {
                const r = t ? function() {
                    if (e) {
                        const t = e.apply(n, arguments);
                        return e = null, t
                    }
                } : function() {};
                return t = !1, r
            }
        }(),
        u = s(void 0, (function() {
            const t = d;
            return u[t(5)]()[t(3)](t(4))[t(5)]().constructor(u).search(t(4))
        }));

    function a() {
        const t = ["crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported", "getRandomValues", "bind", "search", "(((.+)+)+)+$", "toString"];
        return (a = function() {
            return t
        })()
    }
    let f;
    u();
    const l = new Uint8Array(16);

    function d(t, n) {
        const e = a();
        return (d = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }
    const p = w,
        h = function() {
            let t = !0;
            return function(n, e) {
                const r = t ? function() {
                    if (e) {
                        const t = e[w(3)](n, arguments);
                        return e = null, t
                    }
                } : function() {};
                return t = !1, r
            }
        }(),
        g = h(void 0, (function() {
            const t = w;
            return g[t(2)]()[t(5)]("(((.+)+)+)+$")[t(2)]()[t(4)](g).search("(((.+)+)+)+$")
        }));

    function w(t, n) {
        const e = y();
        return (w = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }
    g();
    var m = {
        randomUUID: "undefined" != typeof crypto && crypto[p(0)] && crypto[p(0)][p(1)](crypto)
    };

    function y() {
        const t = ["randomUUID", "bind", "toString", "apply", "constructor", "search"];
        return (y = function() {
            return t
        })()
    }

    function v(t, n) {
        const e = S();
        return (v = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }
    const b = function() {
            let t = !0;
            return function(n, e) {
                const r = t ? function() {
                    if (e) {
                        const t = e[v(8)](n, arguments);
                        return e = null, t
                    }
                } : function() {};
                return t = !1, r
            }
        }(),
        k = b(void 0, (function() {
            const t = v;
            return k[t(7)]()[t(4)](t(0))[t(7)]().constructor(k).search(t(0))
        }));

    function S() {
        const t = ["(((.+)+)+)+$", "rng", "random", "length", "search", "randomUUID", " is out of buffer bounds", "toString", "apply"];
        return (S = function() {
            return t
        })()
    }

    function A(t, e, r) {
        const o = v;
        if (m.randomUUID && !e && !t) return m[o(5)]();
        const c = (t = t || {})[o(2)] ?? t[o(1)]?.() ?? function() {
            const t = d;
            if (!f) {
                if ("undefined" == typeof crypto || !crypto[t(1)]) throw new Error(t(0));
                f = crypto[t(1)][t(2)](crypto)
            }
            return f(l)
        }();
        if (c.length < 16) throw new Error("Random bytes length must be >= 16");
        return c[6] = 15 & c[6] | 64, c[8] = 63 & c[8] | 128,
            function(t, e = 0) {
                const r = n;
                return (i[t[e + 0]] + i[t[e + 1]] + i[t[e + 2]] + i[t[e + 3]] + "-" + i[t[e + 4]] + i[t[e + 5]] + "-" + i[t[e + 6]] + i[t[e + 7]] + "-" + i[t[e + 8]] + i[t[e + 9]] + "-" + i[t[e + 10]] + i[t[e + 11]] + i[t[e + 12]] + i[t[e + 13]] + i[t[e + 14]] + i[t[e + 15]])[r(0)]()
            }(c)
    }
    k();
    const C = _;
    class O {
        answers = new Map;
        [C(61)] = 5e5;
        [C(15)] = function() {
            const t = function() {
                    let t = !0;
                    return function(n, e) {
                        const r = t ? function() {
                            if (e) {
                                const t = e[_(40)](n, arguments);
                                return e = null, t
                            }
                        } : function() {};
                        return t = !1, r
                    }
                }(),
                n = t(this, (function() {
                    const t = _;
                    return n[t(64)]()[t(59)](t(7))[t(64)]()[t(33)](n)[t(59)](t(7))
                }));
            return n(), "" + Math.random()
        }();
        [C(9)] = A();
        errorPrefix = C(53);
        async [C(21)](t) {
            this[C(41)](t)
        }
        async [C(55)](t) {
            this[C(41)](t)
        } [C(52)](t) {
            const n = C,
                e = this[n(41)](t);
            return typeof e === n(20) ? e : null
        }
        async getEnforcementToken(t, n) {
            const e = C;
            return this[e(41)](t, n?.[e(37)])
        }
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
        return (M = function() {
            return t
        })()
    }
    var P = new O;
    const R = function() {
            let t = !0;
            return function(n, e) {
                const r = t ? function() {
                    if (e) {
                        const t = e[yt(18)](n, arguments);
                        return e = null, t
                    }
                } : function() {};
                return t = !1, r
            }
        }(),
        U = R(void 0, (function() {
            const t = yt;
            return U[t(17)]()[t(15)](t(20))[t(17)]()[t(10)](U)[t(15)](t(20))
        }));
    U();
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

    function Ct(t) {
        return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t
    }
    var Ot = Object.freeze({
            __proto__: null,
            commonjsGlobal: At,
            getAugmentedNamespace: function(t) {
                if (t.__esModule) return t;
                var n = t.default;
                if ("function" == typeof n) {
                    var e = function t() {
                        if (this instanceof t) {
                            var e = [null];
                            return e.push.apply(e, arguments), new(Function.bind.apply(n, e))
                        }
                        return n.apply(this, arguments)
                    };
                    e.prototype = n.prototype
                } else e = {};
                return Object.defineProperty(e, "__esModule", {
                    value: !0
                }), Object.keys(t).forEach((function(n) {
                    var r = Object.getOwnPropertyDescriptor(t, n);
                    Object.defineProperty(e, n, r.get ? r : {
                        enumerable: !0,
                        get: function() {
                            return t[n]
                        }
                    })
                })), e
            },
            getDefaultExportFromCjs: Ct,
            getDefaultExportFromNamespaceIfNotNamed: function(t) {
                return t && Object.prototype.hasOwnProperty.call(t, "default") && 1 === Object.keys(t).length ? t.default : t
            },
            getDefaultExportFromNamespaceIfPresent: function(t) {
                return t && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t
            }
        }),
        _t = {},
        jt = {};

    function Et(t, n) {
        var e = qt();
        return (Et = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }
    var Tt, xt = Et,
        Mt = (Tt = !0, function(t, n) {
            var e = Tt ? function() {
                if (n) {
                    var e = n[Et(37)](t, arguments);
                    return n = null, e
                }
            } : function() {};
            return Tt = !1, e
        }),
        Pt = Mt(void 0, (function() {
            var t = Et;
            return Pt[t(9)]()[t(20)](t(39)).toString()[t(38)](Pt)[t(20)](t(39))
        }));
    Pt(), xt(8), jt[xt(32)] = function(t, n) {
        var e = xt;
        if (typeof t !== e(31)) throw new TypeError(e(41));
        for (var r = {}, o = n || {}, i = t.split(";"), c = o[e(13)] || Rt, s = 0; s < i[e(42)]; s++) {
            var u = i[s],
                a = u[e(22)]("=");
            if (!(a < 0)) {
                var f = u[e(12)](0, a)[e(0)]();
                if (null == r[f]) {
                    var l = u[e(12)](a + 1, u[e(42)])[e(0)]();
                    '"' === l[0] && (l = l[e(6)](1, -1)), r[f] = Nt(l, c)
                }
            }
        }
        return r
    }, jt[xt(33)] = function(t, n, e) {
        var r = xt,
            o = e || {},
            i = o[r(18)] || Ut;
        if ("function" != typeof i) throw new TypeError(r(27));
        if (!It[r(45)](t)) throw new TypeError(r(21));
        var c = i(n);
        if (c && !It[r(45)](c)) throw new TypeError(r(7));
        var s = t + "=" + c;
        if (null != o[r(17)]) {
            var u = o[r(17)] - 0;
            if (isNaN(u) || !isFinite(u)) throw new TypeError(r(34));
            s += "; Max-Age=" + Math[r(29)](u)
        }
        if (o[r(26)]) {
            if (!It[r(45)](o[r(26)])) throw new TypeError(r(40));
            s += r(16) + o[r(26)]
        }
        if (o[r(5)]) {
            if (!It[r(45)](o.path)) throw new TypeError(r(15));
            s += r(14) + o[r(5)]
        }
        if (o.expires) {
            if (typeof o[r(11)][r(1)] !== r(25)) throw new TypeError(r(3));
            s += "; Expires=" + o[r(11)][r(1)]()
        }
        if (o[r(30)] && (s += r(44)), o.secure && (s += r(24)), o[r(19)]) {
            switch (typeof o[r(19)] === r(31) ? o[r(19)][r(4)]() : o.sameSite) {
                case !0:
                    s += r(28);
                    break;
                case r(36):
                    s += r(23);
                    break;
                case r(35):
                    s += r(28);
                    break;
                case r(10):
                    s += r(43);
                    break;
                default:
                    throw new TypeError(r(2))
            }
        }
        return s
    };
    var Rt = decodeURIComponent,
        Ut = encodeURIComponent,
        It = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

    function Nt(t, n) {
        try {
            return n(t)
        } catch (n) {
            return t
        }
    }

    function qt() {
        var t = ["trim", "toUTCString", "option sameSite is invalid", "option expires is invalid", "toLowerCase", "path", "slice", "argument val is invalid", "use strict", "toString", "none", "expires", "substring", "decode", "; Path=", "option path is invalid", "; Domain=", "maxAge", "encode", "sameSite", "search", "argument name is invalid", "indexOf", "; SameSite=Lax", "; Secure", "function", "domain", "option encode is invalid", "; SameSite=Strict", "floor", "httpOnly", "string", "parse", "serialize", "option maxAge is invalid", "strict", "lax", "apply", "constructor", "(((.+)+)+)+$", "option domain is invalid", "argument str must be a string", "length", "; SameSite=None", "; HttpOnly", "test"];
        return (qt = function() {
            return t
        })()
    }

    function Dt(t, n) {
        var e = $t();
        return (Dt = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }

    function $t() {
        var t = ["null", "req", "hasCookie", "function", "getCookie", "(((.+)+)+)+$", "Set-Cookie", "length", "slice", "cookies", "false", "reduce", "setCookie", "replace", "hasOwnProperty", "stringify", "setCookies", "prototype", "deleteCookie", "res", "undefined", "search", "[WARN]: checkCookies was deprecated. It will be deleted in the new version. Use hasCookie instead.", "constructor", "commonjsGlobal", "call", "setHeader", "entries", "split", "indexOf", "concat", "getCookies", "cookie", "getHeader", "[WARN]: setCookies was deprecated. It will be deleted in the new version. Use setCookie instead.", "warn", "checkCookies", "apply", "toString", "headers", "__assign", "defineProperty", "getOwnPropertySymbols", "join"];
        return ($t = function() {
            return t
        })()
    }! function(t) {
        var n, e = Dt,
            r = (n = !0, function(t, e) {
                var r = n ? function() {
                    if (e) {
                        var n = e[Dt(37)](t, arguments);
                        return e = null, n
                    }
                } : function() {};
                return n = !1, r
            }),
            o = r(this, (function() {
                var t = Dt;
                return o[t(38)]()[t(21)]("(((.+)+)+)+$")[t(38)]()[t(23)](o)[t(21)](t(5))
            }));
        o();
        var i = Ot[e(24)] && Ot[e(24)][e(40)] || function() {
                var t = e;
                return i = Object.assign || function(t) {
                    for (var n, e = Dt, r = 1, o = arguments[e(7)]; r < o; r++)
                        for (var i in n = arguments[r]) Object[e(17)][e(14)][e(25)](n, i) && (t[i] = n[i]);
                    return t
                }, i[t(37)](this, arguments)
            },
            c = Ot[e(24)] && At.__rest || function(t, n) {
                var r = e,
                    o = {};
                for (var i in t) Object[r(17)][r(14)].call(t, i) && n[r(29)](i) < 0 && (o[i] = t[i]);
                if (null != t && typeof Object[r(42)] === r(3)) {
                    var c = 0;
                    for (i = Object[r(42)](t); c < i[r(7)]; c++) n[r(29)](i[c]) < 0 && Object.prototype.propertyIsEnumerable.call(t, i[c]) && (o[i[c]] = t[i[c]])
                }
                return o
            };
        Object[e(41)](t, "__esModule", {
            value: !0
        }), t[e(36)] = t[e(2)] = t.removeCookies = t[e(18)] = t[e(16)] = t[e(12)] = t[e(4)] = t[e(31)] = void 0;
        var s = jt,
            u = function() {
                return typeof window !== e(20)
            },
            a = function(t) {
                var n = e;
                void 0 === t && (t = "");
                try {
                    var r = JSON[n(15)](t);
                    return /^[\{\[]/.test(r) ? r : t
                } catch (n) {
                    return t
                }
            };
        t[e(31)] = function(t) {
            var n, r = e;
            if (t && (n = t.req), !u()) return n && n[r(9)] ? n[r(9)] : n && n.headers && n[r(39)][r(32)] ? (0, s.parse)(n.headers[r(32)]) : {};
            for (var o = {}, i = document.cookie ? document[r(32)][r(28)]("; ") : [], c = 0, a = i[r(7)]; c < a; c++) {
                var f = i[c][r(28)]("="),
                    l = f[r(8)](1)[r(43)]("=");
                o[f[0]] = l
            }
            return o
        };
        t[e(4)] = function(n, r) {
            var o = (0, t.getCookies)(r)[n];
            if (void 0 !== o) return function(t) {
                var n = e;
                return "true" === t || t !== n(10) && ("undefined" !== t ? t === n(0) ? null : t : void 0)
            }(function(t) {
                return t ? t[e(13)](/(%[0-9A-Z]{2})+/g, decodeURIComponent) : t
            }(o))
        };
        t.setCookie = function(t, n, r) {
            var o, f, l, d = e;
            r && (f = r[d(1)], l = r[d(19)], o = c(r, [d(1), d(19)]));
            var p = (0, s.serialize)(t, a(n), i({
                path: "/"
            }, o));
            if (u()) document.cookie = p;
            else if (l && f) {
                var h = l[d(33)](d(6));
                if (!Array.isArray(h) && (h = h ? [String(h)] : []), l[d(26)](d(6), h[d(30)](p)), f && f[d(9)]) {
                    var g = f[d(9)];
                    "" === n ? delete g[t] : g[t] = a(n)
                }
                if (f && f[d(39)] && f.headers[d(32)]) {
                    g = (0, s.parse)(f[d(39)][d(32)]);
                    "" === n ? delete g[t] : g[t] = a(n), f[d(39)][d(32)] = Object[d(27)](g)[d(11)]((function(t, n) {
                        var e = d;
                        return t[e(30)]("" [e(30)](n[0], "=").concat(n[1], ";"))
                    }), "")
                }
            }
        };
        t[e(16)] = function(n, r, o) {
            var i = e;
            return console[i(35)](i(34)), (0, t[i(12)])(n, r, o)
        };
        t[e(18)] = function(n, r) {
            return (0, t[e(12)])(n, "", i(i({}, r), {
                maxAge: -1
            }))
        };
        t.removeCookies = function(n, r) {
            return console[e(35)]("[WARN]: removeCookies was deprecated. It will be deleted in the new version. Use deleteCookie instead."), (0, t.deleteCookie)(n, r)
        };
        t.hasCookie = function(n, e) {
            return !!n && (0, t.getCookies)(e).hasOwnProperty(n)
        };
        t[e(36)] = function(n, r) {
            var o = e;
            return console[o(35)](o(22)), (0, t.hasCookie)(n, r)
        }
    }(_t), Ct(_t);
    const Lt = sn,
        Ft = Lt(5);
    const Gt = function() {
            const t = Lt,
                n = function() {
                    let t = !0;
                    return function(n, e) {
                        const r = t ? function() {
                            if (e) {
                                const t = e[sn(48)](n, arguments);
                                return e = null, t
                            }
                        } : function() {};
                        return t = !1, r
                    }
                }(),
                e = n(this, (function() {
                    const t = sn;
                    return e[t(33)]().search("(((.+)+)+)+$")[t(33)]()[t(31)](e)[t(1)]("(((.+)+)+)+$")
                }));
            if (e(), "undefined" != typeof document) {
                const n = document[t(23)];
                if (n?.[t(22)]) try {
                    const e = new URL(n[t(22)]);
                    if (e[t(41)].includes(t(18))) return e[t(49)] + "/backend-api/sentinel/"
                } catch {}
            }
            return Ft
        }(),
        Jt = new URL("frame.html", Gt),
        zt = (() => {
            const t = Lt;
            if (window[t(42)] === window) return !1;
            try {
                const n = new URL(window[t(24)].href);
                return Jt[t(41)] === n[t(41)]
            } catch {
                return !1
            }
        })();
    const Bt = 5e3;
    let Ht = null,
        Wt = null,
        Vt = 0;
    const Zt = t => t ? t[Lt(14)](/(%[0-9A-Z]{2})+/g, decodeURIComponent) : t;

    function Kt(t, n) {
        const e = Lt;
        return t.id = function() {
            const t = _t.getCookies()["oai-did"];
            return void 0 === t ? void 0 : Zt(t)
        }(), t[e(4)] = n, JSON[e(37)](t)
    }
    async function Qt(t, n) {
        const e = Lt;
        for (let r = 0; r < 3; r++) try {
            const r = await fetch(Gt + e(50), {
                method: e(26),
                body: Kt({
                    p: n
                }, t),
                credentials: e(45)
            })[e(28)]((t => t[e(29)]()));
            return Vt = Date[e(35)](), void(Wt = r)
        } catch (o) {
            if (r >= 2) return Kt({
                e: o[e(38)],
                p: n,
                a: r
            }, t)
        }
    }
    const Yt = Jt[Lt(49)];
    let Xt = null,
        tn = !1;
    const nn = new Map;
    let en = 0;

    function rn() {
        const t = Lt,
            n = document[t(8)](t(27));
        return n.style.display = t(32), n.src = Jt[t(21)], document[t(20)][t(6)](n), n
    }

    function on() {
        const t = ["string", "search", "getRequirementsToken", "length", "flow", "https://chatgpt.com/backend-api/sentinel/", "appendChild", "contentWindow", "createElement", "__auto", "__sentinel_token_pending", "source", "get", "race", "replace", "delete", "response", "set", "/sentinel/", "postMessage", "body", "href", "src", "currentScript", "location", "addEventListener", "POST", "iframe", "then", "json", "data", "constructor", "none", "toString", "req_", "now", "init", "stringify", "message", "getEnforcementToken", "__sentinel_init_pending", "pathname", "top", "cachedProof", "turnstile", "include", "load", "forEach", "apply", "origin", "req", "token"];
        return (on = function() {
            return t
        })()
    }

    function cn(t, n, e) {
        return new Promise(((r, o) => {
            const i = sn;

            function c() {
                const i = sn,
                    c = Lt(34) + ++en;
                nn[i(17)](c, {
                    resolve: r,
                    reject: o
                }), Xt?.[i(7)]?.[i(19)]({
                    type: t,
                    flow: n,
                    requestId: c,
                    ...e
                }, Yt)
            }
            Xt ? tn ? c() : Xt[i(25)](i(46), (() => {
                tn = !0, c()
            })) : (Xt = rn(), Xt[i(25)](i(46), (() => {
                tn = !0, c()
            })))
        }))
    }

    function sn(t, n) {
        const e = on();
        return (sn = function(t, n) {
            return e[t -= 0]
        })(t, n)
    }
    async function un(t) {
        const n = Lt;
        if (zt) throw new Error("init() should not be called from within an iframe.");
        const e = await P[n(2)]();
        return Ht = e, kt(Ht), cn(n(36), t, {
            p: e
        })
    }
    async function an(t) {
        const n = Lt;
        if (zt) throw new Error("token() should not be called from within an iframe.");
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
    return zt ? window[Lt(25)]("message", (async t => {
            const n = Lt,
                {
                    type: e,
                    flow: r,
                    requestId: o,
                    p: i
                } = t[n(30)];
            try {
                let c;
                e === n(36) ? c = await Qt(r, i) : "token" === e && (c = await async function(t, n) {
                    const e = Lt,
                        r = Date[e(35)]();
                    if (!Wt || r - Vt > 54e4) {
                        const r = await Promise[e(13)]([Qt(t, n), new Promise((e => setTimeout((() => e(Kt({
                            e: "elapsed",
                            p: n
                        }, t))), 4e3)))]);
                        if (null != r) return r
                    }
                    return Vt = 0, {
                        cachedChatReq: Wt,
                        cachedProof: Ht
                    }
                }(r, i)), t[n(11)]?.[n(19)]({
                    type: n(16),
                    requestId: o,
                    result: c
                }, {
                    targetOrigin: t[n(49)]
                })
            } catch (e) {
                t[n(11)]?.postMessage({
                    type: n(16),
                    requestId: o,
                    error: e[n(38)]
                }, {
                    targetOrigin: t[n(49)]
                })
            }
        })) : function() {
            const t = Lt;
            window.addEventListener(t(38), (n => {
                const e = t;
                if (n[e(11)] === Xt?.[e(7)]) {
                    const {
                        type: t,
                        requestId: r,
                        result: o,
                        error: i
                    } = n[e(30)];
                    if (t === e(16) && r && nn.has(r)) {
                        const {
                            resolve: t,
                            reject: n
                        } = nn[e(12)](r);
                        i ? n(i) : t(o), nn[e(15)](r)
                    }
                }
            })), !Xt && (Xt = rn(), Xt[t(25)](t(46), (() => {
                tn = !0
            })))
        }(),
        function() {
            const t = Lt;
            (!window?.[t(10)] || 0 === window?.[t(10)][t(3)]) && (window?.__sentinel_init_pending?.[t(47)]((({
                args: n,
                resolve: e
            }) => {
                un[t(48)](null, n).then(e)
            })), window[t(40)] = []), window?.[t(10)]?.forEach((({
                args: n,
                resolve: e
            }) => {
                const r = t;
                an[r(48)](null, n)[r(28)](e)
            })), window[t(10)] = []
        }(), t.init = un, t.token = an, t
}({});