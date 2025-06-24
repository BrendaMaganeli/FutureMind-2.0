const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const DOMINIO = '@futuremind.com.br';

        if (email.includes(DOMINIO)) {
            const [rows] = await pool.query('SELECT * FROM profissionais WHERE email_profissional=?', [email]);

            if (rows.length > 0) {
                if (rows[0].senha === senha) {
                    res.status(200).json(rows[0]);
                } else {
                    res.status(404).json('Senha incorreta');
                }
            } else {
                res.status(404).json('Profissional não encontrado');
            }
        } else {
            const [rows] = await pool.query(`SELECT * FROM pacientes WHERE email=?`, [email]);

            if (rows.length > 0) {
                if (rows[0].senha === senha) {
                    res.status(200).json(rows[0]);
                } else {
                    res.status(400).json('Senha incorreta');
                }
            } else {
                res.status(404).json('Paciente não encontrado');
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/', async(req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM profissionais');

        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao buscar profissionais:', err);
        res.status(500).json('erro servidor');
    }
});

module.exports = router;