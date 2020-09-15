const moment = require('moment');

const { run } = require('./utils');

let command = 'cd AccountAutoreaper';
command += '; git config user.email "bloomelolcrack.addons@gmail.com"';
command += '; git config user.name "bloomelol-crack"';
command += `; git commit -m "Autoreap ${moment().format('DD/MM/YYYY hh:mm')}" --allow-empty`;
command += '; git push origin master';

run(command);
