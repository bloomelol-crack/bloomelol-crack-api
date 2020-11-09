import moment from 'moment';

import { run } from './utils';

let command = 'cd AccountAutoreaper';
command += '; git config user.email "bloomelolcrack.addons@gmail.com"';
command += '; git config user.name "bloomelol-crack"';
command += '; git pull origin master';
command += `; git commit -m "Autoreap ${moment().format('DD/MM/YYYY hh:mm A')}" --allow-empty`;
command += '; git push origin master';

run(command);
