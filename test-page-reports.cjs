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
  await browser.close();
})();
