// const Zt = t => t ? t[Lt(14)](/(%[0-9A-Z]{2})+/g, decodeURIComponent) : t;
const Zt = t => t ? t.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent) : t;

// from sdk.js
function Kt_orig(t, n) {
    const e = Lt;
    return t.id = function() {
        const t = _t.getCookies()["oai-did"];
        return void 0 === t ? void 0 : Zt(t)
    }(), t[e(4)] = n, JSON[e(37)](t)
}

function Kt(payload, flow, oai_did) {
  // Attach device id from cookie if present
  payload.id = (() => {
    let did = oai_did
    // const did = _t.getCookies()["oai-did"];
    return did === undefined ? undefined : Zt(did);
  })();

  // Attach the flow identifier
  payload["flow"] = flow;

  // Serialize the token as JSON
  return JSON.stringify(payload);
}


module.exports = {Kt}