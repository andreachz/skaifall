// run.mjs
import { JSDOM } from 'jsdom';
import vm from 'node:vm';
import fs from 'node:fs/promises';

const url = 'https://cdn.oaistatic.com/assets/manifest-88200d41.js';
const code = await (await fetch(url)).text();

// Create a DOM and expose globals
const dom = new JSDOM(`<!doctype html><html><body></body></html>`, {
  url: 'https://chatgpt.com/',
  pretendToBeVisual: true,
  resources: 'usable',
  runScripts: 'dangerously'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements ?? undefined; // may still be missing

// Run as a classic script (NOT ESM). If the code is an ESM module, this won’t work.
vm.runInContext(code, dom.getInternalVMContext(), { filename: 'remote.js' });

// If the script attached something to window:
console.log(Object.keys(window));
