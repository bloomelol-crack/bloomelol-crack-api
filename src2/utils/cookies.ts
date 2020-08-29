export const getCookies = (cArray: string[] = []) => {
  if (!cArray) cArray = [];
  let cookies = '';
  for (let i = 0; i < cArray.length; i += 1) {
    const cookie = cArray[i];
    let endIndex = cookie.indexOf(' ');
    endIndex = endIndex === -1 ? cookie.length : endIndex;
    cookies += `${i > 0 ? ' ' : ''}${cookie.substr(0, endIndex)}`;
  }
  return cookies;
};
export const jsonCookie = (cookie: string) => {
  const output: { [key: string]: string } = {};
  cookie.split(/\s*;\s*/).forEach(pair => {
    const pairArr = pair.split(/\s*=\s*/);
    if (!pair[0]) return;
    output[pair[0]] = pairArr.splice(1).join('=');
  });
  return output;
};
export const strCookie = (cookie: { [key: string]: string }) => {
  const keys = Object.keys(cookie);
  let str = '';
  for (let i = 0; i < keys.length; i += 1) str += `${i === 0 ? '' : ' '}${keys[i]}=${cookie[keys[i]]};`;
  return str;
};
export const setCookies = (cookie: string, set: string) => {
  let jsCookie = jsonCookie(cookie);
  const jsonSet = jsonCookie(set);
  jsCookie = { ...jsCookie, ...jsonSet };
  cookie = strCookie(jsCookie);
  return cookie;
};
