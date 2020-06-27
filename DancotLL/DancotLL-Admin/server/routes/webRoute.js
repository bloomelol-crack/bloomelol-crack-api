const { uuid } = require('uuidv4');

const fs = require('fs');
const url = require('url');

const listFiles = require('../commons/listFiles');
const { app, sessionMiddleware } = require('../commons/middlewares');
const projectDir = require('../commons/projectDir');
const { Paths } = require('../routes/schemas');
const constants = require('../../views/constants.json');

const getEndpointFiles = dir => {
  const fileList = listFiles(dir);
  const ejs = [];
  const other = [];
  for (let k = 0; k < fileList.length; k += 1)
    if (fileList[k].endsWith('.ejs')) ejs.push(fileList[k].substring(0, fileList[k].length - 4));
    else other.push(fileList[k]);
  return { ejs, other };
};

const languages = (() => {
  const files = fs
    .readdirSync(`${projectDir}/views/languages`)
    .filter(file => fs.lstatSync(`${projectDir}/views/languages/${file}`).isFile())
    .map(file => `/${file.substring(0, file.length - 3)}`);
  const obj = {};
  for (let k = 0; k < files.length; k += 1) {
    obj[files[k]] = require(`../../views/languages${files[k]}`);
  }
  return obj;
})();
const componentLanguages = (() => {
  const files = fs
    .readdirSync(`${projectDir}/views/languages/components`)
    .filter(file => fs.lstatSync(`${projectDir}/views/languages/components/${file}`).isFile())
    .map(file => file.substring(0, file.length - 3));
  const obj = {};
  for (let k = 0; k < files.length; k += 1)
    obj[files[k]] = require(`../../views/languages/components/${files[k]}`);
  return obj;
})();
const getLanguage = code => {
  const keys = Object.keys(componentLanguages);
  const obj = {};
  for (let k = 0; k < keys.length; k += 1) obj[keys[k]] = { ...componentLanguages[keys[k]][code] };
  return obj;
};
const setLanguage = (req, path) => {
  path = path || req.path;
  req.session.data = req.session.data || {};
  const langCode = req.query.lang || req.session.data.languageCode || 'en';
  const lang = (languages[path] && languages[path][langCode]) || {};
  if (lang) {
    req.session.data.languageCode = langCode;
    req.session.data.language = lang;
    req.session.data.componentLanguages = getLanguage(langCode);
  } else {
    req.session.data.languageCode = req.session.data.languageCode || 'en';
    req.session.data.language = languages[path].en;
    req.session.data.componentLanguages = getLanguage('en');
  }
  return {
    langCode,
    language: req.session.data.language,
    ComponentLanguages: req.session.data.componentLanguages
  };
};

const files = getEndpointFiles(`${projectDir}/views/`);

app.locals = {
  Paths,
  constants,
  style: obj =>
    `<script>(${(style => {
      const styleElem = document.createElement('style');
      styleElem.innerHTML = style;
      document.head.appendChild(styleElem);
    }).toString()})('${obj.replace(/'/g, "\\'").replace(/\n|\r/g, '\\n')}')</script>`
};
app.set('views', `${projectDir}/views`);
app.set('view engine', 'ejs');

app.get('/', sessionMiddleware, async (req, res) => {
  const { langCode, language, ComponentLanguages } = setLanguage(req, '/index');
  if (req.query.lang) {
    delete req.query.lang;
    return res.redirect(url.format({ pathname: req.path, query: req.query }));
  }
  res.render('index.ejs', {
    uuid: uuid(),
    language,
    langCode,
    componentLanguages: ComponentLanguages
  });
});
app.get(files.ejs, sessionMiddleware, (req, res) => {
  const filePath = `${req.path}.ejs`;
  const { langCode, language, ComponentLanguages } = setLanguage(req, req.path);
  if (req.query.lang) {
    delete req.query.lang;
    return res.redirect(url.format({ pathname: req.path, query: req.query }));
  }

  res.render(`${projectDir}/views${filePath}`, {
    uuid: uuid(),
    language,
    langCode,
    componentLanguages: ComponentLanguages
  });
});

if (files.other.length > 0)
  app.get(files.other, (req, res) => res.sendFile(`${projectDir}/views${req.path}`));
