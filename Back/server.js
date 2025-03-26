// This is your test secret API key.
<<<<<<< HEAD
const stripe = require('stripe')('sk_test_51R1Yg9CagxYT8d5LK1GojIelsXM3KU4qcEklvb7tqGQuWgzp3xpd9JwYrzd3NAqSTpetwo2ooy6TmxMthjxHTKgi00RHfxiLI5');
=======
const stripe = require('stripe')('sk_test_51R6dD9PibkWnHETBhTYxkvpwmAdFgwlQYd1CYEAmLvwreuaFeU6LZdSxdnf2Lr7MOKxn8o7EyKrZh4tX93viMiJF00jwcDPliT');
>>>>>>> c2083c52a21fed9df8e5604b0c2ab6736e47dca4
const express = require('express');
const app = express();
app.use(express.static('public'));

<<<<<<< HEAD
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
=======
const YOUR_DOMAIN = 'http://localhost:5173';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1R6dJ2PibkWnHETBWxnmg9Ko',
        quantity: 1,
      }
    ],
    mode: 'payment',
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(4242, () => console.log('Running on port 4242'));
>>>>>>> c2083c52a21fed9df8e5604b0c2ab6736e47dca4
