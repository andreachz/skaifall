// run.mjs  — Node 22+, package.json has "type":"module"
import { JSDOM } from 'jsdom';
import vm from 'node:vm';
import { mkdtemp, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { webcrypto as _webcrypto } from 'node:crypto';

// ────────────────────────────────────────────────────────────────────────────
// 1) Put your URLs here
// ────────────────────────────────────────────────────────────────────────────
const urls = [
  "https://cdn.oaistatic.com/assets/nmomwuducrwleuqh.js",
  "https://cdn.oaistatic.com/assets/i3wdlecy1t2dcwiy.js",
  "https://cdn.oaistatic.com/assets/h7tehyd6zylti1q7.js",
  "https://cdn.oaistatic.com/assets/fy4vpvrxtof39u5p.js",
  "https://cdn.oaistatic.com/assets/dikscyx1nuejyer4.js",
  "https://cdn.oaistatic.com/assets/idur26lyckfvnt31.js",
  "https://cdn.oaistatic.com/assets/irp4pz64s34glzmj.js",
  "https://cdn.oaistatic.com/assets/ca2us2qs3f68s9ry.js",
  "https://cdn.oaistatic.com/assets/l90zbsoke0eix2je.js",
  "https://cdn.oaistatic.com/assets/lp1rjw2z0vrgc6k1.js",
  "https://cdn.oaistatic.com/assets/iygghies3h8qpu4w.js",
  "https://cdn.oaistatic.com/assets/muhrifnijxggyl5f.js",
  "https://cdn.oaistatic.com/assets/cbz15e0cxvl0442t.js",
  "https://cdn.oaistatic.com/assets/m9yip46lysssn740.js",
  "https://cdn.oaistatic.com/assets/jp992l3tv1ef8fkx.js",
  "https://cdn.oaistatic.com/assets/jn859i8hjnv96vds.js",
  "https://cdn.oaistatic.com/assets/nbd33dz5n23gnd2s.js",
  "https://cdn.oaistatic.com/assets/n7kvya4234zg47mn.js",
  "https://cdn.oaistatic.com/assets/l9wijtp2vuvxmkvw.js",
  "https://cdn.oaistatic.com/assets/fqtae2ssshl6slzr.js",
  "https://cdn.oaistatic.com/assets/gcrocb6js9hc9zdh.js",
  "https://cdn.oaistatic.com/assets/iu8450g9cer63nv0.js",
  "https://cdn.oaistatic.com/assets/l4vv9j1hbmbfsen3.js",
  "https://cdn.oaistatic.com/assets/jfvlzvkg7md66lvb.js",
  "https://cdn.oaistatic.com/assets/jd2113hq7g7fbt58.js",
  "https://cdn.oaistatic.com/assets/qslru0itzlylna6e.js",
  "https://cdn.oaistatic.com/assets/bmdm17k5d789kpzy.js",
  "https://cdn.oaistatic.com/assets/kv528je916le1x9m.js",
  "https://cdn.oaistatic.com/assets/manifest-88200d41.js",
  "https://cdn.oaistatic.com/assets/i2i0n43zeu7c4jdz.js",
  "https://chatgpt.com/cdn-cgi/challenge-platform/scripts/jsd/main.js",
  "https://chatgpt.com/cdn-cgi/challenge-platform/h/b/scripts/jsd/4710d66e8fda/main.js?",
  "https://cdn.oaistatic.com/assets/hzpnxiaprhsv9y8t.js",
  "https://cdn.oaistatic.com/assets/m1pm4q7m5876myz6.js",
  "https://cdn.oaistatic.com/assets/d1f23pxhp6s9gqww.js",
  "https://cdn.oaistatic.com/assets/f07ym3zwkon753gg.js",
  "https://cdn.oaistatic.com/assets/h19hujkoeek5ket8.js",
  "https://cdn.oaistatic.com/assets/jkswffffn2z9sxyf.js",
  "https://cdn.oaistatic.com/assets/lnnha7bufk7xj9c4.js",
  "https://cdn.oaistatic.com/assets/g5xss51i2fnipa09.js",
  "https://cdn.oaistatic.com/assets/jy1u8exw8iz2slve.js",
  "https://cdn.oaistatic.com/assets/j5ud5v0i4ika4dmv.js",
  "https://cdn.oaistatic.com/assets/jedj5taws1s45l7l.js",
  "https://cdn.oaistatic.com/assets/ibccabnghyqsrvqa.js",
  "https://cdn.oaistatic.com/assets/y3htg79ypf06si1t.js",
  "https://cdn.oaistatic.com/assets/mvaxavcyowoxchiw.js",
  "https://cdn.oaistatic.com/assets/mzwxa7pxjt5199w1.js",
  "https://cdn.oaistatic.com/assets/gqmc6a5akv8bmqs4.js",
  "https://cdn.oaistatic.com/assets/k958sj58v8qhi4yl.js",
  "https://cdn.oaistatic.com/assets/gy64pge8qevmvg7e.js",
  "https://cdn.oaistatic.com/assets/ea5zn7cfb669mwb7.js",
  "https://cdn.oaistatic.com/assets/hlfjyjsfandwq5w7.js",
  "https://cdn.oaistatic.com/assets/hr1jxjlj1dg97qd3.js",
  "https://cdn.oaistatic.com/assets/k7almatubuutvteo.js",
  "https://cdn.oaistatic.com/assets/bk8slwxjkdlmxjxm.js",
  "https://cdn.oaistatic.com/assets/dklpfqmk9be8e34i.js",
  "https://cdn.oaistatic.com/assets/dvvq8906zdejts10.js",
  "https://cdn.oaistatic.com/assets/bv9rbrwnhy0dvjm8.js",
  "https://cdn.oaistatic.com/assets/iwjwharuv9vki1qd.js",
  "https://cdn.oaistatic.com/assets/i8h5dwr4g19v1ols.js",
  "https://cdn.oaistatic.com/assets/btagl6w1gub4aw61.js",
  "https://cdn.oaistatic.com/assets/led2gm2weqxo2h4t.js",
  "https://cdn.oaistatic.com/assets/nal619esg4iuhjih.js",
  "https://cdn.oaistatic.com/assets/ietb9iwi3wycwybj.js",
  "https://cdn.oaistatic.com/assets/ha1zvldf77r5iz84.js",
  "https://cdn.oaistatic.com/assets/kxcmcdh91myuhkpm.js",
  "https://cdn.oaistatic.com/assets/hp08qw6yu0x90xkd.js",
  "https://cdn.oaistatic.com/assets/dnvts3wq7koebctz.js",
  "https://cdn.oaistatic.com/assets/l0qtu71josb07hm8.js",
  "https://cdn.oaistatic.com/assets/n1xy8tniciomwdoa.js",
  "https://cdn.oaistatic.com/assets/oqyy1xfq5y51tstr.js",
  "https://cdn.oaistatic.com/assets/rewo0in9bigbvzj8.js",
  "https://cdn.oaistatic.com/assets/jltichaz9j61zkd5.js",
  "https://cdn.oaistatic.com/assets/li7pieivaa2r0yvc.js",
  "https://cdn.oaistatic.com/assets/kx1smtqcgos2143d.js",
  "https://cdn.oaistatic.com/assets/g3djnvxh2fzbkek4.js",
  "https://cdn.oaistatic.com/assets/iwxu2mkmqh1qxllo.js",
  "https://cdn.oaistatic.com/assets/e7cf0a25ztaqwlyr.js",
  "https://cdn.oaistatic.com/assets/jnf2l5unw8mzowox.js",
  "https://cdn.oaistatic.com/assets/cp2fsqqcuwx0ylyi.js",
  "https://cdn.oaistatic.com/assets/lmbrpyhqdlix9lem.js",
  "https://cdn.oaistatic.com/assets/l8i9t2b3w2pkkbqp.js",
  "https://cdn.oaistatic.com/assets/ggkurdk6hipiebw2.js",
  "https://cdn.oaistatic.com/assets/e9hlrjn1io8wic6w.js",
  "https://cdn.oaistatic.com/assets/jl0rczxbwjds8ey8.js",
  "https://cdn.oaistatic.com/assets/nwttiv6ibyv45ih0.js",
  "https://cdn.oaistatic.com/assets/b2fj8fwdkmnfo0q1.js",
  "https://cdn.oaistatic.com/assets/dgmim51f9dofz936.js",
  "https://cdn.oaistatic.com/assets/iej0cupg2dqkmejt.js",
  "https://cdn.oaistatic.com/assets/grnxdq17alg5v6s9.js",
  "https://cdn.oaistatic.com/assets/jfczbuj560s6tpyk.js",
  "https://cdn.oaistatic.com/assets/em0igz1msu53db9g.js",
  "https://cdn.oaistatic.com/assets/o7egb2mupk10sx44.js",
  "https://cdn.oaistatic.com/assets/f4ntg0lqonoyt97w.js",
  "https://cdn.oaistatic.com/assets/er6w4zlzh7ddnln0.js",
  "https://cdn.oaistatic.com/assets/e8anvoryrb24nah4.js",
  "https://cdn.oaistatic.com/assets/itghmgc7untq68ba.js",
  "https://cdn.oaistatic.com/assets/ojwjo1r48z2s9vzz.js",
  "https://cdn.oaistatic.com/assets/3cr8k6gchi0f8n26.js",
  "https://cdn.oaistatic.com/assets/kfxvjr41z57ra76n.js",
  "https://cdn.oaistatic.com/assets/k86w0qym35iw0dny.js",
  "https://cdn.oaistatic.com/assets/eo2atlp13ggeevmh.js",
  "https://cdn.oaistatic.com/assets/n5zdsiyipshr3smc.js",
  "https://cdn.oaistatic.com/assets/jytok0y60jby55om.js",
  "https://cdn.oaistatic.com/assets/k7ycgpkodxbns0va.js",
  "https://cdn.oaistatic.com/assets/c0zax7gkhjidj8rn.js",
  "https://cdn.oaistatic.com/assets/livekit-client.e2ee.worker-s9h8y0dQ.js",
];

// ────────────────────────────────────────────────────────────────────────────
// 2) jsdom env for CLASSIC scripts
// ────────────────────────────────────────────────────────────────────────────
const dom = new JSDOM(`<!doctype html><html><body></body></html>`, {
  url: 'https://chatgpt.com/',
  pretendToBeVisual: true,
  runScripts: 'outside-only',
});

Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  self: dom.window,
  location: dom.window.location,
  // crypto: globalThis.crypto ?? _webcrypto,
});
try {
  Object.defineProperty(globalThis, 'navigator', {
    get: () => dom.window.navigator,
    configurable: true,
  });
} catch {}
globalThis.HTMLElement ??= dom.window.HTMLElement;
if (dom.window.customElements) globalThis.customElements ??= dom.window.customElements;
globalThis.atob ??= (s) => Buffer.from(s, 'base64').toString('binary');
globalThis.btoa ??= (s) => Buffer.from(s, 'binary').toString('base64');
globalThis.requestAnimationFrame ??= (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.ResizeObserver ??= class { observe(){} unobserve(){} disconnect(){} };

// ────────────────────────────────────────────────────────────────────────────
const ESM_IMPORT_RE =
  /\bimport\s*(?:[\w*{}\s,]*from\s*)?["']([^"']+)["']\s*;?|\bimport\(\s*["']([^"']+)["']\s*\)/g;

function isProbablyESM(src) {
  // quick but decent heuristic
  return /\b(import|export)\s/.test(src);
}

function sanitizeFileName(name) {
  // make a safe local filename (strip query/hash)
  return name.replace(/[?#].*$/, '').replace(/[^a-zA-Z0-9._-]/g, '_') || 'mod.mjs';
}

function toAbsoluteURL(spec, baseURL) {
  try {
    if (/^https?:\/\//i.test(spec)) return spec;
    if (spec.startsWith('/')) return new URL(spec, new URL(baseURL).origin).href;
    return new URL(spec, baseURL).href; // handles ./ and ../
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 3) ESM fetch/cache/transform loader
//    Recursively downloads ESM and its deps into a single temp dir.
// ────────────────────────────────────────────────────────────────────────────
async function createTempDir() {
  return mkdtemp(join(tmpdir(), 'remote-esm-'));
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.text();
}

async function ensureDir(p) {
  await mkdir(p, { recursive: true }).catch(() => {});
}

// Cache map: remoteURL -> localPath
const fetched = new Map();

async function fetchESMRec(url, outDir, stack = new Set()) {
  if (fetched.has(url)) return fetched.get(url);
  if (stack.has(url)) throw new Error(`Circular import detected at ${url}`);
  stack.add(url);

  const code = await fetchText(url);
  const baseName = sanitizeFileName(url.split('/').pop() || 'mod.mjs');
  const localPath = join(outDir, baseName);

  // Transform import specifiers to local files
  const deps = [];
  const rewritten = code.replace(ESM_IMPORT_RE, (m, s1, s2) => {
    const spec = s1 || s2; // static or dynamic
    const abs = toAbsoluteURL(spec, url);
    if (!abs) return m; // leave as-is if we can't resolve
    deps.push(abs);
    const localDepName = sanitizeFileName(abs.split('/').pop() || 'dep.mjs');
    // Keep imports relative to this file’s folder
    const rel = `./${localDepName}`;
    // Rebuild the matched import keeping original form
    if (s1) return m.replace(s1, rel);
    if (s2) return m.replace(s2, rel);
    return m;
  });

  await ensureDir(dirname(localPath));
  await writeFile(localPath, rewritten, 'utf8');
  fetched.set(url, localPath);

  // Recurse deps
  for (const dep of deps) {
    // If dep looks classic (ends .js but not ESM), we still fetch as ESM;
    // most CDN chunks use ESM; if not, import will throw later.
    await fetchESMRec(dep, outDir, stack);
  }

  stack.delete(url);
  return localPath;
}

// ────────────────────────────────────────────────────────────────────────────
// 4) Classic vs ESM loader
// ────────────────────────────────────────────────────────────────────────────
async function loadClassic(code, label) {
  vm.runInContext(code, dom.getInternalVMContext(), { filename: label });
}

async function loadESMFromURL(entryURL, outDir) {
  const entryLocal = await fetchESMRec(entryURL, outDir);
  const mod = await import(pathToFileURL(entryLocal).href);
  return mod;
}

async function loadAuto(url, outDir) {
  const code = await fetchText(url);

  // First try heuristic
  if (isProbablyESM(code)) {
    await loadESMFromURL(url, outDir);
    return { url, ok: true, type: 'esm' };
  }

  // Try classic; if it throws the "import statement" error, retry as ESM
  try {
    await loadClassic(code, url);
    return { url, ok: true, type: 'classic' };
  } catch (e) {
    if (/\bimport\b[\s(]/.test(code) || /Cannot use import statement outside a module/.test(String(e))) {
      await loadESMFromURL(url, outDir);
      return { url, ok: true, type: 'esm(fallback)' };
    }
    throw e;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 5) Run
// ────────────────────────────────────────────────────────────────────────────
const outDir = await createTempDir();
const results = [];

for (const url of urls) {
  try {
    const r = await loadAuto(url, outDir);
    console.log(`✅ ${r.type} loaded: ${url}`);
    results.push({ url, ok: true, type: r.type });
  } catch (err) {
    console.error(`❌ Failed: ${url} → ${err?.message || err}`);
    results.push({ url, ok: false, reason: String(err?.message || err) });
  }
}

console.log('\n— SUMMARY —');
const ok = results.filter(r => r.ok).length;
console.log(`Loaded ${ok}/${results.length}`);
console.log('Sample window keys:', Object.keys(window).slice(0, 40));
