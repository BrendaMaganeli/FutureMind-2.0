const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const upload = require('../config/multer.config');
const path = require('path');

router.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

router.post('/profissional/foto-perfil', upload.single('foto'), async (req, res) => {
  const { id_profissional } = req.body;
  
  if (!id_profissional || !req.file) {
    return res.status(400).json({ Erro: 'ID do profissional ou foto ausente.' });
  }

  try {
    const fotoPath = `/uploads/${req.file.filename}`;
    
    const [result] = await pool.query(
      'UPDATE profissionais SET foto = ? WHERE id_profissional = ?',
      [fotoPath, id_profissional]
    );

    if (result.affectedRows === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ Erro: 'Profissional não encontrado.' });
    }

    res.json({
      success: true,
      foto: fotoPath,
      message: 'Foto atualizada com sucesso'
    });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error(err.message);
    return res.status(500).json({ Erro: 'Erro ao atualizar foto.' });
  }
});
  
  router.post('/paciente/foto-perfil', upload.single('foto'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
      }
  
      const { id_paciente } = req.body;
      if (!id_paciente) {
        return res.status(400).json({ error: 'ID do paciente é obrigatório' });
      }
  
      const fotoPath = `/uploads/${req.file.filename}`;
      
      const [result] = await pool.query(
        'UPDATE pacientes SET foto = ? WHERE id_paciente = ?',
        [fotoPath, id_paciente]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
      }
  
      res.json({ 
        success: true,
        foto: fotoPath,
        message: 'Foto atualizada com sucesso'
      });
  
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro ao processar a imagem' });
    }
  });
  
  

router.post('/verificar_paciente', async (req, res) => {
    const { valorEmail, cpf, telefone } = req.body;
  
    try {
      const [emailQuery] = await pool.query('SELECT 1 FROM pacientes WHERE email = ?', [valorEmail]);
      const [cpfQuery] = await pool.query('SELECT 1 FROM pacientes WHERE cpf = ?', [cpf]);
      const [telefoneQuery] = await pool.query('SELECT 1 FROM pacientes WHERE telefone = ?', [telefone]);
  
      return res.status(200).json({
        emailExiste: emailQuery.length > 0,
        cpfExiste: cpfQuery.length > 0,
        telefoneExiste: telefoneQuery.length > 0
      });
    } catch (error) {
      console.error('Erro ao verificar paciente:', error);
      res.status(500).json({ Error: 'Erro interno do servidor' });
    }
  });
  
  router.post('/verificar_profissional_um', async (req, res) => {
  
    const {valorCRP, telefone, cpf} = req.body;
  
    try {
      const [crpQuery] = await pool.query('SELECT 1 FROM profissionais WHERE crp = ?', [valorCRP]);
      const [cpfQuery] = await pool.query('SELECT 1 FROM profissionais WHERE cpf = ?', [cpf]);
      const [telefoneQuery] = await pool.query('SELECT 1 FROM profissionais WHERE telefone = ?', [telefone]);
      
      return res.status(200).json({
        crpExisteProf: crpQuery.length > 0,
        cpfExisteProf: cpfQuery.length > 0,
        telefoneExisteProf: telefoneQuery.length > 0
      });
  
    } catch (error) {
      console.error('Erro ao verificar profissional:', error);
      res.status(500).json({ Error: 'Erro interno do servidor' });
    }
  });
  
  router.post('/verificar_profissional_dois', async (req, res) => {
  
     const {valorEmail, email_profissional} = req.body
     
     try {
     
      const [emailQuery] = await pool.query('SELECT 1 FROM profissionais WHERE email = ?', [valorEmail]);
      const [usuarioQuery] = await pool.query('SELECT 1 FROM profissionais WHERE email_profissional = ?', [email_profissional]);
      
      return res.status(200).json({
        emailExisteProf: emailQuery.length > 0,
        usuarioExisteProf: usuarioQuery.length > 0
      });
  
    } catch (error) {
      console.error('Erro ao verificar profissional:', error);
      res.status(500).json({ Error: 'Erro interno do servidor' });
    }
  });

  router.get("/profissional/:id", async (req, res) => {
    try {
      const { id } = req.params; 
  
      const [rows] = await pool.query(
        `
        SELECT
          p.nome,
          p.crp,
          p.valor_consulta,
          p.foto
        FROM profissionais AS p
        WHERE p.id_profissional = ?
        `,
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ erro: "Profissional não encontrado." });
      }
  
      const profissional = rows[0];
      return res.status(200).json({
        nome: profissional.nome,
        crp: profissional.crp,
        valor_consulta: profissional.valor_consulta,
        foto: profissional.foto
      });
    } catch (err) {
      console.error("Erro no servidor (/profissional/:id):", err);
      return res.status(500).json({ erro: "Erro interno do servidor." });
    }
  });

  router.delete('/editar-profissional', async (req, res) => {
    try {
      const { id_profissional } = req.body;
      
      if (!id_profissional) {
        return res.status(400).json({ error: 'ID do profissional é obrigatório' });
      }
  
      // Verifica se o profissional existe antes de deletar
      const [professional] = await pool.query(
        'SELECT 1 FROM profissionais WHERE id_profissional = ?',
        [id_profissional]
      );
  
      if (professional.length === 0) {
        return res.status(404).json({ error: 'Profissional não encontrado' });
      }
  
      // Primeiro deleta os agendamentos relacionados
      await pool.query(
        'DELETE FROM Agendamento WHERE id_profissional = ?',
        [id_profissional]
      );
  
      // Depois deleta o profissional
      const [result] = await pool.query(
        'DELETE FROM profissionais WHERE id_profissional = ?',
        [id_profissional]
      );
  
      res.status(200).json({ message: 'Profissional e agendamentos relacionados deletados com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar profissional' });
    }
  });

router.get('/profissional/:id', async(req, res) => {

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
  

router.put('/paciente', async (req, res) => {
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


  // No seu router (profile.routes.js ou similar)
router.delete('/paciente', async (req, res) => {
  try {
    const { id_paciente } = req.body;
    const [rows] = await pool.query("DELETE FROM pacientes WHERE id_paciente = ?", [id_paciente]);

    if (rows.affectedRows > 0) {
      res.status(200).json({ message: 'Paciente deletado com sucesso!' });
    } else {
      res.status(404).json({ error: 'Paciente não encontrado!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar paciente' });
  }
});


router.put('/editarprofissional', async (req, res) => {
  try {
    const { id_profissional, ...updateData } = req.body;
    
    if (!id_profissional) {
      return res.status(400).json({ error: 'ID do profissional é obrigatório' });
    }

    const [result] = await pool.query(
      'UPDATE profissionais SET ? WHERE id_profissional = ?',
      [updateData, id_profissional]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    const [updatedProfessional] = await pool.query(
      'SELECT * FROM profissionais WHERE id_profissional = ?',
      [id_profissional]
    );
    
    res.status(200).json(updatedProfessional[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar o profissional' });
  }
});

router.post('/cadastro-paciente', async (req, res) => {
  try {
      const {
          Nome_completo,
          cpf,
          Email,
          Senha,
          Telefone,
          Idade
      } = req.body;

      const foto = 'icone_usuario.svg';

      const [verificaEmail] = await pool.query('SELECT * FROM pacientes WHERE email = ?', [Email]);
      if (verificaEmail.length > 0) {
          return res.status(409).json({ error: 'E-mail já cadastrado' });
      }

      const [rows] = await pool.query('INSERT INTO pacientes (nome, data_nascimento, cpf, email, telefone, senha, foto) VALUES (?, ?, ?, ?, ?, ?, ?)', [
          Nome_completo,
          Idade,
          cpf,
          Email,
          Telefone,
          Senha,
          foto
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

router.post('/cadastro-profissional', async(req, res) => {

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
            email_profissional,
            valor_consulta
        } = req.body;

        const foto = 'icone_usuario.svg';

        const [check] = await pool.query('SELECT * FROM profissionais WHERE email = ?', [email]);
          if (check.length > 0) {
            return res.status(409).json({ erro: 'E-mail já está em uso' });
        }


        const [rows] = await pool.query('INSERT INTO profissionais (nome, cpf, email, senha, telefone, crp, especializacao, abordagem, foto, data_nascimento, email_profissional, valor_consulta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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
            email_profissional,
            valor_consulta
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

module.exports = router;