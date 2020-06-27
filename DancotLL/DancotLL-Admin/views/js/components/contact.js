(() => {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const sendButton = document.getElementById('send-button');

  const getData = () => `${name.value}${email.value}${subject.value}${message.value}`;
  let lastData = getData();
  let sent = false;

  const sendActivity = () => {
    window.request({
      url: '<%- Paths.activity.report[0] %>',
      method: '<%- Paths.activity.report.method %>',
      body: {
        paymentReference: '<%- uuid %>',
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
      }
    });
  };

  const sendEmail = async () => {
    if (sent) return;
    sent = true;
    console.log('Sending email...');
    const body = {
      from: `${name.value} <${email.value}>`,
      subject: `Contacto: ${subject.value}`,
      data: {
        Name: name.value,
        Email: email.value,
        Message: message.value.replace(/\n/g, '<br>')
      }
    };
    const result = await window.request({
      url: '<%- Paths.email.sendTemplate[0].replace(":templateName", "contact") %>?lang=es',
      method: '<%- Paths.email.sendTemplate.method %>',
      body
    });
    if (!result || result.status !== 200) {
      sent = false;
      return window.showMessage({
        Title: 'ERROR',
        Content: 'Algo salió mal, intenta mas tarde',
        Color: ' <%= constants.messageBox.red %>'
      });
    }
    window.showMessage({ Title: 'ÉXITO', Content: 'El email fue enviado correctamente!' });
  };
  sendButton.onclick = e => {
    e.preventDefault();
    sendEmail();
  };

  // setInterval(() => {
  //   const data = getData();
  //   if (lastData !== data) {
  //     lastData = data;
  //     sendActivity();
  //   }
  // }, 5000);
})();
