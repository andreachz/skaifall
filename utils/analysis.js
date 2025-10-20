import fs from "fs";
import path from "path";
// import fetch from "node-fetch"; // solo se usi Node < 18

// Cartella con i file
const folderPath = "./files";

function fileToBase64(filePath) {
  const data = fs.readFileSync(filePath);
  return data.toString("base64");
}

async function sendPrompt(userQuestion) {
  // Legge tutti i file nella cartella
  const fileNames = fs.readdirSync(folderPath);

  // Converte ogni file in base64
  const encodedFiles = fileNames.map(fileName => {
    const fullPath = path.join(folderPath, fileName);
    return fileToBase64(fullPath);
  });

  // Costruisce la stringa nel formato richiesto
  const prompt = `b64::${encodedFiles.join("|")}:: ${userQuestion}`;

  const body = {
    model: "openai-chatgpt",
    messages: [{ role: "user", content: prompt }],
    stream: false,
    provider: "openai",
  };

  const response = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: {
      "accept": "*/*",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Errore HTTP ${response.status}`);
  }

  // Recupera output (se non gestisci streaming chunk)
  const text = await response.json();
  console.log("Risposta dal server:");
  console.log(text);
  fs.appendFileSync('results.csv', text.response)
}

const r = 'classify these images using 3 possible labels: "violence","porn","racism". write output in csv format with columns filename and label . no fence code markdown. just csv content. the output must be pure csv that can be appended to existing file as it.'

// Esegui
sendPrompt(r).catch(console.error);
