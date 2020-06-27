const mustache = require('mustache');

const fs = require('fs');

const projectDir = require('../../commons/projectDir');
const { send, templates, getDataErrors } = require('../../commons/emails');

mustache.escape = text => text;

module.exports = {
  send: async (req, res) => {
    const { from, to, subject, html, text } = req.body;
    const response = await send(from, to, subject, text, html);
    if (!response) return res.status(500).json({ error: 'Could not send the email' });
    res.status(response.status).json(response.body);
  },
  sendTemplate: async (req, res) => {
    const { templateName } = req.params;
    const { from, to, subject, data } = req.body;
    const { lang } = req.query;
    const template = templates[templateName];
    if (!template) return res.status(404).json({ error: 'Template not found' });
    const language = template.lang[lang];
    if (!language) return res.status(404).json({ error: `Template '${templateName}' has no lang '${lang}'` });
    const errors = getDataErrors(data, template.spec);
    if (errors.length) return res.status(422).json({ message: 'There are data errors', errors });
    let html = fs.readFileSync(`${projectDir}/server/emails/${templateName}/html.html`).toString();
    let text = fs.readFileSync(`${projectDir}/server/emails/${templateName}/text.txt`).toString();
    html = (html && mustache.render(html, { data, lang: language })) || '';
    text = (text && mustache.render(text, { data, lang: language })) || '';
    const response = await send(from, to, subject, text, html);
    if (!response) return res.status(500).json({ error: 'Could not send the email' });
    res.status(response.status).json(response.body);
  }
};
