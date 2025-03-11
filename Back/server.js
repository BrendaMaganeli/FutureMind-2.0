const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51R1YgHEQe3FsCkK9oW4FQp6aJKCfz19P15PXZyrec0j2NnkfKKzBR25ooEUQg41Dwe9ZchiUzsvV3HhvwfUJJ9MD001v0MIX2z');

const app = express();
app.use(express.json());

app.post('/checkout', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Produto Exemplo' },
                        unit_amount: 5000, // Valor em centavos (50.00 USD)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://seusite.com/sucesso',
            cancel_url: 'https://seusite.com/cancelado',
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
