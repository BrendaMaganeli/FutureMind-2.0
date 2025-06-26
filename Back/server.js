const app = require('./App');
const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;