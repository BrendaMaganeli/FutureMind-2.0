const request = require('supertest');
const app = require('../../../App');
const pool = require('../../../config/db.config');

describe('Chat Controller', () => {
  // Dados de teste
  const testProfissional = { id_profissional: 1 };
  const testPaciente = { id_paciente: 1 };
  const testMessage = {
    id_paciente: 1,
    id_profissional: 1,
    mensagem: "Mensagem de teste",
    datahora: new Date().toISOString(),
    mensageiro: "paciente"
  };

  // Limpar dados de teste após todos os testes
  afterAll(async () => {
    await pool.query('DELETE FROM chat_paciente_profissional WHERE fk_pacientes_id_paciente = ? AND fk_profissionais_id_profissional = ?', 
      [testPaciente.id_paciente, testProfissional.id_profissional]);
    await pool.end();
  });

  describe('POST /chats - Listar conversas', () => {
    it('deve retornar conversas para um profissional', async () => {
      const response = await request(app)
        .post('/chats')
        .send({ userType: 'Profissional', fk_id: testProfissional.id_profissional });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve retornar conversas para um paciente', async () => {
      const response = await request(app)
        .post('/chats')
        .send({ userType: 'Paciente', fk_id: testPaciente.id_paciente });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve retornar erro para tipo de usuário inválido', async () => {
      const response = await request(app)
        .post('/chats')
        .send({ userType: 'Invalido', fk_id: 1 });
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /chats/chat - Obter mensagens de um chat', () => {
    it('deve retornar mensagens de um chat existente', async () => {
      // Primeiro cria uma mensagem de teste
      await request(app)
        .post('/chats/chat/send-message')
        .send(testMessage);

      const response = await request(app)
        .post('/chats/chat')
        .send({ id_paciente: testPaciente.id_paciente, id_profissional: testProfissional.id_profissional });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('deve retornar erro para chat não encontrado', async () => {
      const response = await request(app)
        .post('/chats/chat')
        .send({ id_paciente: 999, id_profissional: 999 });
      
      expect(response.status).toBe(404);
    });
  });

  describe('POST /chats/chat/send-message - Enviar mensagem', () => {
    it('deve enviar uma mensagem com sucesso', async () => {
      const response = await request(app)
        .post('/chats/chat/send-message')
        .send(testMessage);
      
      expect(response.status).toBe(201);
    });

    it('deve retornar erro para dados incompletos', async () => {
      const response = await request(app)
        .post('/chats/chat/send-message')
        .send({ ...testMessage, mensagem: null });
      
      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /chats - Excluir chat completo', () => {
    it('deve excluir um chat com sucesso', async () => {
      // Primeiro cria uma mensagem para ter um chat
      await request(app)
        .post('/chats/chat/send-message')
        .send(testMessage);

      const response = await request(app)
        .delete('/chats')
        .send({ id_paciente: testPaciente.id_paciente, id_profissional: testProfissional.id_profissional });
      
      expect(response.status).toBe(200);
    });

    it('deve retornar erro para chat não encontrado', async () => {
      const response = await request(app)
        .delete('/chats')
        .send({ id_paciente: 999, id_profissional: 999 });
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /chats/mensagens - Excluir mensagem específica', () => {
    it('deve excluir uma mensagem com sucesso', async () => {
      // Primeiro cria uma mensagem
      const sendResponse = await request(app)
        .post('/chats/chat/send-message')
        .send(testMessage);

      const response = await request(app)
        .delete('/chats/mensagens')
        .send({ 
          id_paciente: testPaciente.id_paciente, 
          id_profissional: testProfissional.id_profissional,
          datahora: testMessage.datahora
        });
      
      expect(response.status).toBe(200);
    });

    it('deve retornar erro para mensagem não encontrada', async () => {
      const response = await request(app)
        .delete('/chats/mensagens')
        .send({ 
          id_paciente: 999, 
          id_profissional: 999,
          datahora: new Date().toISOString()
        });
      
      expect(response.status).toBe(404);
    });
  });
});