(() => {
  const payModal = document.getElementById('pay-modal');
  const scriptUrl = 'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js';

  const setPayment = async () => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    const response = await window.request({
      url: '<%= Paths.mercadopago.createPayment %>',
      method: 'post',
      body: { productName: 'Consulta', reference: '<%= uuid %>' }
    });
    if (!response) return console.error('Error with payment request');
    if (response.status !== 200) return console.error('Error creating the payment');
    script.setAttribute('data-preference-id', response.body.id);
    script.setAttribute('data-button-label', 'Consultar');
    payModal.appendChild(script);
  };
  // setPayment();
})();
