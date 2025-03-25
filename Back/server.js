<<<<<<< HEAD
// This is your test secret API key.
const stripe = require('stripe')('sk_test_51R6dD9PibkWnHETBhTYxkvpwmAdFgwlQYd1CYEAmLvwreuaFeU6LZdSxdnf2Lr7MOKxn8o7EyKrZh4tX93viMiJF00jwcDPliT');
const express = require('express');
const app = express();
app.use(express.static('public'));

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
=======
const stripe = require('stripe')('sk_test_Ho24N7La5CVDtbmpjc377lJI', {
  apiVersion: '2025-02-24.acacia; custom_checkout_beta=v1;',
});

const express = require('express');
const cors = require('cors'); // Importando CORS
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); // Configurando CORS para permitir requisições da porta 5173

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      ui_mode: 'custom',
      return_url: 'http://localhost:5173/pagamento',
    });

    res.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});
>>>>>>> 0b86fe2ef7ffc4b64b2bf55c027ad492e71d6b27
