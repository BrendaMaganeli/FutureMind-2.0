


























































































































































// const stripe = require('stripe')('sk_test_51R1Yg9CagxYT8d5LK1GojIelsXM3KU4qcEklvb7tqGQuWgzp3xpd9JwYrzd3NAqSTpetwo2ooy6TmxMthjxHTKgi00RHfxiLI5');
// const express = require('express');
// const app = express();
// app.use(express.static('public'));
// const { Pool } = require('pg');

// const pool = new Pool({
//     user: 'root', 
//     host: 'localhost',
//     database: 'futuremind', 
//     password: 'root',
//     port: 3306, 
// });

// const YOUR_DOMAIN = 'http://localhost:4242';

// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: '{{PRICE_ID}}',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${YOUR_DOMAIN}?success=true`,
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//   });

//   res.redirect(303, session.url);
// });

// app.get('/', async(req, res) => {

//   try {

//     const result = await pool.query('SELECT * FROM profissional');

//     if (result.rows.length > 0) {

//         res.status(200).json(result.rows);
//     } else {

//         res.status(404).json('Erro ao buscar profissionais')
//     }
// } catch (err) {

//     console.err('Erro no servidor');
//     res.status(500).json({err: 'erro'});
// }
// });

// app.listen(4242, () => console.log('Running on port 4242'));

const stripe = require('stripe')('sk_test_...');
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.static('public'));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'futuremind',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
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

app.get('/', async (req, res) => {

  try {
    const [rows] = await pool.query('SELECT * FROM profissional');

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json('Nenhum profissional encontrado');
    }
  } catch (err) {
    console.error('Erro no servidor', err);
    res.status(500).json({ err: 'Erro no servidor' });
  }
});

app.get('/profissional', async (req, res) => {

  try {

    const id = 2;

    const [rows] = await pool.query(`SELECT * FROM profissional WHERE id_Profissional=${id}`);

    if (rows.length > 0) {

      res.status(201).json(rows);
    } else {

      res.status(400).json('ERRO AO BUSCAR PROFI');
    }
  } catch (err) {
    console.error('Erro no servidor', err);
    res.status(500).json({ err: 'Erro no servidor' });
  }
})

app.listen(4242, () => console.log('Servidor rodando na porta 4242'));