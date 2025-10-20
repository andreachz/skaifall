
// simulator
const {store} = require('./store');

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
    if(a=='data-build'){return store.data_build || 'prod-020b38a5c1ebf6898b75c8f15a1972bba2ff83e2-c'}
}}
}
const window = {document: '', location: {search: ''}, TextEncoder}

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

// console.log(dwe()); // e.g., "plugins−[object PluginArray]" or "language−en-US"

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

console.log('page-env-emulator loaded')

// console.log(window.TextEncoder)

module.exports = {window, screen, document, navigator, performance}
// test
// setTimeout(()=>{
// console.log(getConfig())
// },1)