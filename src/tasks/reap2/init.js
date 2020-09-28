export default (accounts, regionNumber) => {
  regionNumber = regionNumber.toString(); // Region from 1 to 12
  const list = document.getElementById('cclist');
  const server = document.getElementById('server');

  const updates = [];
  const getUpdate = () =>
    updates
      .map(update => `db.Accounts.updateOne(${JSON.stringify(update.where)}, ${JSON.stringify(update.set)})`)
      .join(';\n');

  const OldXHR = window.XMLHttpRequest;
  function newXHR() {
    const realXHR = new OldXHR();
    realXHR.addEventListener(
      'readystatechange',
      () => {
        if (realXHR.readyState !== realXHR.DONE) return;
        try {
          if (realXHR.status < 200 || realXHR.status > 299) throw new Error('Not 200');
          const body = JSON.parse(realXHR.response);
          console.log(body);
          if (body.sonuc !== 'canli') return;
          const table = document.createElement('table');
          table.innerHTML = body.icerik;
          const trs = table.getElementsByTagName('tr');
          const newUsernames = [];
          for (let i = 0; i < trs.length; i += 1) {
            const tr = trs[i];
            const [, userData, capture] = tr.getElementsByTagName('td');
            const [UserName] = userData.innerHTML.split(':');
            newUsernames.push(UserName);
            const [, , , , , , Email, EmailVerified] = capture.innerHTML.split('<br>');
            updates.push({
              where: { UserName },
              set: {
                $set: {
                  Email: Email.split(':')[1].trim() || '',
                  EmailVerified: EmailVerified.split(':')[1].trim() === 'Verified'
                }
              }
            });
            console.log(updates);
            console.clear();
            console.log(getUpdate());
          }
          accounts = accounts.filter(account => !newUsernames.includes(account.UserName));
        } catch (e) {}
      },
      false
    );
    return realXHR;
  }
  window.XMLHttpRequest = newXHR;

  console.clear();
  function startQuery(accs) {
    if (!accs) return;
    server.value = regionNumber;
    const submit = document.getElementById('submit');
    let comboText = '';
    for (let i = 0; i < accs.length; i += 1) {
      if (i !== 0) comboText += '\n';
      comboText += `${accs[i].UserName}:${accs[i].Password}`;
    }
    list.value = comboText;
    submit.click();
  }
  console.log('accounts', accounts);
  startQuery(accounts);
};
