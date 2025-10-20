// ==========================
const VE = Symbol();
function DS(e) {
    return function(n) {
        const r = Symbol(void 0);
        return s => {
            if (!s)
                throw new Error(`Attempted to access scoped value without a ${e}.`);
            const o = s;
            if (r in o) {
                const i = o[r];
                if (i === VE)
                    throw new Error(`[${e}] Dependency cycle during scoped value initialization.`);
                if (i instanceof Error)
                    throw i;
                return i
            }
            try {
                o[r] = VE;
                const i = n(s);
                return o[r] = i,
                i
            } catch (i) {
                const a = i instanceof Error ? i : new Error(`[${e}] Failed to initialize scoped value: ` + i,{
                    cause: i
                });
                throw o[r] = a,
                a
            }
        }
    }
}
const en = DS("SessionContext");
const us = en(e => {
    const t = un(e)
      , n = $$(e)
      , r = new K$(D$,t.statsigPayload.user,{
        environment: {
            tier: L$
        },
        networkConfig: {
            api: "https://ab.chatgpt.com/v1",
            preventAllNetworkTraffic: !1
        },
        loggingBufferMaxSize: 100,
        disableLogging: !1,
        disableStorage: !1,
        overrideAdapter: n,
        logEventCompressionMode: CN.LogEventCompressionMode.Forced
    });
    return r.dataAdapter.setData(JSON.stringify(t.statsigPayload)),
    r.initializeSync(),
    r
}
);
function Xe(e, t, n) {
    return us(e).checkGate(t, n)
}
// ===========================
let Zwe = -1
  , qs = null;
function Jwe() {
    if (qs) {
        const {chatRequirements: e, expiration: t} = qs;
        if (Date.now() >= t)
            return qs = null,
            null;
        if (e)
            return qs = null,
            e
    }
    return null
}
// ===========================
async function Xwe(e=!1) {
    if (qs) {
        const {expiration: s, chatRequirementsPromise: o} = qs;
        if (Date.now() < s)
            try {
                return e || (qs = null),
                o
            } catch {}
        else
            o.then(i => q.addAction("chat_requirements_cache_expired", {
                app: i.persona.toString()
            }));
        qs = null
    }
    const t = SS.getRequirementsTokenBlocking();
    $we(t);
    const n = ie.safePost("/sentinel/chat-requirements", {
        requestBody: {
            p: t
        },
        authOption: Qt.SendIfAvailable
    })
      , r = ++Zwe;
    return e && (qs = {
        id: r,
        chatRequirements: null,
        chatRequirementsPromise: n.then(s => (qs?.id === r && (qs.chatRequirements = s),
        s)),
        expiration: Date.now() + Kwe
    }),
    n
}
// ===========================

function XEe(e, t) {
    const n = Xe(e, "3530414009")
      , r = !!t?.prefetchIds?.length
      , s = performance.now()
      , o = []
      , i = Jwe();
    if (i == null)
        return o.push("chatReq"),
        Xwe().then(a);
    return a(i);
    function a(l) {
        l.force_login && Au(e, {
            fallbackScreenHint: "login"
        });
        const c = VR.getEnforcementTokenSync(l);
        if (c == null)
            return o.push("turnstile"),
            VR.getEnforcementToken(l).then(u);
        return u(c);
        function u(d) {
            const f = performance.now()
              , p = SS.getEnforcementTokenSync(l);
            if (p == null)
                return o.push("proofofwork"),
                SS.getEnforcementToken(l, {
                    forceSync: r && n
                }).then(m);
            return m(p);
            function m(v) {
                const _ = String(performance.now() - f)
                  , y = o.includes("chatReq") ? "false" : "true"
                  , b = o.includes("turnstile") ? "false" : "true"
                  , S = o.includes("proofofwork") ? "false" : "true";
                return dr.hist(er.DEFAULT, "chat_req_time", [{
                    key: "wasChatReqSync",
                    value: y
                }, {
                    key: "wasTurnstileSync",
                    value: b
                }, {
                    key: "wasProofofworkSync",
                    value: S
                }], performance.now() - s),
                bm(Ot(), {
                    eventName: "chatgpt_web_completion_integrity_checks",
                    value: o.length === 0 ? "true" : "false",
                    metadata: {
                        wasChatReqSync: y,
                        wasTurnstileSync: b,
                        wasProofofworkSync: S,
                        isPrefetchInitialLoad: r ? "true" : "false",
                        powTime: _
                    }
                }),
                {
                    chatReq: l,
                    turnstileToken: d,
                    proofToken: v
                }
            }
        }
    }
}

function Sz(e) {
    return e != null && typeof e == "object" && "then"in e && typeof e.then == "function"
}
async function QEe(){
    const _e = XEe(e, i)
    , {chatReq: ee, turnstileToken: oe, proofToken: te} = Sz(_e) ? await _e : _e;
    sendRequest$({conduitToken: t, turnstileToken: n, proofToken: r})
}

async function sendRequest$({conduitToken: t, turnstileToken: n, proofToken: r}){
    xEe('e', t, n, r, 's', 'o')
}

function xEe(e, t, n, r, s, o) {
    const i = OEe(e, t, n, s, o);
    return hz(n, r, i)
}

async function *OEe(e, t, n, r, s) {
    let req = {
                headers: {
            ...sz(),
            ...t4e(t.chatReq, t.turnstileToken, t.proofToken, null),
            ...o ? {
                "x-conduit-token": o
            } : {}
    }
}
}

function t4e(e, t, n, r) {
    const s = {};
    return e?.token && (s["OpenAI-Sentinel-Chat-Requirements-Token"] = e.token),
    t && (s["OpenAI-Sentinel-Turnstile-Token"] = t),
    n && (s["OpenAI-Sentinel-Proof-Token"] = n),
    r && (s["OpenAI-Sentinel-Token"] = r),
    s
}