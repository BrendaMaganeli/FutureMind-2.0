// This is your test secret API key.
const stripe = require('stripe')('sk_test_51R1Yg9CagxYT8d5LK1GojIelsXM3KU4qcEklvb7tqGQuWgzp3xpd9JwYrzd3NAqSTpetwo2ooy6TmxMthjxHTKgi00RHfxiLI5');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));
