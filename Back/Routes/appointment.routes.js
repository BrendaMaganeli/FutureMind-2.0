const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');


router.get('/agendamento/:id/:year/:month', async (req, res) => {
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
  
  router.post('/agendamento/:id', async (req, res) => {
    const { id_paciente, data, hora } = req.body;
    const { id } = req.params;
  
    if (!id_paciente || !data || !hora) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }
  
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data)) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
    }
  
    // Alteração para aceitar HH:MM REGEX garante horas de 00:00 até 23:59
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; 
    if (!timeRegex.test(hora)) {
      return res.status(400).json({ error: 'Formato de horário inválido. Use HH:MM.' }); 
    }
  
    try {
      const [result] = await pool.query(
        `INSERT INTO Agendamento (id_profissional, id_paciente, data, hora)
          VALUES (?, ?, ?, ?)`,
        [id, id_paciente, data, hora]
      );
  
      if (result.affectedRows) {
        return res.status(201).json({ id_agendamento: result.insertId });
      } else {
        return res.status(400).json({ error: 'Não foi possível agendar' });
      }
    } catch (err) {
      console.error('Erro no POST /agendamento:', err);
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'Profissional ou paciente não encontrado.' });
      }
      return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  });


router.get('/consulta/profissional/:id_profissional/:year/:month' , async (req,res) => {
    const {id_profissional , year ,month} = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT
            a.id_agendamento   AS id_consultas,
            a.data,
            a.hora,
            p.id_paciente,
            p.nome             AS nome_paciente,
            p.foto             AS foto_paciente
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

router.delete('/consulta/:id_consulta', async (req, res) => {
  const { id_consulta } = req.params;

  try {
    // Primeiro verifica se a consulta existe e sua data
    const [consulta] = await pool.query(
      `SELECT data FROM Agendamento 
       WHERE id_agendamento = ?`,
      [id_consulta]
    );
    
    if (consulta.length === 0) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }
    
    const dataConsulta = new Date(consulta[0].data);
    const hoje = new Date();
    
    if (dataConsulta < hoje) {
      return res.status(400).json({ 
        error: 'Não é possível cancelar consultas passadas' 
      });
    }
    
    const [result] = await pool.query(
      `DELETE FROM Agendamento
       WHERE id_agendamento = ?`,
      [id_consulta]
    );

    return res.status(200).json({ message: 'Consulta removida com sucesso' });
  } catch (err) {
    console.error('Erro no DELETE /consulta/:id_consulta', err);
    return res.status(500).json({ error: 'Erro ao remover consulta' });
  }
});
  

router.get('/consulta/:id_paciente' , async (req, res) =>{
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

router.put('/consulta/:id_consulta', async (req, res) => {
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


module.exports = router;