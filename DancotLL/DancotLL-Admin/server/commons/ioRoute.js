const schemas = require('../routes/schemas');

const io = require('./helpers/ioH');

io.on('connection', socket => {
  socket.emit('ConnectedRoute');
  const schemaNames = Object.keys(schemas);
  // Mapping all available endpoints
  for (let k = 0; k < schemaNames.length; k += 1) {
    const name = schemaNames[k];
    const epNames = Object.keys(schemas[name]);
    for (let m = 0; m < epNames.length; m += 1) {
      const epName = epNames[m];
      socket.on(`${name}:${epName}`, async req => {
        socket.emit(`${name}:${epName}`, await schemas[name][epName](req));
      });
    }
  }
});
