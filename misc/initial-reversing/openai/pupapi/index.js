const puppeteer = require('puppeteer-extra');
const pupcore = require('puppeteer-core')
const fs = require('fs');
const path = require('path');
const os = require('os');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// add stealth plugin
puppeteer.use(StealthPlugin());

(async () => {
  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), "puppeteer-cors-"));

  const browser = await puppeteer.launch({
    executablePath: pupcore.executablePath('chrome') || '/path/to/your/chrome', // e.g. /usr/bin/google-chrome
    headless: false,
        args: [
      // ⚠️ Disables same-origin & CORS checks
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--allow-running-insecure-content",
      `--user-data-dir=${tempProfile}`,
    ],
  });

  const page = await browser.newPage();
  await page.goto('https://chatgpt.com');
  console.log(await page.title());
  await ask()
  async function ask(prompt='hi'){
    await page.waitForSelector('#prompt-textarea', { visible: true });
    await page.focus('#prompt-textarea');
    await page.keyboard.type(prompt || 'hi');
    await page.keyboard.press('Enter');
  }

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('conversation')) {
      console.log('✅ Intercepted response from:', url);

      try {
        // Try JSON first
        const data = await response.json();
        console.log('Response JSON:', data);
      } catch (err) {
        // Fallback: plain text
        const text = await response.text();
        console.log('Response Text:', text);
      }
    }
  });


//   await browser.close();
})();