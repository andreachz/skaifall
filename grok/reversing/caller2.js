// ----- Simulated modules -----

// This represents the "module" that would have been loaded from chunk 84383766740feaa1.js
function module880932() {
  console.log("Module 880932 loaded and executed");
}

// This represents the "default export" of module 483347
function module483347() {
  return async function (n, r) {
    console.log("Module 483347 executed with:", n, r);
    return { n, r, status: "ok" };
  };
}

// ----- Rewritten logic -----

// Simulated initialization logic
async function initModule() {
  // In the original code, this loaded the chunk before running module 880932
  module880932();
}

// Equivalent of async function tH(n, r)
let t;
async function tH(n, r) {
  // Only initialize once
  t = t || (async () => {
    const mod = module483347();
    return mod;
  })();

  const i = await t;
  return await i(n, r);
}

// Simulated TURBOPACK global registration
globalThis.TURBOPACK = globalThis.TURBOPACK || [];
globalThis.TURBOPACK.push([
  null,
  880932,
  x => {
    "use strict";
    function _(x, e) {
      console.log("Executing TURBOPACK module with args:", x, e);
    }
    return _;
  }
]);

// ----- Run demo -----
(async () => {



    let tJ = async e => {
        var t, n;
        let r, o = (0,
        i.v4)();
        null != e.init || (e.init = {}),
        null != (t = e.init).headers || (t.headers = {});
        try {
            r = await tH(function(e) {
                var t;
                return (null == (t = (new URL(e).pathname || "").split("?")[0]) ? void 0 : t.trim()) || ""
            }(e.url), null != (n = e.init.method) ? n : "")
        } catch (e) {
            r = btoa("e:".concat(e))
        }
        return e.init.headers instanceof Headers ? (e.init.headers.set("x-xai-request-id", o),
        e.init.headers.set("x-statsig-id", r)) : Array.isArray(e.init.headers) ? (e.init.headers.push(["x-xai-request-id", o]),
        e.init.headers.push(["x-statsig-id", r])) : (e.init.headers["x-xai-request-id"] = o,
        e.init.headers["x-statsig-id"] = r),
        e
}

    async function tH(n, r) {
        t = t || new Promise(t => {
            e.A(483347).then(e => t(e.default()))
        }
        );
        let i = await t;
        return await i(n, r)
    }

    

})();
