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
   
    host: 'nozomi.proxy.rlwy.net',
    port: 33546,
    user: 'root',
    password: 'iiKsgqutnDNKXicApVVxBVGHYuYiiXzB',
    database: 'railway',
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

app.post('/login', async(req, res) => {

    try {
        
        console.log(req.body);
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

app.delete('/editar-profissional', async(req, res) => {

    try {
        
        const { id_profissional } = req.body;
        const [rows] = await pool.query("DELETE FROM profissionais WHERE id_profissional=?", [id_profissional]);

        if (rows.affectedRows > 0) {

            res.status(201).json('Registro de profissional deletado!');
        } else {

            res.status(404).json('Profissional não encontrado!');
        }
    } catch (err) {
        
        res.status(500).json('Erro no servidor, erro:', err);
    }
});

app.get('/profissional/:id', async(req, res) => {

    try {
        
        const { id } = req.params;
        
        const [rows] = await pool.query('SELECT * FROM profissionais WHERE id_profissional=?', [id]);

        if (rows.length > 0) {

            res.status(200).json(rows[0]);
        } else {

            res.status(404).json('Profissional não encontrado!');
        }
    } catch (err) {

        res.status(500).json({Erro: 'Erro no servidor, erro: ', err});
    };
});
  

app.put('/paciente', async (req, res) => {
    try {
      const {
        nome,
        cpf,
        email,
        telefone,
        data_nascimento,
        senha,
        id_paciente
      } = req.body;
  
      const [result] = await pool.query(
        `UPDATE pacientes SET nome=?, cpf=?, email=?, telefone=?, data_nascimento=?, senha=? WHERE id_paciente=?`,
        [nome, cpf, email, telefone, data_nascimento, senha, id_paciente]
      );
  
      if (result.affectedRows > 0) {
        const [pacienteAtualizado] = await pool.query(
            'SELECT * FROM pacientes WHERE id_paciente = ?',
            [id_paciente]
          );
          
          res.status(200).json(pacienteAtualizado[0]); 
      } else {
        res.status(404).json('Paciente não encontrado!');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Erro ao atualizar o paciente');
    }
  });


app.post('/chats', async(req, res) => {

    try {

        const { userType, fk_id } = req.body;

        if (!userType || !fk_id) {

            return res.status(404).json({ Erro: 'Parametros inválidos' });
        };

        if (userType === 'Profissional') {

            const [response] = await pool.query('SELECT p.* FROM pacientes p INNER JOIN chat_paciente_profissional c ON p.id_paciente = c.fk_pacientes_id_paciente WHERE c.fk_profissionais_id_profissional = ? ORDER BY c.datahora DESC',[
                fk_id
            ]);

            if (response.length > 0) {

                return res.status(200).json(response);
            }
        } else if (userType === 'Paciente') {

            const [response] = await pool.query('SELECT prof.* FROM profissionais prof JOIN chat_paciente_profissional c ON prof.id_profissional = c.fk_profissionais_id_profissional WHERE c.fk_pacientes_id_paciente = ? ORDER BY c.datahora DESC',[
                fk_id
            ]);

            if (response.length > 0) {

                return res.status(200).json(response);
            }
        } else {

            return res.status(404).json({ Error: 'Usuário não identificado para buscar suas conversas' });
        };


    } catch (error) {
        
        res.status(500).json({ Error: 'Erro interno do servidor' });
    };
});

app.post('/chats/chat', async(req, res) => {

    try {
        
        const { id_paciente, id_profissional } = req.body;

        if (!id_paciente || !id_profissional) return res.status(404).json('Valores inválidos');

        const [response] = await pool.query('SELECT mensagem FROM chat_paciente_profissional WHERE fk_pacientes_id_paciente=? AND fk_profissionais_id_profissional=?', [

            id_paciente,
            id_profissional
        ]);

        if (response.length > 0) {

            return res.status(200).json(response);
        }

        return res.status(404).json('Erro ao buscar mensagens');
    } catch (error) {
        
        return res.status(500).json({ Error: 'Erro interno do servidor' });
    }
});

app.post('/chats/chat/send-message', async (req, res) => {

    const { mensagem, id_paciente, id_profissional, datahora } = req.body;
  
    try {
      const [response] = await pool.query(
        'INSERT INTO mensagens (mensagem, fk_pacientes_id_paciente, fk_profissionais_id_profissional, datahora) VALUES (?, ?, ?, ?)',
        [mensagem, id_paciente, id_profissional, datahora]
      );
  
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      res.status(500).json({ Error: 'Erro interno do servidor' });
    }
  });
  
app.listen(4242, () => console.log ('Servidor servindo'));