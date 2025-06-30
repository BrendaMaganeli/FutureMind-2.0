const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
  
router.post('/chats', async(req, res) => {
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

router.delete('/chats', async(req, res) => {

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

router.delete('/chats/mensagens', async(req, res) => {

    try {
        
        const { id_profissional, id_paciente, mensagem } = req.body;

        const [response] = await pool.query('DELETE FROM chat_paciente_profissional WHERE fk_pacientes_id_paciente = ? AND fk_profissionais_id_profissional = ? AND mensagem = ?', [
            id_paciente,
            id_profissional,
            mensagem
        ]);

        if (response.affectedRows > 0) {

            return res.status(200).json('Mensagem deletada com sucesso!');
        }

        return res.status(404).json('Erro ao deletar mensagem!');
    } catch (error) {
      
        return res.status(500).json('Erro interno do servidor');
    };
});

router.post('/chats/chat', async(req, res) => {

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

router.post('/chats/chat/send-message', async (req, res) => {

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

module.exports = router;