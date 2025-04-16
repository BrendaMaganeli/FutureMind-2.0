const express =  require ('express');
const mysql = require ('mysql2/promise');
const app = express ();

app.use(express.static('public'));

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
})

app.listen(4242, () => console.log ('Servidor servindo'));