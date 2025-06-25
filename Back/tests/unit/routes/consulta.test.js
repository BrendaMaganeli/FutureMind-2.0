const request = require('supertest');
const app = require('../../../App'); // ajuste o caminho conforme sua estrutura
const pool = require('../../../config/db.config');  // conexão com o banco de dados (ajuste se necessário)

describe('Rotas de Consulta', () => {
  
  let idConsultaCriada;

  beforeAll(async () => {
    // Cria uma consulta para teste
    const [result] = await pool.query(`
      INSERT INTO Agendamento (id_paciente, id_profissional, data, hora)
      VALUES (?, ?, ?, ?)`,
      [1, 1, '2099-12-25', '14:00']
    );
    idConsultaCriada = result.insertId;
  });

  afterAll(async () => {
    // Limpa o banco após os testes
    await pool.query(`DELETE FROM Agendamento WHERE id_agendamento = ?`, [idConsultaCriada]);
    await pool.end(); // encerra a conexão com o banco
  });

  test('GET /consulta/profissional/:id/:year/:month deve retornar consultas do profissional', async () => {
    const res = await request(app).get('/consulta/profissional/1/2099/12');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /consulta/:id_paciente deve retornar consultas do paciente', async () => {
    const res = await request(app).get('/consulta/1');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /consulta/:id_consulta deve atualizar data e hora da consulta', async () => {
    const res = await request(app)
      .put(`/consulta/${idConsultaCriada}`)
      .send({ data: '2099-12-30', hora: '15:00' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Consulta atualizada com sucesso');
  });

  test('DELETE /consulta/:id_consulta deve remover uma consulta futura', async () => {
    const res = await request(app).delete(`/consulta/${idConsultaCriada}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Consulta removida com sucesso');
  });

  test('DELETE /consulta/:id_consulta com consulta inexistente deve retornar 404', async () => {
    const res = await request(app).delete('/consulta/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Consulta não encontrada');
  });

});
