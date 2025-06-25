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

    it('deve retornar 400 se data estiver no formato errado', async () => {
        const response = await request(app)
          .post('/agendamento/1')
          .send({
            id_paciente: 1,
            data: '31/12/2023', // Formato inválido
            hora: '14:00:00'
          });
        expect(response.status).toBe(400);
      });
    
      it('deve retornar 400 se hora estiver no formato errado', async () => {
        const response = await request(app)
          .post('/agendamento/1')
          .send({
            id_paciente: 1,
            data: '2023-12-31',
            hora: '14h00' // Formato inválido
          });
        expect(response.status).toBe(400);
      });
  });

  // Caso 2: Cancelamento de agendamento
  describe('DELETE /consulta/:id_consulta', () => {
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