const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://my.hirezstudios.com/my-account');
  page.setRequestInterception(true);
  page.on('request', request => {
    console.log('request', request);
  });

  // example: get innerHTML of an element
  // const someContent = await page.$eval('#selector', el => el.innerHTML);

  // Use Promise.all to wait for two actions (navigation and click)
  // await Promise.all([
  //   page.waitForNavigation(), // wait for navigation to happen
  //   page.click('a.some-link') // click link to cause navigation
  // ]);

  // // another example, this time using the evaluate function to return innerText of body
  // const moreContent = await page.evaluate(() => document.body.innerText);

  // click another button
  await page.click('.login-btn');

  // close brower when we are done
  await browser.close();
})();
