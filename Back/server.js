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
