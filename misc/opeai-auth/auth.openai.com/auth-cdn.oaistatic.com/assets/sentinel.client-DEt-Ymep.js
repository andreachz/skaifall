import {
    D as r
} from "./datadog.client-CkkgoxcC.js";

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
        await a({
            useSentinelDomain: !0
        })
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
            window.SentinelSDK.init("login_web_init")
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
    return s().then(() => {
        const t = window.SentinelSDK;
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
export {
    d as a, l as g, s
};
//# sourceMappingURL=sentinel.client-DEt-Ymep.js.map