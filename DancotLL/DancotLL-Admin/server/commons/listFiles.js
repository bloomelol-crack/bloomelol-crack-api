const fs = require('fs');

const listFiles = (dir, lastDir = '', filelist = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = listFiles(`${dir + file}/`, `${lastDir}${file}/`, filelist);
    } else {
      filelist.push(`/${lastDir}${file}`);
    }
  });
  return filelist;
};

module.exports = listFiles;
