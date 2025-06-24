const request = require('supertest');
const app = require('../../../App'); // Substitua pelo caminho do seu app Express
const pool = require('../../../config/db.config'); // Substitua pelo caminho do seu pool de conexão

describe('Testes da rota de pagamento', () => {

  // Teste GET /pagamento/:id
  it('Deve retornar erro 404 para paciente inexistente', async () => {
    const res = await request(app).get(`/pagamento/99999`);
    expect(res.status).toBe(404);
  });

  // Teste PUT /pagamento
  it('Deve atualizar chk_plano com sucesso', async () => {
    const idPaciente = 2;

    // Garante que paciente exista antes
    await pool.query(
      `INSERT INTO pacientes (id_paciente, chk_plano) VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE chk_plano = VALUES(chk_plano)`,
      [idPaciente, 0]
    );

    const res = await request(app).put('/pagamento').send({
      id_paciente: idPaciente,
      chk_plano: 1
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
  });

  it('Deve retornar erro 404 ao tentar atualizar paciente inexistente', async () => {
    const res = await request(app).put('/pagamento').send({
      id_paciente: 9999,
      chk_plano: 1
    });

    expect(res.status).toBe(404);
  });
});
