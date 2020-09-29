import 'globals';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

import rollbar from 'utils/rollbar';
import { account } from 'database/models';
import env from '../../env.json';
import { REGION_MAPPING } from 'routes/actions/account/constants';
import { wait } from '../../utils/wait';
import { url, emails } from './constants';

const { axios } = require('../../utils/request');
const redis = require('../../utils/redis');

const execute = async () => {
  let username = null;
  let password = null;
  let newPassword = null;
  let newEmail = null;
  let passwordUpdated = false;
  let emailUpdated = false;
  let browserClosed = false;
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: env.NODE_ENV !== 'localhost',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    page.setUserAgent(new UserAgent().toString());
    page.on('response', e => {
      try {
        e.json()
          .then(json => {
            if (json && json['re-auth'] && json['re-auth'].region && username) {
              const { region } = json['re-auth'];
              const mappedRegion = REGION_MAPPING[region];
              if (!mappedRegion) return rollbar.error(`Failed to map region '${region}'`);
              account.update({ UserName: username }, { $set: { Region: mappedRegion } });
            }
          })
          .catch(() => {});
      } catch (e) {}
    });

    log('Going to page');
    await page.goto('https://www.leagueoflegends.com');
    log('go to login');
    await page.evaluate(() => {
      document.querySelector('.riotbar-anonymous-link.riotbar-account-action').click();
    });
    const { json: retries } = await redis.Find('passwordChangeRetries');
    if (retries && retries.length) {
      const [retry] = retries;
      ({ username } = retry);
      ({ password } = retry);
      ({ newPassword } = retry);
      ({ passwordUpdated } = retry);
      ({ emailUpdated } = retry);
      ({ newEmail } = retry);
      log(
        `Retrying previous failed change, emailUpdated: ${emailUpdated}, passwordUpdated: ${passwordUpdated}`
      );
      await redis.Delete('passwordChangeRetries', { threadID: retry.threadID });
    } else {
      const response = await axios({
        options: {
          url,
          method: 'post',
          headers: {
            [`admin_secret_${env.NODE_ENV}`]: env.ADMIN_SECRET,
            admin_secret_production: '5feb97b14331453fbbe2ba19bc97cc77446cef5f-ce74-4cc4-baee-033dca9c1831'
          },
          data: { emails }
        }
      });
      if (!response) throw new Error('Could not get accounts');
      if (response.status === 404) throw new Error('No accounts to update');
      if (response.status !== 200) throw new Error('Error getting accounts');
      log('Response Body', response.body);
      log(`${response.body.remaining} remaining accounts`);
      username = response.body.account.UserName;
      password = response.body.account.Password;
      newPassword = response.body.account.NewPassword;
      newEmail = response.body.account.NewEmail;
    }
    if (username && password) {
      const retry = {
        username,
        password,
        newPassword,
        newEmail,
        passwordUpdated,
        emailUpdated,
        threadID: process.env.threadID
      };
      await redis.Add('passwordChangeRetries', retry);
    }

    log('username', username);
    log('password', password);

    await wait(5000);
    log('typing inputs...');
    await page.type("input[name='username']", username);
    await page.type("input[name='password']", passwordUpdated ? newPassword : password);
    log('clicking login...');
    await page.evaluate(() => {
      document.querySelector('.mobile-button.mobile-button__submit').click();
    });
    log('going to management...');
    await wait(10000);
    await page.evaluate(() => {
      document.querySelector('a[data-riotbar-account-action="management"]').click();
    });
    await wait(8000);
    log('confirming password...');
    await page.type("input[type='password']", passwordUpdated ? newPassword : password);
    log('clicking button');
    await page.click('#login-button');
    await wait(5000);
    if (!passwordUpdated) {
      log('going to password');
      await page.goto('https://account.riotgames.com/account/password');
      await wait(4000);
      log('changing password...');
      await page.type('input[data-testid="input-current-password"]', password);
      await page.type('input[data-testid="input-new-password"]', newPassword);
      await page.type('input[data-testid="input-new-password-confirm"]', newPassword);
      await page.click('button[data-testid="submit-new-password"]');
      log('Clicked button for changing password');
      await wait(8000);
      await redis.Update(
        'passwordChangeRetries',
        { threadID: process.env.threadID },
        { passwordUpdated: true }
      );
      passwordUpdated = true;
    }
    if (!emailUpdated) {
      log('going to email...');
      await page.goto('https://account.riotgames.com/account/email');
      await wait(4000);
      log(`typing new email: ${newEmail}`);
      await page.type('input[data-testid="input-new-email"]', newEmail);
      await page.type('input[data-testid="input-new-email-confirm"]', newEmail);
      await page.click('button[data-testid="submit-new-email"]');
      log('Clicked button for changing email');

      await wait(8000);
      await redis.Update('passwordChangeRetries', { threadID: process.env.threadID }, { emailUpdated: true });
      emailUpdated = true;
    }
    await browser.close();
    browserClosed = true;
    await redis.Delete('passwordChangeRetries', { threadID: process.env.threadID });
  } catch (e) {
    logError(e);
    if (!browserClosed) await browser.close();
  }
  await wait(10000);
  execute();
};

if (env.NODE_ENV === 'production') execute();
