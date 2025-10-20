let navigator = {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', webdriver: false}
let window = {
    top: {hasOwnProperty: function (prop) {let props = ['__DDG_BE_VERSION__','__DDG_FE_CHAT_HASH__']; return props.includes(prop)}},
    document: {querySelector: function(q){
        if(q=='#jsa'){
            //iframe
            return {
                getAttribute: function(a){
                    if(a=='sandbox'){
                        return 'allow-scripts allow-same-origin'
                    }
                },
                contentDocument: {
                        querySelector: function(q){
                            if(q=='meta[http-equiv="Content-Security-Policy"]'){
                                return {
                                    getAttribute: function(a){
                                        if(a=='content')
                                        return "default-src 'none'; script-src 'unsafe-inline';"
                                    }
                                }
                            }
                        }
                },
                contentWindow:{
                    visualViewport: {
                        scale: 1
                    }
                }
            }
        }
    },
    createElement: function(tag){
        return {
            srcdoc: ''
        }
    },
    body: {
        appendChild: function(el){
            
        },
        removeChild: function(el){

        }
    }
}
}
let document = window.document
window.top.document = document

setTimeout(()=>{
(async function () {
  // --- helpers & constants ---
  const BASE1 = 0x17ec; // 6124
  const BASE2 = 0x335;  // 821
  const DEBUG_KEY = "DuckDuckGo Fraud & Abuse";

  // Check 1: iframe CSP & sandbox + presence of two globals on window.top
  async function iframeCspAndGlobals() {
    const topWin = window.top;
    const iframe = topWin.document.querySelector("#jsa");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const csp = doc.querySelector('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    const sandboxVal = iframe.getAttribute("sandbox");

    const cspOk = (csp === "default-src 'none'; script-src 'unsafe-inline';");
    const sandboxOk = (sandboxVal === "allow-scripts allow-same-origin");

    const hasFE = topWin.hasOwnProperty("__DDG_FE_CHAT_HASH__");
    const hasBE = topWin.hasOwnProperty("__DDG_BE_VERSION__");

    const sum = [cspOk, sandboxOk, hasFE, hasBE].map(Number).reduce((a, b) => a + b, BASE1);
    return String(sum);
  }

  // Check 2: webdriver, iframe top.toString presence, patched built-ins on window.top
  async function automationAndPatchedBuiltins() {
    const webdriver = (navigator.webdriver === true);

    // Try to create a sandboxed iframe and see if top.toString exists
    const iframe = document.createElement("iframe");
    iframe.srcdoc = "vz95n";
    document.body.appendChild(iframe);

    let hasTopToString = false;
    if (iframe.contentWindow && iframe.contentWindow.self && iframe.contentWindow.self.top && iframe.contentWindow.self.top.toString) {
      hasTopToString = true;
    }
    document.body.removeChild(iframe);

    // Look for properties on window.top that end with _Array, _Object, etc., equal to originals
    const KEYS = ["Array", "Object", "Promise", "JSON", "Symbol", "Proxy", "Window"];
    const topKeys = Object.keys(window.top);
    const patchedMatches = topKeys.filter(name =>
      KEYS.some(k => name !== k && name.endsWith("_" + k) && window.top[name] === window.top[k])
    );
    const hasPatched = patchedMatches.length > 0;

    const sum = [webdriver, hasTopToString, hasPatched].map(Number).reduce((a, b) => a + b, BASE2);
    return String(sum);
  }

  // Make the three “client hash” values
  const results = await Promise.all([
    navigator.userAgent,
    iframeCspAndGlobals(),
    automationAndPatchedBuiltins()
  ]);

  // Build debug field by XORing "{}" with the DEBUG_KEY (cosmetic obfuscation)
  const debug = Array.from(JSON.stringify({}))
    .map((ch, i) => String.fromCharCode(ch.charCodeAt(0) ^ DEBUG_KEY.charCodeAt(i % DEBUG_KEY.length)))
    .join("");

  // Final object (a “challenge response”)
  return {
    server_hashes: [
      "86767f55591c9348",
      "sbufWO9Dl/rVo5NXwyU41GU8kwwZTvMa4+RTP9l0nhs=",
      "oKnm0qFDtEi70+uVf6PjZQ2u7Ti66W7JPR9rwRuDQ64="
    ],
    client_hashes: results,      // [userAgent, "6124..6128", "821..824"]
    signals: {},
    meta: {
      v: "4",
      challenge_id: "df9590a23b20f8e8bd4a0ca575a0f8b7f7547007e233ca06e4a27b51b1e56fd6vz95n",
      timestamp: "1756864757385",
      debug
    }
  };
})().then(d=>console.log(d))

},55)