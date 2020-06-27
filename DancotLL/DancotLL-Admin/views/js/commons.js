window.commons = {};

window.commons.loadScripts = (arrScripts, start) => {
  if (!arrScripts.length) return;
  const scriptElement = document.createElement('script');
  scriptElement.src = arrScripts[start];
  scriptElement.onload = () => {
    if (arrScripts[start + 1]) {
      window.commons.loadScripts(arrScripts, start + 1);
    }
  };
  document.body.appendChild(scriptElement);
};

window.commons.query = (() => {
  if (!window.location.search) return {};
  const vars = window.location.search.substring(1).split('&');
  const result = {};
  for (let k = 0; k < vars.length; k += 1) {
    const [currKey, currValue] = vars[k].split('=');
    result[currKey] = currValue;
  }
  return result;
})();

window.commons.appendQuery = data => {
  data = { ...window.commons.query, ...data };
  const keys = Object.keys(data);
  const { href } = window.location;
  let query = '?';
  for (let k = 0; k < keys.length; k += 1) query += `${k === 0 ? '' : '&'}${keys[k]}=${data[keys[k]]}`;
  let qIndex = href.indexOf('?');
  qIndex = qIndex === -1 ? href.length : qIndex;
  window.location = `${href.substring(0, qIndex)}${query}`;
};
window.request = ({ url, method = 'get', body = {} }) =>
  new Promise(resolve => {
    if (!url) {
      console.error('No url provided');
      return resolve(null);
    }
    body = ['get', 'head'].includes(method.toLowerCase()) ? undefined : JSON.stringify(body);
    const headers = { 'Content-Type': 'application/json' };

    fetch(new Request(url, { method, body, headers }))
      .then(async Res => {
        const Res2 = Res.clone();
        const json = await new Promise(resolveJson =>
          Res.json()
            .then(resolveJson)
            .catch(() => resolveJson(null))
        );
        resolve({
          body: json || (await Res2.text()),
          status: Res.status
        });
      })
      .catch(error => {
        console.error(error);
        resolve(null);
      });
  });
