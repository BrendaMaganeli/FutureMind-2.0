const request = require('supertest');
const app = require('../../../App');
const pool = require('../../../config/db.config');

describe('Agendamento Controller', () => {
  let testAgendamentoId;
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + 7); // 7 dias no futuro
  const pastDate = new Date();
  pastDate.setDate(currentDate.getDate() - 7); // 7 dias no passado

  // Limpar dados de teste após todos os testes
  afterAll(async () => {
    await pool.query('DELETE FROM Agendamento WHERE id_agendamento = ?', [testAgendamentoId]);
    await pool.end();
  });

  // Caso 1: Salvar agendamento com dados válidos
  describe('POST /agendamento/:id', () => {
    it('deve criar um novo agendamento com dados válidos', async () => {
      const profissionalId = 1; // ID de um profissional existente no banco de testes
      const pacienteId = 1; // ID de um paciente existente no banco de testes
      
      const response = await request(app)
        .post(`/agendamento/${profissionalId}`)
        .send({
          id_paciente: pacienteId,
          data: futureDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
          hora: '14:00:00'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id_agendamento');
      testAgendamentoId = response.body.id_agendamento; // Salva para usar nos próximos testes
    });

    it('não deve criar agendamento com dados inválidos', async () => {
      const profissionalId = 1;
      
      const response = await request(app)
        .post(`/agendamento/${profissionalId}`)
        .send({
          id_paciente: null, // Dado inválido
          data: 'data-invalida',
          hora: 'hora-invalida'
        });

      expect(response.status).toBe(400);
    });
  });

  // Caso 2: Cancelamento de agendamento
  describe('DELETE /consulta/:id_consulta', () => {
    it('deve cancelar um agendamento futuro', async () => {
      // Primeiro cria um agendamento futuro para testar o cancelamento
      const createResponse = await request(app)
        .post('/agendamento/1')
        .send({
          id_paciente: 1,
          data: futureDate.toISOString().split('T')[0],
          hora: '15:00:00'
        });
      
      const agendamentoId = createResponse.body.id_agendamento;

      const deleteResponse = await request(app)
        .delete(`/consulta/${agendamentoId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message', 'Consulta removida com sucesso');
    });

    it('não deve permitir cancelar um agendamento passado', async () => {
      // Primeiro cria um agendamento no passado (pode precisar de mock do banco)
      const [result] = await pool.query(
        `INSERT INTO Agendamento 
         (id_profissional, id_paciente, data, hora) 
         VALUES (?, ?, ?, ?)`,
        [1, 1, pastDate.toISOString().split('T')[0], '10:00:00']
      );
      
      const agendamentoPassadoId = result.insertId;

      const response = await request(app)
        .delete(`/consulta/${agendamentoPassadoId}`);

      // Espera-se que o servidor retorne 400 ou 403 para agendamentos passados
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');

      // Limpa o registro de teste
      await pool.query('DELETE FROM Agendamento WHERE id_agendamento = ?', [agendamentoPassadoId]);
    });

    it('deve retornar erro ao tentar cancelar agendamento inexistente', async () => {
      const response = await request(app)
        .delete('/consulta/999999'); // ID que não existe

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Consulta não encontrada');
    });
  });
});