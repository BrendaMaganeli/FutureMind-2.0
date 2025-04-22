const express =  require ('express');
const mysql = require ('mysql2/promise');
const app = express ();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.static('public'));
app.use(express.json());

const pool = mysql.createPool({
   
    host:'localhost',
    user: 'root',
    password: 'root',
    database: 'futuremind',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/', async(req, res) => {

    try {
        
        const [rows] = await pool.query('SELECT * FROM profissional');

        if (rows.length > 0){

            res.status(201).json(rows);
        }else{

            res.status(400).json('erro');
        }
    } catch (err) {
        
        res.status(500).json('erro servidor');
    }
});

app.post('/cadastro-paciente', async(req, res) => {

    try {

        const Idade = '2007-12-28';
        const {
            Nome_completo,
            cpf,
            Email,
            Senha,
            Telefone
        } = req.body;

        const [rows] = await pool.query('INSERT INTO paciente (Nome_completo, data_nascimento, cpf, Email, Telefone, Senha) VALUES (?, ?, ?, ?, ?, ?)', [
            Nome_completo,
            Idade,
            cpf,
            Email,
            Telefone,
            Senha
        ]);

        if (rows.affectedRows > 0) {

            res.status(201).json(rows);
        } else {

            res.status(400).json('Erro');
        }
    } catch (error) {
        
        res.status(500).json('Servidor crashou');
        console.log(error);
    }
})

app.listen(4242, () => console.log ('Servidor servindo'));