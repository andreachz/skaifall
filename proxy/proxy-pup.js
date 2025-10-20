const puppeteer = require('puppeteer-extra');
const pupcore = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), "puppeteer-cors-"));

  // 'C:\\Users\\Andrea11\\Downloads\\Win_x64_1390026_chrome-win\\chrome-win\\chrome.exe'||
  const browser = await puppeteer.launch({
    executablePath: pupcore.executablePath('chrome') || '/path/to/your/chrome',
    headless: false,
    args: [
      // "--disable-web-security",
      // "--disable-features=IsolateOrigins,site-per-process",
      // "--allow-running-insecure-content",
    '--no-sandbox',
    '--disable-gpu',
    ' --disable-blink-features=AutomationControlled', '--disable-infobars',
    ' --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.70 Safari/537.36"',
      `--user-data-dir=${tempProfile}`,
    ],
  });

  const page = await browser.newPage();
  






  await page.goto('https://spys.one/en/http-proxy-list/', { waitUntil: 'domcontentloaded' });
  // await page.waitForSelector('#xpp', {timeout: 10000})
  // await page.select("#xpp", "5");


  console.log(await page.title());


  await page

  // keep the browser open
  // await browser.close();
})();

