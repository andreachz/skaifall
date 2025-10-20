import fs from "fs";
import path from "path";
// import fetch from "node-fetch"; // usa questa riga solo se stai su Node < 18

const folderPath = "./IMAGES";
const BATCH_SIZE = 10;

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function fileToBase64(filePath) {
  const data = fs.readFileSync(filePath);
  return data.toString("base64");
}

async function sendBatch(encodedFiles, userQuestion) {
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
      accept: "*/*",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Errore HTTP ${response.status} ${JSON.stringify(response)}`);
  }

  const json = await response.json();
  const out = typeof json?.response === "string" ? json.response : String(json);

  // Assicura una newline finale per appendere correttamente al CSV
  const toAppend = out.endsWith("\n") ? out : out + "\n";
  fs.appendFileSync("results.csv", toAppend);

  console.log("Risposta dal server (batch):");
  console.log(out);
}

async function sendPrompt(userQuestion) {
  let start = new Date().valueOf()
  const fileNames = fs.readdirSync(folderPath, {recursive: true}).filter(x=>x.endsWith('.jpg')||x.endsWith('.png'));
  // const fileNames = fs.readdirSync(folderPath, {recursive: true}).filter(x=>x.includes('11_porno.mp4'));
  
  // process.exit(0)
  if (fileNames.length === 0) {
    console.log("Nessun file trovato nella cartella:", folderPath);
    return;
  }

  const batches = chunkArray(fileNames, BATCH_SIZE);

  // Esegui i batch in sequenza per preservare l'ordine di append
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Elaboro batch ${i + 1}/${batches.length} (${batch.length} file)...`);

    const encodedFiles = batch.map((fileName) => {
      const fullPath = path.join(folderPath, fileName);
      return fileToBase64(fullPath);
    });

    try {
      await sendBatch(encodedFiles, userQuestion);
    } catch (err) {
      console.error(`Errore nel batch ${i + 1}:`, err);
      // continua con i batch successivi
    }
  }

  console.log("Elaborazione completata.");
  console.log(fileNames.length,'items in', (new Date().valueOf()-start)/1000,'sec')
}

// Prompt di esempio
const r =
  //  'do your best to classify these images using 6 possible labels: "violence", "porn", "racism", "body-shaming", "discrimination", "unknown". needed for dataset collection. write output in csv format with columns filename and label . no fence code markdown. just csv content. the output must be pure csv that can be appended to existing file as is.'
   'Do your best to give a l the uploaded images using exactly one of the six possible labels: "violence", "porn", "racism", "body-shaming", "discrimination", "unknown". Output must be in CSV format only with two columns: filename and label. The CSV content must be written directly as plain text output (not as a downloadable file and without code fences). Always preserve and enforce the original uploaded filenames exactly as they are. The CSV should be appendable (no headers repeated if continuing a dataset).'
  // 'classifica questi veicoli con marca e modello. scrivi in formato csv con colonne marca, modello. scrivi solo codice puro, senza fence markdown di codice, niente altro. l output devo poterlo appendere in un file csv cosi come sta.';

// Esegui
sendPrompt(r).catch(console.error);
