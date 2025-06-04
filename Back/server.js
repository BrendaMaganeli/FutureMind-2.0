const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.static("public"));
app.use(express.json());

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

        const foto = 'icon_user.svg';

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

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Caminho absoluto da pasta uploads
const uploadDirectory = path.join(__dirname, 'uploads');

// Criação da pasta caso ela não exista
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configuração do multer para salvar imagens no diretório correto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Caminho absoluto para a pasta uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Gera um nome único para o arquivo
  },
});

const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para atualizar a foto do profissional
app.post('/profissional/foto-perfil', upload.single('foto'), async (req, res) => {
  const { id_profissional } = req.body;
  const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!id_profissional || !fotoPath) {
    return res.status(400).json({ Erro: 'ID do profissional ou foto ausente.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE profissionais SET foto = ? WHERE id_profissional = ?',
      [fotoPath, id_profissional]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ Erro: 'Profissional não encontrado.' });
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ Erro: 'Erro ao atualizar profissional.' });
  }
});

app.post('/paciente/foto-perfil', upload.single('foto'), async (req, res) => {
  const { id_paciente } = req.body;
  const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!id_paciente || !fotoPath) {
    return res.status(400).json({ Erro: 'ID do paciente ou foto ausente.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE pacientes SET foto = ? WHERE id_paciente = ?',
      [fotoPath, id_paciente]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ Erro: 'Paciente não encontrado.' });
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ Erro: 'Erro ao atualizar paciente.' });
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

app.put('/editarprofissional', async (req, res) => {
    
    try {
      const {
        nome,
        cpf,
        email,
        telefone,
        data_nascimento,
        senha,
        crp,
        abordagem,
        foto,
        valor_consulta,
        especializacao,
        email_profissional,
        sobre_mim,
        id_profissional
      } = req.body;
  
      const [result] = await pool.query(
        `UPDATE profissionais SET nome=?, cpf=?, email=?, telefone=?, data_nascimento=?, senha=?, crp=? , abordagem=?,foto=?, valor_consulta=?, especializacao=?, email_profissional=?, sobre_mim=? WHERE id_profissional=?`,
        [nome, cpf, email, telefone, data_nascimento, senha, crp, abordagem, foto, valor_consulta, especializacao, email_profissional, sobre_mim, id_profissional]
      );
  
      if (result.affectedRows > 0) {
        const [profissionalAtualizado] = await pool.query(
            'SELECT * FROM profissionais WHERE id_profissional = ?',
            [id_profissional]
          );
          
          res.status(200).json(profissionalAtualizado[0]); 
      } else {
        res.status(404).json('Profissional não encontrado!');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Erro ao atualizar o profissional');
    }
  });
  
  app.post('/chats', async(req, res) => {
    try {
        const { userType, fk_id } = req.body;

        if (!userType || !fk_id) {
            return res.status(400).json({ Erro: 'Parâmetros inválidos' });
        };

        let query, params;
        
        if (userType === 'Profissional') {
            query = `
                SELECT DISTINCT p.*, MAX(c.datahora) as ultima_mensagem
                FROM pacientes p
                INNER JOIN chat_paciente_profissional c ON p.id_paciente = c.fk_pacientes_id_paciente
                WHERE c.fk_profissionais_id_profissional = ?
                GROUP BY p.id_paciente
                ORDER BY ultima_mensagem DESC
            `;
            params = [fk_id];
        } else if (userType === 'Paciente') {
            query = `
                SELECT DISTINCT prof.*, MAX(c.datahora) as ultima_mensagem
                FROM profissionais prof
                JOIN chat_paciente_profissional c ON prof.id_profissional = c.fk_profissionais_id_profissional
                WHERE c.fk_pacientes_id_paciente = ?
                GROUP BY prof.id_profissional
                ORDER BY ultima_mensagem DESC
            `;
            params = [fk_id];
        } else {
            return res.status(400).json({ Error: 'Tipo de usuário inválido' });
        }

        const [response] = await pool.query(query, params);
        
        // Filtro adicional de segurança no backend
        const uniqueChats = response.reduce((acc, current) => {
            const key = current.id_profissional || current.id_paciente;
            if (!acc.some(chat => (chat.id_profissional || chat.id_paciente) === key)) {
                acc.push(current);
            }
            return acc;
        }, []);

        return res.status(200).json(uniqueChats);

    } catch (error) {
        console.error('Erro no endpoint /chats:', error);
        res.status(500).json({ Error: 'Erro interno do servidor' });
    }
});

app.delete('/chats', async(req, res) => {

    try {
        
        const { id_profissional, id_paciente } = req.body;

        if (!id_profissional || !id_paciente) return res.status(404).json('Erro ao deletar chat!');

        const [response] = await pool.query('DELETE FROM chat_paciente_profissional WHERE fk_pacientes_id_paciente=? AND fk_profissionais_id_profissional=?', [
            id_paciente,
            id_profissional
        ]);

        if (response.affectedRows > 0) {

            return res.status(200).json('Chat deletado com sucesso!');
        }

        return res.status(404).json('Erro ao deletar chat!');
    } catch (error) {
      
        return res.status(500).json('Erro interno do servidor');
    };
});

app.delete('/chats/mensagens', async(req, res) => {

    try {
        
        const { id_profissional, id_paciente, datahora } = req.body;

        if (!id_profissional || !id_paciente || !datahora) return res.status(404).json('Erro ao deletar mensagem!');

        const [response] = await pool.query('DELETE FROM chat_paciente_profissional WHERE fk_pacientes_id_paciente=? AND fk_profissionais_id_profissional=? AND datahora=?', [
            id_paciente,
            id_profissional,
            datahora
        ]);

        if (response.affectedRows > 0) {

            return res.status(200).json('Mensagem deletada com sucesso!');
        }

        return res.status(404).json('Erro ao deletar mensagem!');
    } catch (error) {
      
        return res.status(500).json('Erro interno do servidor');
    };
});

app.post('/chats/chat', async(req, res) => {

    try {
        
        const { id_paciente, id_profissional } = req.body;

        if (!id_paciente || !id_profissional) return res.status(404).json('Valores inválidos');

        const [response] = await pool.query('SELECT mensagem, mensageiro FROM chat_paciente_profissional WHERE fk_pacientes_id_paciente=? AND fk_profissionais_id_profissional=? ORDER BY datahora', [

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

    const { mensagem, id_paciente, id_profissional, datahora, mensageiro } = req.body;
  
    try {
      const [response] = await pool.query(
        'INSERT INTO chat_paciente_profissional (mensagem, fk_pacientes_id_paciente, fk_profissionais_id_profissional, datahora, mensageiro) VALUES (?, ?, ?, ?, ?)',
        [mensagem, id_paciente, id_profissional, datahora, mensageiro]
      );
  
      if (response.affectedRows > 0) {

        res.status(201).json(response[0]);
      }
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      res.status(500).json({ Error: 'Erro interno do servidor' });
    }
});

app.post('/assinatura', async (req, res) => {

  const {data_assinatura, fk_id_paciente, tipo_assinatura, data_fim_assinatura} = req.body;

  
  try {
      
      let consultas_disponiveis;
      
      if (tipo_assinatura === 'prata') {
          
          consultas_disponiveis = 4;
        } else if (tipo_assinatura === 'ouro') {
            
            consultas_disponiveis = 12;
        } else {
            
            consultas_disponiveis = null;
        }
        
        if(!data_assinatura || !fk_id_paciente || !tipo_assinatura || !consultas_disponiveis || !data_fim_assinatura) return res.status(404).json({ Error: 'erro dados'})

      const [response] = await pool.query(
        'INSERT INTO assinaturas (data_assinatura, fk_id_paciente, tipo_assinatura, consultas_disponiveis, data_fim_assinatura) VALUES (?, ?, ?, ?, ?)',
        [data_assinatura, fk_id_paciente, tipo_assinatura, consultas_disponiveis, data_fim_assinatura]
      );

      if(response.affectedRows > 0){

        return res.status(201).json({ success: true});
      }

      return res.status(404).json({ Error: 'erro ao inserir dados'})
    } catch (error) {
        
      console.error('Erro ao salvar mensagem:', error);
      res.status(500).json({ Error: 'Erro interno do servidor' });
    }
});

app.get('/pagamento/:id', async(req, res) => {

    try {
        
      const { id } = req.params; // "id" aqui é o id_paciente que você quer consultar
          const [rows] = await pool.query(
             'SELECT consultas_disponiveis FROM assinaturas WHERE fk_id_paciente = ?',
             [ id ]
            );
    

        if (rows.length > 0) {

            res.status(200).json(rows[0]);
        } else {

            res.status(404).json('Profissional não encontrado!');
        }
    } catch (err) {

        res.status(500).json({Erro: 'Erro no servidor, erro: ', err});
    };
});

app.post('/planos', async (req, res) => {
  try {
    const { id } = req.body; // <-- CORRETO para POST

    const [rows] = await pool.query('SELECT data_fim_assinatura FROM assinaturas WHERE fk_id_paciente = ?', [id]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]); // retorna { data_fim_assinaturas: '...' }
    } else {
      res.status(404).json({ erro: 'Assinatura não encontrada!' });
    }
  } catch (err) {
    res.status(500).json({ erro: 'Erro no servidor', detalhes: err.message });
  }
});

app.post('/plano_empressarial', async (req, res) => {

    const {tipo_assinatura,fk_id_paciente, data_assinatura} = req.body;

    try {
     
        const [response] = await pool.query(
            'INSERT INTO assinaturas (tipo_assinatura, fk_id_paciente, data_assinatura) VALUES (?, ?, ?)',
            [ tipo_assinatura, fk_id_paciente, data_assinatura]
          );
    
          if(response.affectedRows > 0){
    
            return res.status(201).json({ success: true});
          }
    
          return res.status(404).json({ Error: 'erro ao inserir dados'})
        
    } catch (error) {
        
        console.error('Erro ao salvar mensagem:', error);
        res.status(500).json({ Error: 'Erro interno do servidor' });
    }
});



app.get('/agendamento/:id/:year/:month', async (req, res) => {
    const { id: id_profissional, year, month } = req.params;
    try {
      const [rows] = await pool.query(
        `SELECT id_agendamento, id_paciente, data, hora
         FROM Agendamento
         WHERE id_profissional = ?
           AND YEAR(data) = ?
           AND MONTH(data) = ?`,
        [id_profissional, year, month]
      );
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  });
  
  app.post('/agendamento/:id', async (req, res) => {
    console.log( req.body);
  
    const { id_paciente, data, hora } = req.body;
    const { id } = req.params;

    try {
      const [result] = await pool.query(
        `INSERT INTO Agendamento (id_profissional, id_paciente, data, hora)
         VALUES (?, ?, ?, ?)`,
        [id, id_paciente, data, hora]
      );
      console.log('→ Result do INSERT:', result);
  
      if (result.affectedRows) {
        return res.status(201).json({ id_agendamento: result.insertId });
      } else {
        console.warn('→ Nenhuma linha afetada no INSERT');
        return res.status(400).json({ error: 'Não foi possível agendar' });
      }
    } catch (err) {
      console.error('→ Erro no POST /agendamento:', err);
      return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }

  });



app.get('/consulta/profissional/:id_profissional/:year/:month' , async (req,res) => {
    const {id_profissional , year ,month} = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT
            a.id_agendamento   AS id_consultas,
            a.data,
            a.hora,
            p.id_paciente,
            p.nome            AS nome_paciente,
            p.foto            AS foto_paciente
          FROM Agendamento a
          INNER JOIN pacientes p
            ON a.id_paciente = p.id_paciente
          WHERE a.id_profissional = ?
            AND YEAR(a.data) = ?
            AND MONTH(a.data) = ?
          ORDER BY a.data, a.hora;`,
         [id_profissional, year, month]
        );

        return res.status(200).json(rows)
    } catch (err) {
        console.error('Erro no GET /consulta/profissional/:id_profissional:', err);
        return res.status(500).json({ error: 'Erro ao buscar consultas do profissional' });
    }
});

app.delete('/consulta/:id_consulta', async (req, res) => {
    const { id_consulta } = req.params;
  
    try {
      const [result] = await pool.query(
        `DELETE FROM Agendamento
         WHERE id_agendamento = ?`,
        [id_consulta]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Consulta não encontrada' });
      }
      return res.status(200).json({ message: 'Consulta removida com sucesso' });
    } catch (err) {
      console.error('Erro no DELETE /consulta/:id_consulta', err);
      return res.status(500).json({ error: 'Erro ao remover consulta' });
    }
  });
  

app.get('/consulta/:id_paciente' , async (req, res) =>{
    const {id_paciente} = req.params;

    try {
        const [rows] = await pool.query(
          `SELECT
             a.id_agendamento     AS id_consultas,
             a.data,
             a.hora,
             pr.id_profissional,
             pr.nome              AS nome_profissional,
             pr.foto              AS foto_profissional
           FROM Agendamento a
           INNER JOIN profissionais pr
             ON a.id_profissional = pr.id_profissional
           WHERE a.id_paciente = ?
           ORDER BY a.data, a.hora;`,
          [id_paciente]
        );
    
        return res.status(200).json(rows);
      } catch (err) {
        console.error('Erro no GET /consulta/paciente/:id_paciente', err);
        return res.status(500).json({ error: 'Erro ao buscar consultas do paciente' });
      }
});

app.put('/consulta/:id_consulta', async (req, res) => {
    const { id_consulta } = req.params;
    const { data, hora } = req.body;
  
    try {
      const [result] = await pool.query(
        `UPDATE Agendamento
         SET data = ?, hora = ?
         WHERE id_agendamento = ?`,
        [data, hora, id_consulta]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Consulta não encontrada' });
      }
      return res.status(200).json({ message: 'Consulta atualizada com sucesso' });
    } catch (err) {
      console.error('Erro no PUT /consulta/:id_consulta', err);
      return res.status(500).json({ error: 'Erro ao atualizar consulta' });
    }
  });
  
  

app.put('/pagamento', async (req, res) => {


    const {id_paciente, chk_plano} = req.body;

   try {
    
    const [response] = await pool.query(
        `UPDATE pacientes SET chk_plano=? WHERE id_paciente=?`,
        [chk_plano, id_paciente]
    );

    if(response.affectedRows > 0){

        return res.status(201).json({ success: true});
    }
    return res.status(404).json({ Error: 'erro ao inserir dados'})

   } catch (error) {
     
    console.error('Erro ao salvar mensagem:', error);
    res.status(500).json({ Error: 'Erro interno do servidor' });
   }
   
})

app.put('/validacao_planos', async (req, res) => {

  const {id_paciente, chk_plano} = req.body;
  
  try {
    
    const [response] = await pool.query(
        `UPDATE pacientes SET chk_plano=? WHERE id_paciente=?`,
        [chk_plano, id_paciente]
    );

    if(response.affectedRows > 0){

        return res.status(201).json({ success: true});
    }
    return res.status(404).json({ Error: 'erro ao inserir dados'})

   } catch (error) {
     
    console.error('Erro ao salvar mensagem:', error);
    res.status(500).json({ Error: 'Erro interno do servidor' });
   }
})

app.listen(4242, () => console.log ('Servidor servindo'));