import 'globals';
import puppeteer from 'puppeteer';

import env from '../../env.json';
import { wait } from '../../utils/wait';
import { url, loginUrl, emails } from './constants';

const { axios } = require('../../utils/request');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
    /* headless: false, devtools: */
  });
  const page = await browser.newPage();

  log('Going to page');
  await page.goto('https://www.leagueoflegends.com');
  log('click button');
  await page.evaluate(() => {
    document.querySelector('.riotbar-anonymous-link.riotbar-account-action').click();
  });
  // await page.goto(loginUrl);
  // const response = await axios({
  //   url,
  //   method: 'post',
  //   headers: {
  //     [`admin_secret_${env.NODE_ENV}`]: env.ADMIN_SECRET,
  //     admin_secret_production: '5feb97b14331453fbbe2ba19bc97cc77446cef5f-ce74-4cc4-baee-033dca9c1831'
  //   },
  //   data: { emails }
  // });
  // if (!response) return logError('Could not get accounts');
  const username = 'KLEOACKII1337';
  const password = 'KLEOACKII1337';
  const newPassword = 'widergy2020';
  const newEmail = 'blumipoli@gmail.com';

  await wait(5000);
  log('typing inputs...');
  await page.type("input[name='username']", username);
  await page.type("input[name='password']", password);
  log('clicking login...');
  await page.evaluate(() => {
    document.querySelector('.mobile-button.mobile-button__submit').click();
  });
  log('going to management...');
  await wait(8000);
  await page.evaluate(() => {
    document.querySelector('a[data-riotbar-account-action="management"]').click();
  });
  await wait(8000);
  log('confirming password...');
  await page.type("input[type='password']", password);
  log('clicking button');
  await page.click('#login-button');
  await wait(5000);
  log('going to password');
  await page.goto('https://account.riotgames.com/account/password');
  await wait(4000);
  log('changing password...');
  await page.type('input[data-testid="input-current-password"]', password);
  await page.type('input[data-testid="input-new-password"]', newPassword);
  await page.type('input[data-testid="input-new-password-confirm"]', newPassword);
  // TODO discomment
  // await page.click('input[data-testid="submit-new-password"]');
  log('going to email...');
  await page.goto('https://account.riotgames.com/account/email');
  await wait(4000);
  log('typing new email...');
  await page.type('input[data-testid="input-new-email"]', newEmail);
  await page.type('input[data-testid="input-new-email-confirm"]', newEmail);

  // await browser.close();
})();
