var button = document.querySelector('#submit-button');

// Here's the place where you get the client token from your server
var clientToken = "sandbox_387kmprt_9sqqhddgsmbv356g";

braintree.dropin.create({
  authorization: clientToken,
  container: '#dropin-container'
}, function (createErr, instance) {
  button.addEventListener('click', function () {
    instance.requestPaymentMethod(function (err, payload) {
      // Send payload.nonce to your server
      // Let's just show the nonce for the sake of this example
      document.getElementById('transaction-result').textContent = JSON.stringify(payload, null, 4);
    });
  });
});
