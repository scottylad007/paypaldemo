const express = require('express');
const braintree = require('braintree');

const app = express();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: '9sqqhddgsmbv356g',
  publicKey: 'ps74rxmj2tjp8vvt',
  privateKey: 'f200c067b7d2b8a81b7669cbdba2618e'
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
        res.status(500).send(err);
        return;
    }
    res.send(response.clientToken);
  });
});

app.use(express.static('public'));

app.use(express.json());  // Parse JSON requests

app.post('/process_payment', (req, res) => {
  const nonceFromTheClient = req.body.nonce;
  const amount = req.body.amount;

  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if (err) {
      res.status(500).send({ error: err });
      return;
    }
    res.send(result);
  });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
  