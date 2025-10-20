fetch("https://web2.temp-mail.org/mailbox", {
  "headers": {
    "accept": "*/*",
    "accept-language": "it-IT,it;q=0.9",
    "cache-control": "no-cache",
    // "content-type": "application/json",
    // "pragma": "no-cache",
    // "priority": "u=1, i",
    // "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    // "sec-ch-ua-mobile": "?0",
    // "sec-ch-ua-platform": "\"Windows\"",
    // "sec-fetch-dest": "empty",
    // "sec-fetch-mode": "cors",
    // "sec-fetch-site": "same-site",
    // "Referer": "https://temp-mail.org/"
  },
//   "body": null,
  "method": "POST"
}).then(x=>{console.log(x.json().then(x=>{console.log(x)}))})



