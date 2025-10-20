const {userAgent} = require('./constants')
const {store} = require('./store')
const {SS, XEe: generateTokens} = require('./openai-code');
const {Kt} = require('./openai-code2');
const { parseEventStreamMessages, extractMessageContent, getRandomUserAgent, listenForKeyOnce } = require('./helpers');
const {runCurlImpersonate} = require('./impersonate-api');
const { HttpsProxyAgent } = require("https-proxy-agent");
const { raceProxies, isWinner, isWinnerGeneric, raceProxies2_forStream, isWinnerStreaming } = require('../../../proxy/proxy');
const { getProxyCacheList } = require('../../../proxy/proxy-fetch-parse');
const { collectWinnersWithin } = require('../../../proxy/proxy-prefetch');

const path = require('path');
const fs = require('fs');
const fs_prom = require('fs/promises'); 

const mime = require("mime-types");
const sizeOf = require('image-size');

// console.log(sizeOf.imageSize('C:\\Users\\Andrea11\\Documents\\car.jpg'))
// process.exit()

const os = require('os');
const { detectFileType } = require('../../../helpers/generic');

const tempDir = path.join(os.tmpdir(),'/ai-working');

const { Readable } = require("node:stream"); // Node core
const store_auth = require('./store_auth');

const USE_PROXY_ALL = 1

async function getPageInfo(access_token=undefined, authcookie=undefined) {
  try {

    

    let headers= {
        "User-Agent": getRandomUserAgent(access_token?0:undefined),
        // "cookie": store.stored_cookie //bo
        "cookie": store.stored_cookie+(authcookie?'; '+authcookie:''),
        // "Accept": "application/json",
      }

    const response = await fetch("https://chatgpt.com", {
      method: "GET",
      headers,
      redirect: "follow", // so we can inspect headers before following redirects
    });

    if(access_token){
      headers['authorization']=`Bearer ${access_token}`
    }

    // Extract cookies from headers
    const cookies = response.headers.get("set-cookie");
    

    // If the response also has JSON:
    try {
      const data = await response.text();
      
    //   console.log("Response JSON:", data);
      return {cookies, data}
    } catch(e) {
      console.log("Response is not JSON.",e);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function getOaiDeviceId(){
  return SS.sid
}

async function chatRequirementsAPI(  access_token = undefined, authcookie = undefined,){

  
    const t = SS.getRequirementsTokenBlocking();

    let body = JSON.stringify({p: t})

    const proxyUrl ='http://51.182.34.38:80'
    const agent = new HttpsProxyAgent(proxyUrl);

    // console.log(authcookie, access_token)
    let url = "https://chatgpt.com/backend-anon/sentinel/chat-requirements"
    // let url = "https://webhook.site/65f05175-54d8-4e08-ba53-caa163b90b20"
    let args = {
    "headers": {
        "accept": "*/*",
        // "accept-language": "it-IT,it;q=0.9",
        "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
        "accept-encoding": "gzip, deflate, br, zstd",
        "cache-control": "no-cache",
        "content-type": "application/json",
        // "content-length": body.length+'',
        "oai-client-version": "prod-9d358314d30a26d59ec2f2390d079c86e2c0018f",
        "oai-device-id": SS.sid || "b83b32ec-805f-44f9-b36e-1007cbcb734e",
        "oai-language": "it-IT",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": store.stored_cookie+(authcookie?('; '+authcookie):''),
        "User-Agent": getRandomUserAgent(access_token?0:undefined),
        "referer": "https://chatgpt.com/",
    },
    "referrer": "https://chatgpt.com/",
    "body": body,
    "method": "POST",
    "mode": "cors",
    "credentials": "include",
    "redirect": 'follow',
    // agent: agent
    }

    if(access_token){
      args.headers['authorization']=`Bearer ${access_token}`
    }
    
    // console.log(args.headers.cookie, args.headers.authorization, 'AAAAAAAAAAAAAAA')
    // console.log(url, args)

  
    const USE_NATIVE_FETCH=1
    const USE_PROXY = 0 || USE_PROXY_ALL
    if(USE_NATIVE_FETCH){
     if(USE_PROXY){
      let proxies = await getProxyCacheList()
      const w = await raceProxies(proxies, url, args, { 
        repeats: 1, 
        spacingMs: 10, 
        maxProxies: 100,
        consume: !false,
        // perRequestTimeoutMs: 1000,
        isWinner 
      });

      // args={method: 'GET'}
      // const w = await raceProxies(proxies, 'https://api.ipify.org?format=json', args, { 
      //   repeats: 1, 
      //   spacingMs: 10, 
      //   maxProxies: 100,
      //   // perRequestTimeoutMs: 1000,
      //   isWinnerGeneric
      // });


      // console.log('Winner proxy:', w.proxy.address, 'attempt', w.attempt, 'in', w.ms, 'ms');
      // console.log('IP response:', w.body.slice(0,-20));

      return JSON.parse(w.body);

     }
     else{
      let result = await (await fetch(url, args)).json()
      // console.log(result)
      return result
     }
     
    }



    const { stdout, stderr, code } = await runCurlImpersonate({
        url,
        method: "POST",
        headers: args.headers,
        body,
        // binary: "/full/path/to/curl_chrome116", // optional override
        timeoutMs: 45000,
    });
    // console.log('ciao')
    // console.log(stdout,stderr,code)
    // console.log(stdout)
    // let res = {
    //     json: function(){return stdout}
    // }
    // console.log(stdout)


    return JSON.parse(stdout)


}

// As before (full response, no streaming):
// const res1 = await conversationAPI('chi è iniesta?', store.conversation_id, store.parent_message_id);
// console.log(res1.text);
async function conversationAPI_old(prompt, conversation_id = undefined, parent_message_id=undefined){

    console.log('conversation', SS.sid)
//   console.log(SS.sid, store.stored_cookie, store.reqToken, store.proofToken, store.turnstileToken)
  let res = await fetch("https://chatgpt.com/backend-anon/f/conversation", {
  "headers": {
    "accept": "text/event-stream",
    "content-type": "application/json",
    "oai-client-version": "prod-020b38a5c1ebf6898b75c8f15a1972bba2ff83e2", // you can get it from main html page chatgpt.com
    "oai-device-id": SS.sid || "e0a209d7-06b6-4b2c-a989-ed7c28ba0723",
    "oai-echo-logs": "0,887,1,5264,0,62078,1,68932,0,111401,1,117072,0,203351,1,207982,0,228153",
    "oai-language": "it-IT",
    "openai-sentinel-chat-requirements-token": store.reqToken || "gAAAAABovcxmrzfOtaXSgCQ5ln58a_J9XZWli8UtshG5zXCg83qu_pFs6T1sPJzTK7ylQGtFzn-1Kz6u-YAGY0KwqHckR45-qFyel8ZnEguXshSHd6h2NbuVLiG51YITaqWVGH-OMk8oS5zxmbTGf6ZQl9UgmxFg5Q_l9O1JGmxiEITXDtHan-o19hi3TUrMGmqJj3tkOPzgH-wwowDIir2Zgb3jCV4sOCBf2lrUtBdeZSQ5bV1FFvTT5t9f8JoCe9O-WjLMUHCLemwPU6_iWZBvjnL9-gC2ttg7OXNXweZ7uiaU6FOsDpv1BOS9tTNUZVtfFKmeD_5XQ4l0j0ONq0Vnc1uwxIxQ7ILoXyuh-SWx2GDDJls4orspQD7AyzRPFGIwVlE2z55X-ykop6j50T28JDsEWGy10RNFIRyQLHT__XJdUJbUTyZUa6oSlyrX69mWwbxqjt9LyyGWvja_fcdlw8ktpWsWsKOHfKMNLNKZ03MiihQeVZYbSuIJd4WP8QTzmygN9gJTgIsgXbGqnz-8ZenOTeQpsAEezM_8n8VZlGYs-JY_JII9SV_yhwFeLJiedU0Cgif54xo-JLiZzRGAKKlw2n-y4xY7PJ8Twlwc0HOWgKX5Uzgmu7ukdNYcTWO3ksNnUdO7pI6lY3Nq6APlCofEknbUNPXcg7DYasae0oite0NZUxSApNLv4bbQCHakHbPJpuiDDMdL8h6zpeP7BJYmF_13DUf8EJskgDHkgcAuXKjK_JFxv63HpdhUgYJexnItdqaEd-YNj5cCjeG3Ah94LafFJ3YKkYoz8GLa42sLcAxaK2fnlMw1JFZRKkuAR15hcUQ5Ynqs458jzqiYpMhbuV6iupwspnQ7CstDVkbyzfTZIQ0m4h2zUljqmgjaBp2b2Cp83hMF1EREKK9XSH7Cok53Y2OH0hE1ZIRDwwWnvT8hMQh15Owjybr-rPPGSNbsqlmdFRYu_xRhgdI6lhPsIcxEOOAMEf4b5eo6HjVOFiIUzQrdXHpW90Is233W1QX_CEwPLSWvXXcbDbxVp-QmswIxCvF7rSH23UM6w45xOQTu1g3nWbWfXrbEVgSQW4ubwaGWnpxhrdsjA_DSgV6wR8C1c5oAEApPPhDgr68qG5w86kwhOj9GjFitTUOZ10WAWCu83LJjguGuBAixEv5dHu3rVyNAbr54qmPPKeu3EbWrhDPBByCGcitUGMNZug_Om23k-FNbsAcfUWBWZZfEFvy6Roqs0qVs5drrKbUSEmt5ZP-XIr1atAcvRq7DRH0u6C1weL-TXlYO_UNmtdyhk_wBf1xHB-FiLaBSbeLNpnQuBPs=",
    "openai-sentinel-proof-token": store.proofToken || "gAAAAABWzMwMDAsIlN1biBTZXAgMDcgMjAyNSAyMDoxODoxNCBHTVQrMDIwMCAoT3JhIGxlZ2FsZSBkZWxs4oCZRXVyb3BhIGNlbnRyYWxlKSIsNDI5NDcwNTE1Miw1NSwiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzOS4wLjAuMCBTYWZhcmkvNTM3LjM2IixudWxsLCJwcm9kLTAyMGIzOGE1YzFlYmY2ODk4Yjc1YzhmMTVhMTk3MmJiYTJmZjgzZTIiLCJpdC1JVCIsIml0LUlUIiw4NCwibWVkaWFDYXBhYmlsaXRpZXPiiJJbb2JqZWN0IE1lZGlhQ2FwYWJpbGl0aWVzXSIsImxvY2F0aW9uIiwib25zY3JvbGwiLDIzMDI1NCwiMDhjZjQyNmEtNzA2Mi00YzlhLWFmY2EtYzJiYzJmZWQxMzljIiwiIiwxMiwxNzU3MjY4ODY0NDc5Ljld~S",
    "openai-sentinel-turnstile-token": store.turnstileToken || "TBEfBR0PERQRcU8DSnJEentvSwdzcllQd39UY3dxQH5LcUQKDgwfEQIGAAMKFQkMcURHentUR2FlRVthYnJjf3thcmxxcQ5xe19cbmZCBndmcUZRZwdxSWZfbXJIZUsFYUJDUVJfXmBgYWl7Zl8GVHxYQFVia0dgZmV8UXJxeWZiA3F7e2Zpc2RFdVdmcV5yYAdXZmtfBnl/cQpuZkVQUGJYSndrZUtMZVh1QnlYcVZkQgJyYV9gXWAGeUthewZxTVhpc2QdR3dmdWRVYl8KTWVfWHd4AkNjex51YGBbRmBrXH1vdHUGcU1YaXNkHF9QbVhKcmAGCkhWX094e18KTWRCAlZgWHxyYAZQSGR1fXtmdXl/Yh8DUG9lRkpkB1dMVQJ9V01fcWJlQgZ7YV9gAmJhS2ZmWHFCeVhxYmseClJvX2RxcltLfWtbT2N/A31ye2txUFRYZHthWXV9ZGUGf39rV1JiawJVYl8bVmAHdVlkAkd/dmZXXWQfS2RiX2AFYF8KTWVfWHF7WH1/Ym91YmJYSgFlXH1PYWVtV01YUFViaENgZQN8UmBlAm9mWHVXeV9LbVFrV2t/Ynd2dUB2aHFUemRvcn5Va2sKUn91dHdrXHJNZAJ9V3wBfWBla0ccb3V0a1JbeWZmWw59dgJDZGt4XFZidUZxa3FpSGVYU394SwZyZUUCcWFYY1ViYXlPdHV9Vn8Dcm5re3VKZVhgUVYHcXlhawJ/f3ZxYGVrR0RvdmRXZF8Kb2ICfVJ/dUNme3gCe2JfeFVgBUtPZksHVWxyXHFxfAt3dER/d3JbS31rW09jfwN9cntrQ2RiZmRmVWFpZmICR3J4dnJVa2sKUn91dHdrXHJNYgJ9UnhYdXNraEMFb2t8UGJyV3lnA1MEfwNxZGseeUtiX0JXYAd1QnFiCg4MHxECBwAFEQ0RbGIOChECEQsFHR8LEQ0Rb3JydnJvcnJ2cm9ycnZyb3JydnJvcnJ2EQIRAQYdFwARDQMAAgMHCxwFBAEEHAYBBQMXBx8VAgABChUJDFFxcUN2dUtmax5AZ1JfQmJydXZIdWRle3ZicnF2f3p/f0RKRhEbERkCHQEBDAkReUl3Rn5zahMRHxUHHh0GBhEUEVF1dnRwWwd1bHJycHBWWHB/Yl1hdE91GGZYcWR2ZUNUdnxAYVUDYHRkBkN+dmEPZWxLB1NxWXZ7f2JdYXRPdkhxcQd1bEtYc3FsZUYVHwwHChkBHBEJFX16VEZ6WWsOERsRFwAdBwAMCRFjcWhkdmZYZntET3hrYgN8e1l6VXFmfHtlB1dIdmFmcm9xWHN0SWZ/dnJ3cHZhR31kWFtRfEtmfXtvald2WxZ+YQZLZnZhZnhvVGpRd2t1UmJ1WlJ2ZlhrcnJ2d2xEdnt0f2pVcWVocWEHV3drVEB5bVRicXJvalVxZRd/ZWJQeHBhAnwMHxEDCwAEAhUJDGsDU1J/A3J5e291YmACdHtgYn1mdGV1cXZbRAoRUw==",
    "cookie": store.stored_cookie,
    "User-Agent": getRandomUserAgent(),
  },
  "referrer": "https://chatgpt.com/",
  // "body": "{\"action\":\"next\",\"messages\":[{\"id\":\"be85befd-4c46-4fab-a08a-ecc802d5cf7c\",\"author\":{\"role\":\"user\"},\"create_time\":1757269095.471,\"content\":{\"content_type\":\"text\",\"parts\":[\"ciao\"]},\"metadata\":{\"selected_github_repos\":[],\"selected_all_github_repos\":false,\"serialization_metadata\":{\"custom_symbol_offsets\":[]}}}],\"conversation_id\":\"68bdcbf1-82b0-8007-a6ef-f0fdaf253fce\",\"parent_message_id\":\"9f233ce9-b42a-46da-a797-6e5532ecdec9\",\"model\":\"auto\",\"timezone_offset_min\":-120,\"timezone\":\"Europe/Rome\",\"history_and_training_disabled\":true,\"conversation_mode\":{\"kind\":\"primary_assistant\"},\"enable_message_followups\":true,\"system_hints\":[],\"supports_buffering\":true,\"supported_encodings\":[\"v1\"],\"client_contextual_info\":{\"is_dark_mode\":true,\"time_since_loaded\":231,\"page_height\":911,\"page_width\":582,\"pixel_ratio\":1,\"screen_height\":1080,\"screen_width\":1920},\"paragen_cot_summary_display_override\":\"allow\",\"force_parallel_switch\":\"auto\"}",
  "body": 
  JSON.stringify({
  "action": "next",
  "messages": [
    {
      "id": crypto.randomUUID() || "be85befd-4c46-4fab-a08a-ecc802d5cf7c", // important it must be randomly generated
      "author": {
        "role": "user"
      },
      "create_time": (new Date().valueOf()/1000) || 1757269095.471,
      "content": {
        "content_type": "text",
        "parts": [
          prompt
        ]
      },
      "metadata": {
        "selected_github_repos": [],
        "selected_all_github_repos": false,
        "serialization_metadata": {
          "custom_symbol_offsets": []
        }
      }
    }
  ],
//   "conversation_id": "68bdcbf1-82b0-8007-a6ef-f0fdaf253fce",
  "conversation_id": conversation_id,
//   "parent_message_id": "9f233ce9-b42a-46da-a797-6e5532ecdec9",
  "parent_message_id": parent_message_id?parent_message_id:"client-created-root",
  "model": "auto",
  "timezone_offset_min": -120,
  "timezone": "Europe/Rome",
  "history_and_training_disabled": true,
  "conversation_mode": {
    "kind": "primary_assistant"
  },
  "enable_message_followups": true,
  "system_hints": [],
  "supports_buffering": true,
  "supported_encodings": [
    "v1"
  ],
  "client_contextual_info": {
    "is_dark_mode": true,
    "time_since_loaded": 231,
    "page_height": 911,
    "page_width": 582,
    "pixel_ratio": 1,
    "screen_height": 1080,
    "screen_width": 1920
  },
  "paragen_cot_summary_display_override": "allow",
  "force_parallel_switch": "auto"
}),

  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
})

let raw = await res.text()
let parsed = parseEventStreamMessages(raw)
let text = extractMessageContent(parsed)
console.log(raw)
if(!conversation_id){
store.conversation_id = parsed.find(x=>x.conversation_id)?.conversation_id}
if(!parent_message_id){
store.parent_message_id = parsed.find(x=>x?.v?.message?.id && x?.v?.message?.author?.role=='assistant' )?.v?.message?.id
}
return {raw, parsed, text}

}

/**
 * Conversation API
 * - By default: returns the full parsed response (compatible with your current usage).
 * - Optional streaming: set options.stream = true to receive chunks/events as they arrive.
 *
 * @param {string} prompt
 * @param {string|undefined} conversation_id
 * @param {string|undefined} parent_message_id
 * @param {object} options
 *   - stream?: boolean            // default false — if true, calls onChunk/onEvent as data arrives
 *   - onChunk?: (s: string) => void         // raw chunk callback (decoded text/event-stream chunks)
 *   - onEvent?: (evt: any) => void          // parsed SSE event objects (already JSON-parsed if possible)
 *   - onToken?: (token: string) => void     // convenience: incremental assistant text tokens
 *   - signal?: AbortSignal                   // optional AbortController signal to cancel the request
 *
 * @returns {Promise<{raw:string, parsed:any[], text:string, controller:AbortController}>}
 */
async function conversationAPI(
  prompt,
  // mediaAbsPath=undefined,
  conversation_id = undefined,
  parent_message_id = undefined,
  access_token = undefined,
  authcookie = undefined,
  options = {}
) {
  // console.log(access_token,conversation_id,'aa')
  let {
    stream = false,
    onChunk,
    onEvent,
    onToken,
    signal,
  } = options;

  

  const controller = new AbortController();
  if (signal) {

    // If caller provided a signal, mirror cancellation
    if (signal.aborted) controller.abort();
    signal.addEventListener('abort', () => {controller.abort(); console.log('abiorted')}, { once: true });
  }

  // listenForKeyOnce(undefined, ()=>{controller.abort()})
  
//   console.log('conversation', SS.sid);


async function processFile({ file, filename, index, type, tempDir, fileUploadTask, cred=undefined }) {
  // let filename = file;
  let absFilePath
  if (type === 'b64') {
    // Create a unique filename
    const fileBuffer = Buffer.from(file, 'base64');
    // const filePath = path.join(tempDir, `img_${Date.now()}_${index}.${detectFileType(fileBuffer).ext}`);
    const filePath = path.join(tempDir, filename);
    
    await fs_prom.writeFile(filePath, fileBuffer);
    absFilePath = filePath;
    console.log(`File saved to: ${filePath}`);
  }
  if(type === 'paths'){
    absFilePath = file
  }

  const upload = await fileUploadTask(absFilePath, cred);
  return {
    filename: absFilePath,
    part: upload.part,
    attachment: upload.attachment,
  };
}



function getMediaFromPrompt(p) {
  const [prefix, filesPart, ...promptParts] = p.split("::");
  const prompt = promptParts.join("::");
  const files = filesPart?.split("|").slice(0, 10).map(x=>x.replace(/^['"]|['"]$/g, "").trim()) ?? [];

  if (prefix === "paths") {
    // console.log( { type: "paths", files, prompt, filenames: files.map(x=>path.basename(x)) })
    return { type: "paths", files, prompt, filenames: files.map(x=>path.basename(x)) };
  }

  if (prefix === "b64") {
    // console.log( { type: "b64", files, prompt, filenames: files.map((x,i)=>x.split(',')[1] || `file_${new Date().valueOf()}_${i}.${detectFileType(Buffer.from(x, 'base64'))?.ext||'jpg'}`) })
    // process.exit()
    return { type: "b64", files, prompt, filenames: files.map((x,i)=>x.split(',')[1] || `file_${new Date().valueOf()}_${i}.${detectFileType(Buffer.from(x, 'base64'))?.ext||'jpg'}`) };
  }

  return null;
}



  let media = getMediaFromPrompt(prompt)

  // console.log(media)

  // let content
  // let attachments = undefined
  // let filenames = []
  // if(media){
  //   let parts = []
  //   attachments = []

  //   for(let i = 0; i<media.files.length; i++){
  //     let file = media.files[i]

  //     if(media.type == 'b64'){
  //       // Define the file path
  //       const filePath = path.join(tempDir, `img_${new Date().valueOf()}_${i}.jpg`);
  //       let base64String = file
  //       // Decode base64 string to buffer
  //       const fileBuffer = Buffer.from(base64String, 'base64');

  //       try {
  //         // Write the buffer to a file synchronously
  //         fs.writeFileSync(filePath, fileBuffer);
  //         console.log(`File saved to: ${filePath}`);
  //       } catch (err) {
  //         console.error('Error writing file:', err);
  //       }
  //       file = filePath
  //     }
  //     filenames.push(file)
  //     let a = await fileUploadTask(file)
  //     parts.push(a.part)
  //     attachments.push(a.attachment)
      
  //   }
  //   content = {content_type: "multimodal_text", parts: [...parts, (media.prompt||'').trim()]}
  //   console.log(`Files loaded (${(media.files||[]).length}):`, filenames)
  // }
  // else{
  //   content = { content_type: "text", parts: [prompt] }
  // }


  let content;
let attachments = undefined;
let filenames = [];

if (media) {
  attachments = [];

  // Build all tasks up-front and run them concurrently.
  const tasks = media.files.slice(0, 10).map((file, i) =>
    processFile({
      file,
      filename: media.filenames[i],
      index: i,
      type: media.type,
      tempDir,
      fileUploadTask,
      cred: {access_token, authcookie}
    })
  );

  // Use allSettled so one bad file doesn't kill the whole batch
  const results = await Promise.allSettled(tasks);

  let parts = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      parts.push(r.value.part);
      attachments.push(r.value.attachment);
      filenames.push(r.value.filename);
    } else {
      console.error('File processing failed:', r.reason);
    }
  }
  parts.filter(x=>x)

  content = {
    content_type: parts.length?'multimodal_text':'text',
    parts: [...parts.filter(x=>x), (media.prompt || '').trim()],
  };

  console.log(`Files loaded (${filenames.length}):`, filenames);
} else {
  content = { content_type: 'text', parts: [prompt] };
}

  
  // console.log(content, attachments, 'content attach')
  let rr =  Math.round(Math.random())||1
  // process.exit(1)
  const bodyPayload = {
    action: "next",
    messages: [
      {
        id: (crypto && crypto.randomUUID && crypto.randomUUID()) || "be85befd-4c46-4fab-a08a-ecc802d5cf7c",
        author: { role: "user" },
        create_time: (Date.now() / 1000) || 1757269095.471,
        content: content,
        metadata: {
          attachments: attachments,


          developer_mode_connector_ids: [],
          selected_sources: [],

          selected_github_repos: [],
          selected_all_github_repos: false,
          serialization_metadata: { custom_symbol_offsets: [] },
        },
      },
    ],
    conversation_id,
    parent_message_id: parent_message_id ? parent_message_id : "client-created-root",
    model: "auto",
    timezone_offset_min: rr?-120:540,
    timezone:rr?"Europe/Rome":"Asia/Tokyo",
    history_and_training_disabled: access_token?undefined:true,
    conversation_mode: { kind: "primary_assistant" },
    enable_message_followups: true,
    system_hints: [],
    supports_buffering: true,
    supported_encodings: ["v1"],
    client_contextual_info: {
      is_dark_mode: true,
      time_since_loaded: 231,
      page_height: 911,
      page_width: 582,
      pixel_ratio: 1,
      screen_height: 1080,
      screen_width: 1920
    },
    paragen_cot_summary_display_override: "allow",
    force_parallel_switch: "auto"
  };


  const USE_PROXY = 0 || USE_PROXY_ALL // working for stream response

  let res

  // console.log(access_token)
  // console.log('==')
  // console.log(store.stored_cookie+(authcookie?'; '+authcookie:''))

  let headers = {
        "accept": "text/event-stream",
        "content-type": "application/json",
        "oai-client-version": "prod-020b38a5c1ebf6898b75c8f15a1972bba2ff83e2",
        "oai-device-id": SS.sid || "e0a209d7-06b6-4b2c-a989-ed7c28ba0723",
        "oai-echo-logs": "0,887,1,5264,0,62078,1,68932,0,111401,1,117072,0,203351,1,207982,0,228153",
        "oai-language": "it-IT",
        "openai-sentinel-chat-requirements-token": store.reqToken || "gAAAAABovcxm...",
        "openai-sentinel-proof-token": store.proofToken || "gAAAAABWzMwMDA...",
        "openai-sentinel-turnstile-token": store.turnstileToken || "TBEfBR0PERQ...",
        "cookie": store.stored_cookie+(authcookie?'; '+authcookie:''),
        "User-Agent": getRandomUserAgent(access_token?0:undefined),
        // "referer": access_token?("https://chatgpt.com/"+(conversation_id?'c/'+conversation_id:'')):"https://chatgpt.com/"
    }
    if(access_token){
      headers['authorization']=`Bearer ${access_token}`
    }
  // console.log(authcookie)
  if(USE_PROXY){ // working
      let url = access_token?"https://chatgpt.com/backend-api/f/conversation":"https://chatgpt.com/backend-anon/f/conversation"
      let args = {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
      headers,
      referrer: "https://chatgpt.com/",
      body: JSON.stringify(bodyPayload),
    }

      let proxies = await getProxyCacheList()
      let winner =  await raceProxies2_forStream(
          proxies,
          url,
          args,
          {
            repeats: 1,
            spacingMs: 0,
            perRequestTimeoutMs: 20_000,     // applies to initial handshake only
            maxProxies: 50,
            consume: false,                  // <-- crucial for streaming
            isWinner: stream?isWinnerStreaming:isWinnerGeneric,     // <-- header-based check
          }
        );
      
      
      res = winner.res;
      // console.log(winner.res.body.getReader)
      // process.exit()

      // winner.res.body.getReader // -> function

      

      // console.log(await res.text())
      //   process.exit()
      // console.log(typeof res.body.getReader)
      
  }
  else{
    // let headers = {
    //     "accept": "text/event-stream",
    //     "content-type": "application/json",
    //     "oai-client-version": "prod-020b38a5c1ebf6898b75c8f15a1972bba2ff83e2",
    //     "oai-device-id": SS.sid || "e0a209d7-06b6-4b2c-a989-ed7c28ba0723",
    //     "oai-echo-logs": "0,887,1,5264,0,62078,1,68932,0,111401,1,117072,0,203351,1,207982,0,228153",
    //     "oai-language": "it-IT",
    //     "openai-sentinel-chat-requirements-token": store.reqToken || "gAAAAABovcxm...",
    //     "openai-sentinel-proof-token": store.proofToken || "gAAAAABWzMwMDA...",
    //     "openai-sentinel-turnstile-token": store.turnstileToken || "TBEfBR0PERQ...",
    //     "cookie": store.stored_cookie+(authcookie?'; '+authcookie:''),
    //     "User-Agent": getRandomUserAgent(access_token?0:undefined),
    //     // "referer": access_token?("https://chatgpt.com/"+(conversation_id?'c/'+conversation_id:'')):"https://chatgpt.com/"
    //   }

    // if(access_token){
    //   headers['authorization']=`Bearer ${access_token}`
    // }

    res = await fetch(access_token?"https://chatgpt.com/backend-api/f/conversation":"https://chatgpt.com/backend-anon/f/conversation", {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
      headers,
      referrer: "https://chatgpt.com/",
      body: JSON.stringify(bodyPayload),
    });

  }



//   const data = await runCurlImpersonate({
//     url: "https://chatgpt.com/backend-anon/f/conversation", 
//     method: 'POST',     
//     headers: {
//       "accept": "text/event-stream",
//       "content-type": "application/json",
//       "oai-client-version": "prod-020b38a5c1ebf6898b75c8f15a1972bba2ff83e2",
//       "oai-device-id": SS.sid || "e0a209d7-06b6-4b2c-a989-ed7c28ba0723",
//     //   "oai-echo-logs": "0,887,1,5264,0,62078,1,68932,0,111401,1,117072,0,203351,1,207982,0,228153",
//       "oai-language": "it-IT",
//       "openai-sentinel-chat-requirements-token": store.reqToken || "gAAAAABovcxm...",
//       "openai-sentinel-proof-token": store.proofToken || "gAAAAABWzMwMDA...",
//       "openai-sentinel-turnstile-token": store.turnstileToken || "TBEfBR0PERQ...",
//       "cookie": store.stored_cookie,
//       "User-Agent": getRandomUserAgent(),
//     },
//     body: JSON.stringify(bodyPayload),
    
//  })
  
//  stream=false

//   let res = {
//     ok: data.code === 0,
//     text: function(){return data.stdout}
//   }
   
//   console.log(res.text(), res.ok)

  if (!res.ok) {
    const t = await res.text().catch((e) => "");
    console.log(res)
    console.log(JSON.stringify(bodyPayload, null, 1))
    throw new Error(`conversationAPI HTTP ${res.status}: ${t || res.statusText}`);
  }

  // --- Non-streaming path (backward-compatible) ---
  if (!stream || !res.body || typeof res.body.getReader !== 'function') {
    const raw = await res.text();
    
    const parsed = parseEventStreamMessages(raw);
    const text = extractMessageContent(parsed);

    console.log(parsed, text)

    // store IDs if provided
    if (!conversation_id) {
      const conv = parsed.find(x => x.conversation_id);
      if (conv) store.conversation_id = conv.conversation_id;
    }
    if (!parent_message_id) {
      const mid = parsed.find(x => x?.v?.message?.id && x?.v?.message?.author?.role === 'assistant');
      if (mid) store.parent_message_id = mid.v.message.id;
    }
    console.log(store.conversation_id)

    return { raw, parsed, text, controller };
  }

  // const webStream = Readable.toWeb(res.body); // convert Node Readable -> WHATWG ReadableStream
  // const reader = webStream.getReader();

  // --- Streaming path ---
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let raw = "";
  let sseBuffer = "";   // buffer for SSE lines
  let parsedEvents = [];
  let incrementalText = "";

  const flushSSELines = (lines) => {
    // Aggregate lines into SSE events separated by blank line
    let eventChunks = [];
    let current = [];
    for (const line of lines) {
      if (line === "") {
        if (current.length) {
          eventChunks.push(current);
          current = [];
        }
      } else {
        current.push(line);
      }
    }
    // keep partial in sseBuffer (handled by caller)
    return eventChunks;
  };

  const handleEventChunk = (chunkLines) => {
    // chunkLines: array of "field: value"
    // collect "data:" fields; ignore comments etc.
    let obj = { raw: chunkLines.join("\n") };
    let dataLines = [];
    for (const l of chunkLines) {
      const idx = l.indexOf(":");
      const field = idx === -1 ? l : l.slice(0, idx);
      const value = idx === -1 ? "" : l.slice(idx + 1).trimStart();
      if (field === "event") obj.event = value;
      if (field === "id") obj.id = value;
      if (field === "retry") obj.retry = value;
      if (field === "data") dataLines.push(value);
    }
    const dataStr = dataLines.join("\n");
    obj.data = dataStr;

    // Try to JSON-parse the data
    try {
      obj.json = JSON.parse(dataStr);
    } catch (_) { /* ignore */ }

    parsedEvents.push(obj);
    onEvent && onEvent(obj);

    // Convenience: try pulling incremental assistant text tokens
    // (Your backend typically places tokens under v.message.content.parts[0] or similar)
    try {
      const j = obj.json;
      const maybe = j?.v?.delta?.content?.[0]?.content?.parts?.[0]
                 ?? j?.v?.message?.content?.parts?.[0];
      if (typeof maybe === "string") {
        onToken && onToken(maybe);
        incrementalText += maybe;
      }
    } catch (_) { /* ignore */ }

    // opportunistic ID updates as soon as we see them
    try {
      if (!store.conversation_id && obj.json?.conversation_id) {
        store.conversation_id = obj.json.conversation_id;
      }
      const msg = obj.json?.v?.message;
      if (msg?.author?.role === 'assistant' && msg?.id) {
        store.parent_message_id = msg.id;
      }
    } catch (_) { /* ignore */ }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    raw += chunk;
    onChunk && onChunk(chunk);

    // SSE framing:
    sseBuffer += chunk;
    const lines = sseBuffer.split(/\r?\n/);
    // Keep the last partial line in buffer
    sseBuffer = lines.pop() ?? "";

    // Process complete lines into events
    const events = flushSSELines(lines);
    for (const evLines of events) handleEventChunk(evLines);
  }

  // Handle any trailing event in buffer
  if (sseBuffer.trim().length) {
    handleEventChunk([sseBuffer]);
    sseBuffer = "";
  }

  // Final parse (same as non-streaming) so callers can reuse existing logic
  const parsed = parseEventStreamMessages(raw);
  const text = extractMessageContent(parsed);

  // Set IDs if still not set by streaming path
  if (!conversation_id) {
    const conv = parsed.find(x => x.conversation_id);
    if (conv) store.conversation_id = conv.conversation_id;
  }
  if (!parent_message_id) {
    const mid = parsed.find(x => x?.v?.message?.id && x?.v?.message?.author?.role === 'assistant');
    if (mid) store.parent_message_id = mid.v.message.id;
  }

  return { raw, parsed, text, controller };
}

// const ac = new AbortController();
// const { text, controller } = await conversationAPI(
//   'chi è iniesta?',
//   store.conversation_id,
//   store.parent_message_id,
//   {
//     stream: true,
//     signal: ac.signal,
//     onChunk: (s) => console.debug('chunk:', s),
//     onEvent: (evt) => console.debug('event:', evt),
//     onToken: (t) => { /* append t to your UI */ }
//   }
// );
// // If you need to cancel mid-stream:
// // ac.abort(); // or controller.abort();

async function updateState(){
    if(store.isUpdatingTokens){return}
    // console.log('updating')
    store.oldtoken = store.proofToken;
    store.isUpdatingTokens=true
    
    try{
    // should be try catched this 
    let {cookies, data} = await getPageInfo(store_auth.data.access_token,store_auth.data.cookie)
    // console.log(cookies)
    if(!store.stored_cookie)
    store.stored_cookie = cookies


    if(!store.data_build)
    store.data_build = data.split('data-build="')[1].split('"')[0]
    
     }
    catch(e){
      console.log('[getPageInfo failed]')
    }
    // console.log(SS.sid, store.stored_cookie, store.reqToken, store.proofToken, store.turnstileToken)
    // return
    let chatReq
    // try{
    //  chatReq = await chatRequirementsAPI()
    // }
    // catch(e){
    //   // console.log('[updateState error]', e)
    //   console.log('!_')
    //   store.isUpdatingTokens=false
    //   return
    // }

    // keep retrying until success
    while (true) {
        try {
            chatReq = await chatRequirementsAPI(store_auth.data.access_token,store_auth.data.cookie);
            // console.log('STATE UPDATED HERE')
            break; // success, exit loop
        } catch (e) {
            console.log("!_");
            await new Promise(r => setTimeout(r, 1000)); // optional: wait 1s before retry
        }
    }

    store.chatReq = chatReq
    store.reqToken = chatReq.token
    
    // return
    const tokens = await generateTokens(chatReq)
    
    store.proofToken = tokens.proofToken
    store.turnstileToken = tokens.turnstileToken

    // console.log(btoa(tokens.proofToken).substring(0,-2))
    
    store.isUpdatingTokens=false
}

async function getNewState(){
  
    
    let {cookies, data} = await getPageInfo()
  
  
    let data_build = data.split('data-build="')[1].split('"')[0]
    
    // console.log(SS.sid, store.stored_cookie, store.reqToken, store.proofToken, store.turnstileToken)
    // return
    let chatReq
    // try{
    //  chatReq = await chatRequirementsAPI()
    // }
    // catch(e){
    //   // console.log('[updateState error]', e)
    //   console.log('!_')
    //   store.isUpdatingTokens=false
    //   return
    // }

    // keep retrying until success
    while (true) {
        try {
            chatReq = await chatRequirementsAPI(store_auth.data.access_token,store_auth.data.cookie);
            break; // success, exit loop
        } catch (e) {
            console.log("!_2");
            await new Promise(r => setTimeout(r, 1000)); // optional: wait 1s before retry
        }
    }

    let chatReqToken = chatReq.token
    
    // return
    const tokens = await generateTokens(chatReq)

    return {tokens, chatReq, cookies, data_build}
}


async function updateStateWorkers(store, index){
    // if(store.isUpdatingTokens){return store}
    // console.log('updating')
    store.oldtoken = store.proofToken;
    // store.isUpdatingTokens=true
    
    let {cookies, data} = await getPageInfo()
    // console.log(cookies)
    if(!store.stored_cookie)
    store.stored_cookie = cookies

    if(!store.data_build)
    store.data_build = data.split('data-build="')[1].split('"')[0]
    
    // console.log(SS.sid, store.stored_cookie, store.reqToken, store.proofToken, store.turnstileToken)
    // return
    let chatReq
    try{
     chatReq = await chatRequirementsAPI(store_auth.data.access_token,store_auth.data.cookie);
    }
    catch(e){
      // console.log('[updateState error]', e)
      console.log('!_', index)
      // store.isUpdatingTokens=false
      return null
    }
    store.chatReq = chatReq
    store.reqToken = chatReq.token
    
    // return
    const tokens = await generateTokens(chatReq)
    
    store.proofToken = tokens.proofToken
    store.turnstileToken = tokens.turnstileToken
    // store.turnstileToken = i

    // console.log(btoa(tokens.proofToken).substring(0,-2))

    // store.isUpdatingTokens=false
    return store
}


function getLocalFileMetadata(filePath) {
  const basename = path.basename(filePath);
  const stats = fs.statSync(filePath); // synchronous file stats
  const size = stats.size; // size in bytes
  return { basename, size };
}


// const { basename, size } = getFileInfo('my full path');
// filesAPI(basename, size);

function filesAPI(file_name, file_size, cred=undefined){

let headers =  {
    "accept": "*/*",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "oai-client-version": "prod-43c98f917bf2c3e3a36183e9548cd048e4e40615",
    "oai-device-id": SS.sid || "c932c017-a9af-4495-bca1-b7921c90ed4b",
    "oai-language": "it-IT",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": store.stored_cookie+(cred?.authcookie?'; '+cred?.authcookie:''),
    "User-Agent": getRandomUserAgent(0),
  }
if (cred?.access_token) {
  headers.authorization = `Bearer ${cred.access_token}`;
}
return fetch("https://chatgpt.com/backend-anon/files", {
  headers,
  "referrer": "https://chatgpt.com/",
  "body": JSON.stringify({
    file_name,
    file_size,
    use_case: "multimodal",
    timezone_offset_min: -120
  }) ||
  "{\"file_name\":\"myfile.jpg\",\
  \"file_size\":16072,\
  \"use_case\":\"multimodal\",\
  \"timezone_offset_min\":-120,\
  \"reset_rate_limits\":false}",

  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
}

function filesBlobPutAPI(uploadMetadata, abspath, fileData, size, cred=undefined){
// read file synchronously into a Buffer
let headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-length": size,
    "content-type": getMimeType(abspath) || "image/jpeg",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-ms-blob-type": "BlockBlob",
    "x-ms-version": "2020-04-08",
    "cookie": store.stored_cookie+(cred?.authcookie?'; '+cred?.authcookie:''),
    "User-Agent": getRandomUserAgent(0),
  }
  if (cred?.access_token) {
  headers.authorization = `Bearer ${cred.access_token}`;
}
// console.log(getMimeType(abspath))
return fetch(uploadMetadata.upload_url, {
  headers,
  body: fileData,
  "referrer": "https://chatgpt.com/",
  "method": "PUT",
  "mode": "cors",
  "credentials": "omit"
});
}


function processUploadStreamAPI(uploadMetadata, basename, cred=undefined){
  let headers = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "oai-client-version": "prod-43c98f917bf2c3e3a36183e9548cd048e4e40615",
    "oai-device-id": SS.sid || "c932c017-a9af-4495-bca1-b7921c90ed4b",
    "oai-language": "it-IT",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    // "cookie": cc,
    "origin": "https://chatgpt.com",
    "referer": "https://chatgpt.com/",
    // "cookie": cookie,
    "User-Agent": getRandomUserAgent(0),
    "cookie": store.stored_cookie+(cred?.authcookie?'; '+cred?.authcookie:''),
  }
  if (cred?.access_token) {
  headers.authorization = `Bearer ${cred.access_token}`;
}
return fetch("https://chatgpt.com/backend-anon/files/process_upload_stream", {
  headers,
  "referrer": "https://chatgpt.com/",
  "body": JSON.stringify({
    file_id: uploadMetadata.file_id,
    use_case: "multimodal",
    index_for_retrieval: false,
    file_name: basename
  }) ||
  "{\"file_id\":\"file-AZHyEa3eqXXUp5T4pFnUt3\",\"use_case\":\"multimodal\",\"index_for_retrieval\":false,\"file_name\":\"1920.webp\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
}

function getMimeType(filePath) {
  // Looks up based on file extension
  return mime.lookup(filePath) || "application/octet-stream";
}


async function fileUploadTask(abspath, cred=undefined){
  const { basename, size } = getLocalFileMetadata(abspath);
  let uploadMetadata = await (await filesAPI(basename, size, cred)).json();
  // {
  //   "status": "success",
  //   "upload_url": "https://files.oaiusercontent.com/file-AZHyEa3eqXXUp5T4pFnUt3?se=2025-09-11T18%3A11%3A39Z&sp=cw&sv=2024-08-04&sr=b&skoid=ae70be19-8043-4428-a990-27c58b478304&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-10T23%3A21%3A03Z&ske=2025-09-11T23%3A21%3A03Z&sks=b&skv=2024-08-04&sig=2ULqAg3Sof4Z7lrANQxNj7p4DOIF1KUZUqFXyjzevI0%3D",
  //   "file_id": "file-AZHyEa3eqXXUp5T4pFnUt3"
  // }
  // console.log('uploadMetadata',uploadMetadata)
  const mime = getMimeType(abspath)
  const fileData = fs.readFileSync(abspath);
  let r = await filesBlobPutAPI(uploadMetadata, abspath, fileData, size, cred)
  // console.log(r)
  let c = (r.headers.getSetCookie() || []).map(c => c.split(";")[0]) // take only "name=value"
  .join("; ")+'; oai-did='+SS.sid
  // console.log(c)

  let res = await processUploadStreamAPI(uploadMetadata, basename, cred)
  // console.log(res)
  let text = await res.text()
  // console.log('text',text)
  let dims = mime.includes('image')?sizeOf.imageSize(fileData):{height: undefined, width: undefined}
  let part = mime.includes('image')?{content_type: "image_asset_pointer", "asset_pointer": `file-service://${uploadMetadata.file_id}`, size_bytes: size, height: dims.height, width: dims.width }:undefined
  let attachment = {id: uploadMetadata.file_id, size: size, name: basename, mime_type: mime.replace('application/mp4','video/mp4'), source: "local", height: dims.height, width: dims.width}
  return {part, attachment}
}

  async function getOaiSentinelToken(flow='username_password_create', did){
    // flows: username_password_create, login_password
      let n = await getNewState()
      let payload = {
          p: n.tokens.proofToken,
          t: n.tokens.turnstileToken,
          c: n.tokens.req_token
      }
      // console.log(n.cookies)
      // return
      // let flow = 'username_password_create'
      let oai_sentinel_token = Kt(payload, flow, did || getOaiDeviceId())
      return oai_sentinel_token
  }

// paths::C:\Users\Andrea11\Documents\car.jpg:: che macchina è?
module.exports = {getPageInfo, chatRequirementsAPI, conversationAPI, updateState, updateStateWorkers, fileUploadTask, getNewState, getOaiDeviceId, getOaiSentinelToken}