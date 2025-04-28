const express =  require ('express');
const mysql = require ('mysql2/promise');
const app = express ();
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

app.use(express.static('public'));
app.use(express.json());

app.use(express.json())
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
        const [rows] = await pool.query('SELECT * FROM profissionais');

        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao buscar profissionais:', err);
        res.status(500).json('erro servidor');
    }
});

app.post('/cadastro-paciente', async(req, res) => {

    try {

        const {
            Nome_completo,
            cpf,
            Email,
            Senha,
            Telefone,
            Idade
        } = req.body;

        const [rows] = await pool.query('INSERT INTO pacientes (nome, data_nascimento, cpf, email, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)', [
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
});

app.post('/cadastro-profissional', async(req, res) => {

    try {

        const {
            nome,
            cpf,
            email,
            senha,
            telefone,
            crp,
            especializacao,
            abordagem,
            data_nascimento,
            email_profissional
        } = req.body;

        const foto = '../assets/icon-profile.svg';

        const [rows] = await pool.query('INSERT INTO profissionais (nome, cpf, email, senha, telefone, crp, especializacao, abordagem, foto, data_nascimento, email_profissional) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            nome,
            cpf,
            email,
            senha,
            telefone,
            crp,
            especializacao,
            abordagem,
            foto,
            data_nascimento,
            email_profissional
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
});

app.get('/login', async(req, res) => {

    try {
        
        const { email, senha } = req.body;

        if (email.includes('@futuremind.com.br')) {

            const [rows] = await pool.query(`SELECT * FROM profissionais WHERE email_profissional=${email}`);

            if (rows.ok) {

                if (rows.senha === senha) {

                    res.status(200).json(rows);
                } else {

                    res.status(400).json('Senha incorreta');
                }
            } else {

                res.status(404).json('Profissional não encontrado');
            }
        } else {

            const [rows] = await pool.query(`SELECT * FROM pacientes WHERE email=${email}`);

            if (rows.ok) {

                if (rows.senha === senha) {

                    res.status(200).json(rows);
                } else {

                    res.status(400).json('Senha incorreta');
                }
            } else {

                res.status(404).json('Paciente não encontrado');
            }
        }
    } catch (err) {
        
        res.status(500).json('Erro no servidor', err);
    }
});

app.post('/cadastro-paciente', async(req, res) => {

    try {
        const id = 1;
        const {
            
               Nome_completo, 
               cpf, 
               Email,
               Senha,
               Idade, 
               Telefone     
               } = req.body

               const [rows] = await pool.query('INSERT INTO paciente VALUES (?, ?, ?, ?, ?, ?, ?)' , [id, Nome_completo, Idade, cpf, Email, Telefone, Senha])
               
               if (rows.length > 0) {
                
                  res.status(201).json(rows)
               } else {
                 
                res.status(400).json(rows)
               }

            } catch (error) {
         
                 res.status(500).json('servi de bosta')
                 console.error(error)
        
    }
})

app.listen(4242, () => console.log ('Servidor servindo'));