const { getRandomUserAgent } = require('../ai-modules/openai/plainjs/helpers.js');
const {runCurlImpersonate} = require('../ai-modules/openai/plainjs/impersonate-api');
const store = require('./store.js');


async function newTempMail(){
    const res = await fetch(
        'https://web2.temp-mail.org/mailbox',{
        method: 'POST', 
        headers: 
        {
            "accept": "*/*",
            "accept-language": "it-IT,it;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            // "User-Agent": getRandomUserAgent(0)
        },
    })
    // console.log(stdout)
    // let res = JSON.parse(stdout)
    // console.log()
    store.tempMailCreds = await res.json()
    console.log(store.tempMailCreds)
    return store.tempMailCreds
}

async function newTempMail_(){
    const { stdout, stderr, code } = await runCurlImpersonate({
        url: 'https://web2.temp-mail.org/mailbox', 
        method: 'POST', 
        headers:
        {
            "accept": "*/*",
            "accept-language": "it-IT,it;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
    })
    // console.log(stdout)
    let res = JSON.parse(stdout)
    // console.log(res)
    store.tempMailCreds = res
    return res
}

function getTempMailCreds(){
    return store.tempMailCreds
}

async function getMessages_(cred){
    const { stdout, stderr, code } = await runCurlImpersonate({
    // const res = await fetch(
        url: 'https://web2.temp-mail.org/messages',
        method: 'GET', 
        headers: {
            "accept": "*/*",
            "accept-language": "it-IT,it;q=0.9",
            "authorization": "Bearer "+cred.token,
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
    })

    // console.log(stdout)
    let res = JSON.parse(stdout)
    // console.log(await res.text())
    return res
}
async function getMessages(cred){
    // const { stdout, stderr, code } = await runCurlImpersonate({
    const res = await fetch(
        'https://web2.temp-mail.org/messages',{
        method: 'GET', 
        headers: {
            "accept": "*/*",
            "accept-language": "it-IT,it;q=0.9",
            "authorization": "Bearer "+cred.token,
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
    })

    // console.log(stdout)
    // let res = JSON.parse(stdout)
    let r = await res.json()
    return r
}

async function waitMessage(cred, targetFrom = "noreply@tm.openai.com") {
    while (true) {
        try {
            const res = await getMessages(cred);
            // const data = await res.json();
            const data = res

            console.log(res)

            if (data && Array.isArray(data.messages)) {
                const msg = data.messages.find(m => m.from.includes('openai'));
                if (msg) {
                    // return msg.subject;
                    return msg;
                }
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        }

        // wait 2 seconds before trying again
        await new Promise(r => setTimeout(r, 2000));
    }
}



//     {
//     "mailbox": "behane3605@fanwn.com",
//     "messages": [
//         {
//             "_id": "68c58dfe43db0e0012efb8d3",
//             "receivedAt": 1757777407,
//             "from": "noreply@tm.openai.com",
//             "subject": "387523",
//             "bodyPreview": " <table style=\"width: 560px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspa",
//             "attachmentsCount": 0
//         }
//     ]
// }



(async ()=>{
    // await newTempMail()
    // console.log(getTempMailCreds())
    // await getMessages(getTempMailCreds())
    
})()




module.exports = {newTempMail, getMessages, getTempMailCreds, waitMessage}


