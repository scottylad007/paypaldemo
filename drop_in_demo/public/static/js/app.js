fetch('/client_token')
  .then(response => response.text())
  .then(clientToken => {
    braintree.dropin.create({
      authorization: clientToken,
      container: '#dropin-container'
    }, function(createErr, instance) {
      if (createErr) {
        console.error('Failed to create drop-in instance:', createErr);
        return;
      }

      document.querySelector('#submit-button').addEventListener('click', function() {
        instance.requestPaymentMethod(function(err, payload) {
          if (err) {
            console.error('Failed to request payment method:', err);
            return;
          }
          
          // Send nonce to server for transaction processing
          fetch('/process_payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nonce: payload.nonce,
              amount: document.getElementById('amount').value
            })
          })
          .then(response => response.json())
          .then(data => {
            document.getElementById('transaction-result').textContent = JSON.stringify(data, null, 4);
          })
          .catch(error => {
            console.error('Payment processing error:', error);
          });

        });
      });
    });
  })
  .catch(error => {
    console.error('Error fetching client token:', error);
  });
