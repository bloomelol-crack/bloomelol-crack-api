const mustache = require('mustache');

const fs = require('fs');

const { EMAIL, EMAIL_USER } = require('env.json');

const templates = {};
mustache.escape = text => text;

fs.readdir(`${projectDir}/src/emails`, (error, dirs) => {
  for (let i = 0; i < dirs.length; i += 1)
    templates[dirs[i]] = {
      spec: require(`../emails/${dirs[i]}/spec.json`),
      lang: require(`../emails/${dirs[i]}/lang.json`)
    };
});

const send = (from, to, subject, text, html) =>
  new Promise(async resolve => {
    from = from || `${EMAIL_USER} <${EMAIL}>`;
    if (!to || !to.length) {
      rollbar.error(`No recipients found for sending email, subject: ${subject}`);
      return resolve(null);
    }
    to = Array.isArray(to) ? to : [to];
    aws.ses.sendEmail(
      {
        Destination: { ToAddresses: to },
        Message: {
          Body: { Html: { Charset: 'UTF-8', Data: html }, Text: { Charset: 'UTF-8', Data: text } },
          Subject: { Charset: 'UTF-8', Data: subject }
        },
        Source: from
      },
      (error, data) => {
        if (error) {
          rollbar.error(error);
          return resolve(null);
        }
        resolve(data);
      }
    );
  });

/**
 * Get errors validating with spec
 * @param {*} data
 * @param {*} shape
 * @param {*} _key
 * @returns {string[]}
 */
const getDataErrors = (data, shape = {}, _key = '') => {
  let errors = [];
  if (Array.isArray(data)) {
    const [Shape] = shape;
    for (let k = 0; k < data.length; k += 1) {
      const _Key = `${(_key && `${_key}.`) || _key}${k}`;
      errors = errors.concat(getDataErrors(data[k], Shape, _Key));
    }
  } else {
    const keys = Object.keys(shape);
    for (let k = 0; k < keys.length; k += 1) {
      const key = keys[k];
      const _Key = `${(_key && `${_key}.`) || _key}${key}`;
      data = data || {};
      const isArray = [Array.isArray(shape[key]), Array.isArray(data[key])];
      const isObject = [
        typeof shape[key] === 'object' && !isArray[0],
        typeof data[key] === 'object' && !isArray[1]
      ];
      const isRequired = typeof shape[key] === 'string' && shape[key].toLowerCase() === 'required';
      if (isRequired && data && data[key] === undefined) {
        errors.push(`${_Key} (Missing)`);
        continue;
      }
      if (isArray[0] && !isArray[1]) {
        errors.push(`${_Key} (Expected an array)`);
        continue;
      }
      if (isObject[0] && !isObject[1]) {
        errors.push(`${_Key} (Expected an object)`);
        continue;
      }
      if (isArray[0] || isObject[0]) errors = errors.concat(getDataErrors(data[key], shape[key], _Key));
    }
  }
  return errors;
};

const getEmail = (template, lang, data) => {
  const html = fs.readFileSync(`${projectDir}/src/emails/${template}/html.html`).toString();
  const text = fs.readFileSync(`${projectDir}/src/emails/${template}/text.txt`).toString();
  return {
    html: (html && mustache.render(html, { data, lang: templates[template].lang[lang] })) || '',
    text: (text && mustache.render(text, { data, lang: templates[template].lang[lang] })) || ''
  };
};

globalThis.emails = { send, getDataErrors, templates, getEmail };
