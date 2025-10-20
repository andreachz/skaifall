// server.js (Express simplified)
const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const http = require("http");

const { providers, DEFAULT_PROVIDER } = require("./helpers/constants");
const { reloadPage } = require("./ai-modules/openai/pup/chatgpt");
const { clearChat } = require("./ai-modules/openai/barejs/interfaces/server-interfaces");
const { selectorByProvider } = require("./helpers/scope");
const { checkNodeVersion } = require("./helpers/generic");

// Exit early if Node version is insufficient
if (!checkNodeVersion(22)) {
  process.exit(1);
}

const app = express();

// Parse raw text for JSON body (so we can mimic original parsing behavior)
app.use(express.text({ type: "application/json", limit: "10mb" }));

const NO_INDEX_WARNING =
  "Warning: index.html for frontend page not found. You can keep using POST /generate API";

// GET /
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public/index.html");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).type("text/plain").end(NO_INDEX_WARNING);
    }
    res.type("text/html").end(data);
  });
});

// GET /docs
app.get("/docs", (req, res) => {
  const filePath = path.join(__dirname, "public/docs.html");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).type("text/plain").end("no docs");
    }
    res.type("text/html").end(data);
  });
});

// GET /clear
app.get("/clear", async (req, res) => {
  try {
    await reloadPage();
    await clearChat();
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: "failed to clear: " + e.toString() });
  }
});

// POST /generate
app.post("/generate", async (req, res) => {
  const bodyText = req.body;

  if (!bodyText) {
    return res.status(400).json({ ok: false, error: "Empty body" });
  }

  let parsed;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid JSON" });
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
    // SSE streaming
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      Connection: "keep-alive",
    });
    res.write(`retry: 1000\n\n`);

    const ac = new AbortController();
    const { signal } = ac;

    req.on("close", () => {
      try {
        // ac.abort(); // optional, keep consistent with original
      } catch (e) {
        console.error(e);
      }
    });

    let finalText = "";
    const onChunk = (chunk) => {
      finalText += chunk;
      res.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
    };

    try {
      const full = await generate(promptStr, model, true, {
        onChunk,
        signal,
        one_shot,
      });
      res.write(`data: ${JSON.stringify({ done: true, text: full })}\n\n`);
      res.write(`event: done\ndata: {}\n\n`);
      res.end();
    } catch (err) {
      res.write(
        `event: error\ndata: ${JSON.stringify({
          ok: false,
          error: err?.message || String(err),
        })}\n\n`
      );
      res.end();
    }
  } else {
    // Non-streaming JSON
    try {
      const response = await generate(promptStr, model, false, {});
      return res.json({ ok: true, response });
    } catch (err) {
      return res
        .status(500)
        .json({ ok: false, error: err?.message || String(err) });
    }
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "not found" });
});

const PORT = process.argv[2] || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  const url = `http://localhost:${PORT}`;

  if (fs.existsSync("public/index.html")) {
    setTimeout(() => {
      switch (process.platform) {
        case "darwin":
          exec(`open ${url}`);
          break;
        case "win32":
          exec(`start ${url}`);
          break;
        default:
          exec(`xdg-open ${url}`);
      }
    }, 200);
  } else {
    console.log(NO_INDEX_WARNING);
  }
});
