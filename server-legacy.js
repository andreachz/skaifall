// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const {providers, DEFAULT_PROVIDER} = require('./helpers/constants')
const { exec } = require("child_process");
const { reloadPage } = require("./ai-modules/openai/pup/chatgpt");

const {selectorByProvider} = require('./helpers/scope')
const {checkNodeVersion} = require('./helpers/generic')

// Example usage:
if (!checkNodeVersion(22)) {
  process.exit(1);
}

const server = http.createServer((req, res) => {
    // console.log(req.url)
    if (req.url === "/" && req.method === "GET") {
    // Serve index.html
    const filePath = path.join(__dirname, "public/index.html");
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        // res.end("Error loading index.html");
        res.end(NO_INDEX_WARNING);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }
   else if (req.url === "/docs" && req.method === "GET") {
    
    // Serve index.html
    const filePath = path.join(__dirname, "public/docs.html");
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        // res.end("Error loading index.html");
        res.end('no docs');
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }
else if(req.url==='/clear' && req.method === "GET"){
    reloadPage().then(d=>{
        res.end(JSON.stringify({ ok: true }));
    })
    .catch(e =>{
        res.end(JSON.stringify({ ok: false, error: "failed to clear: "+e.toString() }));
    })
}
else if (req.url === "/generate" && req.method === "POST") {
  let body = "";

  // helper per rispondere una sola volta
  const respondJSON = (status, payload) => {
    if (res.writableEnded) return;
    if (!res.headersSent) {
      res.writeHead(status, { "Content-Type": "application/json" });
    }
    res.end(JSON.stringify(payload));
  };

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      if (!body) {
        return respondJSON(400, { ok: false, error: "Empty body" });
      }

      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        return respondJSON(400, { ok: false, error: "Invalid JSON" });
      }

      const {
        prompt,
        messages,
        model,
        provider: providerKey,
        stream = false,
        use_workers = false,
        one_shot = false,
      } = parsed;

      const promptStr =
        typeof prompt === "string" && prompt.length
          ? prompt
          : JSON.stringify(messages || "");

      const provider = providers[providerKey] || DEFAULT_PROVIDER;
      
      const generate = selectorByProvider(provider, { use_workers });

      if (stream) {
        // --- Streaming via Server-Sent Events ---
        if (!res.headersSent) {
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            // Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          });
        }
        res.write(`retry: 1000\n\n`);

        const ac = new AbortController();
        const { signal } = ac;

        req.on("close", () => {
          try {
            // ac.abort(); // opzionale
          } catch (e) {
            console.error(e);
          }
        });

        let finalText = "";
        const onChunk = (chunk /* string */, evt) => {
          finalText += chunk;
          res.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
        };

        try {
          const full = await generate(promptStr, model, true, { onChunk, signal, one_shot});
          res.write(`data: ${JSON.stringify({ done: true, text: full })}\n\n`);
          res.write(`event: done\ndata: {}\n\n`);
          if (!res.writableEnded) res.end();
        } catch (err) {
          res.write(
            `event: error\ndata: ${JSON.stringify({
              ok: false,
              error: err?.message || String(err),
            })}\n\n`
          );
          if (!res.writableEnded) res.end();
        }
      } else {
        // --- Non-streaming JSON response ---
        try {
          const response = await generate(promptStr, model, false, {}); // <— coerente
          // console.log(response, "xxx");
          return respondJSON(200, {
            ok: true,
            response,
            // available_models,
          });
        } catch (err) {
          return respondJSON(500, {
            ok: false,
            error: err?.message || String(err),
          });
        }
      }
    } catch (e) {
      // se siamo qui e abbiamo già mandato una risposta, non ritentiamo
      if (!res.headersSent && !res.writableEnded) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: e?.message || String(e) }));
      } else {
        console.error("Post-end error:", e);
      }
    }
  });
}
else {
  res.writeHead(404, { "Content-Type": "application/json" });
  return res.end(JSON.stringify({ ok: false, error: "not found" }));
}
});


const NO_INDEX_WARNING = 'Warning: index.html for frontend page not found. You can keep using POST /generate API'
const PORT = process.argv[2] || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  const url = `http://localhost:${PORT}`;
  
  if(fs.existsSync('public/index.html')){
    setTimeout(()=>{
    // Open default browser depending on OS
  switch (process.platform) {
    case "darwin": // macOS
      exec(`open ${url}`);
      break;
    case "win32": // Windows
      exec(`start ${url}`);
      break;
    default: // Linux, etc.
      exec(`xdg-open ${url}`);
  }
  },200)
}else{
  console.log(NO_INDEX_WARNING)
}
});
