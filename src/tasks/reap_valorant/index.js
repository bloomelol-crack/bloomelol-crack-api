import 'globals';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';
import { account } from 'database/models';

import env from '../../env.json';
import init from './init';

const execute = async () => {
  const browser = await puppeteer.launch({
    headless: env.NODE_ENV !== 'localhost',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.setUserAgent(new UserAgent().toString());

  log('Going to valorant checker');
  await page.goto('https://checkz.net/tools/valorant-account-checker');
  log('init script');
  page.on('console', m => console.log(m.text()));
  await page.evaluate(init, [{ UserName: '123abcnao', Password: '123abcnao' }]);
};

// if (env.NODE_ENV === 'localhost' || env.NODE_ENV === 'production') execute();
