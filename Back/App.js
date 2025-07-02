const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rotas
const authRoutes = require('./Routes/auth.routes');
const userRoutes = require('./Routes/user.routes');
const chatRoutes = require('./Routes/chat.routes');
const appointmentRoutes = require('./Routes/appointment.routes');
const subscriptionRoutes = require('./Routes/subscription.routes');

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rotas
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', chatRoutes);
app.use('/', appointmentRoutes);
app.use('/', subscriptionRoutes);

// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

module.exports = app;