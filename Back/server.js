const stripe = require('stripe')('sk_test_51R1YgHEQe3FsCkK9oW4FQp6aJKCfz19P15PXZyrec0j2NnkfKKzBR25ooEUQg41Dwe9ZchiUzsvV3HhvwfUJJ9MD001v0MIX2z');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const YOUR_DOMAIN = 'http://localhost:5173';

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: 'price_1R2HXUEQe3FsCkK9mPz8Ini5', // 🔹 Substitua por um Price ID real do Stripe
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret || session.id });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/session-status', async (req, res) => {
  try {
    if (!req.query.session_id) {
      return res.status(400).json({ error: 'Session ID é obrigatório' });
    }

    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    res.json({
      status: session.status,
      customer_email: session.customer_details?.email || 'Não disponível'
    });
  } catch (error) {
    console.error('Erro ao buscar status da sessão:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(4242, () => console.log('🔥 Servidor rodando na porta 4242'));
