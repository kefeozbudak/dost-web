const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('error', e => console.log('WINDOW ERROR:', e.message));
    window.addEventListener('unhandledrejection', e => console.log('UNHANDLED REJECTION:', e.reason));
  });

  await page.goto('http://localhost:3000/admin/reports');
  await new Promise(r => setTimeout(r, 2000));
  
  // Try to click by text
  const buttons = await page.$$('button');
  let clicked = false;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Yazdır') || text.includes('PDF')) {
      console.log("Clicking button with text:", text);
      await btn.click();
      clicked = true;
      break;
    }
  }
  if (!clicked) console.log("Print button not found!");
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
