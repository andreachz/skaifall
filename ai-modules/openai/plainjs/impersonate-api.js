// run-curl-impersonate.js
const { spawn } = require("child_process");
const path = require("path");
// import path from "node:path";


// utils/runCurlImpersonate.js
// Node.js >= 14

function determineBinary(){
    const isMacOs = process.platform === "darwin";
    return `./bin/${isMacOs?'curl-impersonate-v0.6.1.x86_64-macos':'curl-impersonate-v0.6.1.x86_64-linux-gnu'}/curl_chrome116`
}

/**
 * Run curl-impersonate (curl_chrome116) as a child process.
 * @param {Object} opts
 * @param {string} [opts.binary] - Path to curl_chrome116 (Linux/macOS), or a WSL path if on Windows.
 *                                 Defaults to ./bin/curl-impersonate-v0.6.1.x86_64-linux-gnu/curl_chrome116
 * @param {string} opts.url - Full request URL
 * @param {("GET"|"POST"|"PUT"|"PATCH"|"DELETE")} [opts.method="GET"] - HTTP method
 * @param {Object<string,string>} [opts.headers={}] - Headers map
 * @param {string|Buffer} [opts.body] - Raw request body (e.g., JSON string or Buffer)
 * @param {number} [opts.timeoutMs=30000] - Kill the process if it exceeds this time (ms)
 * @returns {Promise<{stdout:string, stderr:string, code:number}>}
 */
function runCurlImpersonate({
  binary = path.join(
    __dirname,
    determineBinary()
  ),
  url,
  method = "GET",
  headers = {},
  body,
  timeoutMs = 30_000,
}) {
  if (!url) throw new Error("url is required");

  // Build curl args
  const args = [
    "-X",
    method,
    // keep curl quiet except for errors, and follow redirects
    "--silent",
    "--show-error",
    "--location",
  ];

  // Add headers as repeated -H "key: value"
  for (const [k, v] of Object.entries(headers)) {
    if (v == null) continue;
    args.push("-H", `${k}: ${v}`);
  }

  // Body (use --data-binary to preserve bytes exactly)
  let useStdin = false;
  if (body !== undefined) {
    if (Buffer.isBuffer(body)) {
      // Read body from stdin to preserve binary exactly
      useStdin = true;
      args.push("--data-binary", "@-");
    } else {
      args.push("--data-binary", String(body));
    }
  }

  // URL should be last for curl
  args.push(url);

  // On Windows, prefer executing via WSL if the provided binary is a Linux executable path.
  // Instead of prefixing "wsl " in the binary string (which breaks spawn),
  // we spawn "wsl" as the command and pass the binary + args as arguments.
  const isWindows = process.platform === "win32";
  const isMacOs = process.platform === "darwin";
//   console.log('bina',binary)
  const command = isWindows ? "wsl" : binary;
//   console.log('bina',command)
  
  
//   console.log(winPathInWsl)
//   const finalArgs = isWindows ? [binary, ...args] : args;
//   const finalArgs = isWindows ? [winPathInWsl, ...args] : args;
  let finalArgs 
  if(isWindows){
    let driveletter = binary.substring(0,1).toLowerCase()
    let winPathInWsl = '/mnt/'+driveletter+(binary.slice(2).replaceAll('\\','/'))
    
    finalArgs = [winPathInWsl, ...args]
    console.log(command, finalArgs)
  }
  else if (isMacOs){
    finalArgs = args
  }
  else{ //linux
    finalArgs = args
  }

//   console.log('command arguments:',finalArgs)

  return new Promise((resolve, reject) => {
    const child = spawn(command, finalArgs, {
      stdio: useStdin ? ["pipe", "pipe", "pipe"] : ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const killer = setTimeout(() => {
      timedOut = true;
      // Ensure we kill the whole process
      try {
        child.kill("SIGKILL");
      } catch (_) {}
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("error", (err) => {
      clearTimeout(killer);
      reject(err);
    });

    child.on("close", (code) => {
      clearTimeout(killer);
      if (timedOut) {
        const err = new Error(`curl_chrome116 timed out after ${timeoutMs}ms`);
        err.code = "ETIMEDOUT";
        err.stdout = stdout;
        err.stderr = stderr;
        return reject(err);
      }
      resolve({ stdout, stderr, code: code ?? -1 });
    });

    if (useStdin) {
      child.stdin.write(body);
      child.stdin.end();
    }
  });
}



const fs = require("fs");
const os = require("os");
const urlMod = require("url");

/**
 * Run curl-impersonate (curl_chrome116) as a child process.
 * @param {Object} opts
 * @param {string} [opts.binary]
 * @param {string} opts.url
 * @param {("GET"|"POST"|"PUT"|"PATCH"|"DELETE")} [opts.method="GET"]
 * @param {Object<string,string>} [opts.headers={}]
 * @param {string|Buffer} [opts.body]
 * @param {number} [opts.timeoutMs=30000]
 * @param {boolean} [opts.followRedirects=true]
 * @param {number} [opts.maxRedirects=20]
 * @param {boolean} [opts.returnHeaders=false]
 * @param {string} [opts.referrer]              // explicit referrer URL
 * @param {("no-referrer"|"strict-origin"|"origin"|"origin-when-cross-origin"|"unsafe-url")} [opts.referrerPolicy]
 * @param {("omit"|"include"|"same-origin")} [opts.credentials="omit"]
 * @param {("cors"|"no-cors"|"same-origin")} [opts.mode="cors"]
 * @param {string} [opts.origin]                // e.g. "https://example.com"
 * @param {boolean} [opts.validateCors=false]   // requires returnHeaders=true to actually validate
 * @returns {Promise<{stdout:string, stderr:string, code:number, headersRaw?:string, headers?:Record<string,string|string[]>}>}
 */
function runCurlImpersonate2({
  binary = path.join(__dirname, determineBinary()),
  url,
  method = "GET",
  headers = {},
  body,
  timeoutMs = 30_000,
  followRedirects = true,
  maxRedirects = 20,
  returnHeaders = false,
  referrer,
  referrerPolicy,
  credentials = "omit",
  mode = "cors",
  origin,
  validateCors = false,
}) {
  if (!url) throw new Error("url is required");

  // Helpers
  const getOrigin = (u) => {
    try {
      const p = new urlMod.URL(u);
      return `${p.protocol}//${p.host}`;
    } catch { return undefined; }
  };

  const reqOrigin = origin || (referrer ? getOrigin(referrer) : undefined);
  const urlOrigin = getOrigin(url);

  // same-origin mode guard
  if (mode === "same-origin") {
    if (!reqOrigin || !urlOrigin || reqOrigin !== urlOrigin) {
      throw new Error(
        `same-origin mode blocked: request origin (${reqOrigin || "unknown"}) != URL origin (${urlOrigin || "unknown"})`
      );
    }
  }

  // Build curl args
  const args = ["-X", method, "--silent", "--show-error"];
  if (followRedirects) {
    args.push("--location", "--max-redirs", String(maxRedirects));
  }

  // Referrer support (curl spelling is --referer)
  if (referrer) args.push("--referer", referrer);
  if (referrerPolicy === "no-referrer") args.push("--no-referer");
  // (Other policies aren’t directly supported by curl.)

  // Mode → Origin header behavior
  if (mode === "cors" && reqOrigin) {
    headers = { ...headers, Origin: reqOrigin };
  }
  // "no-cors" & "same-origin": do not set Origin automatically.

  // Cookie handling (credentials)
  // include → always; same-origin → only if origins match.
  let cookieFile = null;
  const shouldSendCookies =
    credentials === "include" ||
    (credentials === "same-origin" && reqOrigin && urlOrigin && reqOrigin === urlOrigin);

  if (shouldSendCookies) {
    cookieFile = path.join(os.tmpdir(), `curl-imp-cookies-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
    args.push("--cookie-jar", cookieFile, "--cookie", cookieFile);
  }

  // If caller wants headers back (or needs CORS validation), dump headers to a temp file
  let headerFile = null;
  const needHeaders = returnHeaders || (validateCors && mode === "cors");
  if (needHeaders) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "curl-imp-"));
    headerFile = path.join(tmpDir, "headers.txt");
    args.push("--dump-header", headerFile);
  }

  // Add headers
  for (const [k, v] of Object.entries(headers)) {
    if (v == null) continue;
    args.push("-H", `${k}: ${v}`);
  }

  // Body
  let useStdin = false;
  if (body !== undefined) {
    if (Buffer.isBuffer(body)) {
      useStdin = true;
      args.push("--data-binary", "@-");
    } else {
      args.push("--data-binary", String(body));
    }
  }

  // URL last
  args.push(url);

  // Windows via WSL if needed
  const isWindows = process.platform === "win32";
  const isMacOs = process.platform === "darwin";
  const command = isWindows ? "wsl" : binary;

  let finalArgs;
  if (isWindows) {
    const driveletter = binary.substring(0, 1).toLowerCase();
    const winPathInWsl =
      "/mnt/" + driveletter + binary.slice(2).replaceAll("\\", "/");
    finalArgs = [winPathInWsl, ...args];
  } else if (isMacOs) {
    finalArgs = args;
  } else {
    finalArgs = args; // linux
  }
  // console.log(command, finalArgs)
  console.log([command, ...finalArgs].join(' '))
  // process.exit()
  return new Promise((resolve, reject) => {
    const child = spawn(command, finalArgs, {
      stdio: useStdin ? ["pipe", "pipe", "pipe"] : ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const killer = setTimeout(() => {
      timedOut = true;
      try { child.kill("SIGKILL"); } catch (_) {}
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("error", (err) => {
      clearTimeout(killer);
      reject(err);
    });

    child.on("close", (code) => {
      clearTimeout(killer);

      const cleanupTemps = () => {
        try {
          if (cookieFile && fs.existsSync(cookieFile)) fs.unlinkSync(cookieFile);
        } catch (_) {}
        try {
          if (headerFile && fs.existsSync(headerFile)) {
            const dir = path.dirname(headerFile);
            fs.unlinkSync(headerFile);
            try { fs.rmdirSync(dir); } catch (_) {}
          }
        } catch (_) {}
      };

      const finish = (extra = {}) => {
        cleanupTemps();
        if (timedOut) {
          const err = new Error(`curl_chrome116 timed out after ${timeoutMs}ms`);
          err.code = "ETIMEDOUT";
          err.stdout = stdout;
          err.stderr = stderr;
          return reject(err);
        }
        resolve({ stdout, stderr, code: code ?? -1, ...extra });
      };

      if (!needHeaders || !headerFile) return finish();

      fs.readFile(headerFile, "utf8", (err, data) => {
        if (err) return finish();

        const headersRaw = data.replace(/\r\n/g, "\n");
        const blocks = headersRaw.split(/\n{2,}/).filter(Boolean);
        const last = blocks[blocks.length - 1] || "";
        const lines = last.split("\n");
        const headerLines = lines.slice(1);

        const headersObj = {};
        for (const line of headerLines) {
          const idx = line.indexOf(":");
          if (idx === -1) continue;
          const name = line.slice(0, idx).trim().toLowerCase();
          const value = line.slice(idx + 1).trim();
          if (headersObj[name] === undefined) headersObj[name] = value;
          else if (Array.isArray(headersObj[name])) headersObj[name].push(value);
          else headersObj[name] = [headersObj[name], value];
        }

        // Optional CORS validation (best-effort)
        if (validateCors && mode === "cors" && reqOrigin) {
          const acao = headersObj["access-control-allow-origin"];
          const acac = headersObj["access-control-allow-credentials"];
          const usingCreds = credentials === "include" ||
            (credentials === "same-origin" && reqOrigin === urlOrigin);

          const originOk =
            acao === "*" ? !usingCreds : (acao === reqOrigin);

          const credsOk = usingCreds ? (acac === "true") : true;

          if (!originOk || !credsOk) {
            const reason = !originOk
              ? `CORS: ACAO (${acao || "missing"}) does not allow ${reqOrigin}${usingCreds ? " with credentials" : ""}`
              : `CORS: ACAC (${acac || "missing"}) is not "true" while sending credentials`;
            const e = new Error(reason);
            e.code = "ECORS";
            e.headersRaw = headersRaw;
            e.headers = headersObj;
            return reject(e);
          }
        }

        const extra = {};
        if (returnHeaders) Object.assign(extra, { headersRaw, headers: headersObj });
        finish(extra);
      });
    });

    if (useStdin) {
      child.stdin.write(body);
      child.stdin.end();
    }
  });
}



// module.exports = { runCurlImpersonate };


// -------- Example usage (POST with your provided values) --------
async function main_example() {
  const url = "https://xxxx.com/backend-anon/sentinel/chat-requirements";

  const headers = {
    "accept": "*/*",
    "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
    "accept-encoding": "gzip, deflate, br, zstd",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "oai-client-version": "prod-9d358314d30a26d59ec2f2390d079c86e2c0018f",
    "oai-device-id": "7bf62582-0831-4cb5-81c3-25e955be37bf",
    "oai-language": "it-IT",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    // ⚠️ Keep cookies private. If you choose to pass them, do so knowingly.
    "cookie": "__Host-next-auth.csrf-token=ee6672ee8bf460d445ddebb9d86ef58c6aed31605b2a810fd7117d1b7ad0c44d%7Cfcab5908beb79da8918d203e19d0a8d0bc72f1242017926eee313ff20e11283b; __Secure-next-auth.callback-url=https%3A%2F%2Fchatgpt.com; oai-did=2d119344-b874-44fe-ac53-206896d60184; __cf_bm=gYX7ls44p3lEt65GYt5J4L9Kt1nea2bom9yepWRadro-1757324016-1.0.1.1-T7CuR08JhBP5CVarw1.N38rnkccE951egct8PPYD8GmJawvzxHXJpUyZoVYIvJMgmUvODJPaC5iOcfm6oHkk5oGmzjYL3A0CYLy_amq0aXM; __cflb=04dTofELUVCxHqRn2XgseaxVQDk7Jcu7Nv3ZDpgz7u; _cfuvid=62.Zz_gbo47jAzOKhozosXt6xTmb2QZoqJOWfXOchF0-1757324016378-0.0.1.1-604800000",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
    "referer": "https://xxxx.com/",
  };

  const body = '{"p":"gAAAAACWzMwMDAsIk1vbiBTZXAgMDggMjAyNSAxMTozNDowOSBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1MiwxLCJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTM5LjAuMC4wIFNhZmFyaS81MzcuMzYiLG51bGwsInByb2QtMDIwYjM4YTVjMWViZjY4OThiNzVjOGYxNWExOTcyYmJhMmZmODNlMiIsIml0LUlUIiwiaXQtSVQsaXQsZW4tVVMsZW4iLDAsImphdmFFbmFibGVk4oiSKCkgPT4gZmFsc2UiLCJkb2N1bWVudEVsZW1lbnQiLCJkb2N1bWVudCIsMzY1NDAuMDE2OSwiN2JmNjI1ODItMDgzMS00Y2I1LTgxYzMtMjVlOTU1YmUzN2JmIiwiIiwxMiwxNzU3MzI0MDEzMjcyLjUyNV0="}';

  const { stdout, stderr, code } = await runCurlImpersonate({
    url,
    method: "POST",
    headers,
    body,
    // binary: "/full/path/to/curl_chrome116", // optional override
    timeoutMs: 45000,
  });

  if (code !== 0) {
    console.error("curl_chrome116 failed:", { code, stderr });
    process.exitCode = code || 1;
  } else {
    console.log(stdout);
  }
}

// if (process.argv[1] === new URL(import.meta.url).pathname) {
//   // If run directly: `node run-curl-impersonate.js`
//   main().catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });
// }

module.exports = {runCurlImpersonate, runCurlImpersonate2}