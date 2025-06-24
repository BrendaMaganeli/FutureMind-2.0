const request = require('supertest');
const app = require('../../../App');
const pool = require('../../../config/db.config');

describe('Cadastro de paciente', () => {

  const novoPaciente = {
    Nome_completo: "Teste Usuário",
    cpf: "12345678900",
    Email: "teste@email.com",
    Senha: "123456",
    Telefone: "11999999999",
    Idade: "1990-01-01"
  };

  beforeAll(async () => {
    // Limpa o usuário se já existir
    await pool.query('DELETE FROM pacientes WHERE email = ?', [novoPaciente.Email]);
  });

  it('Deve cadastrar um novo paciente com sucesso', async () => {
    const res = await request(app)
      .post('/cadastro-paciente')
      .send(novoPaciente);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('affectedRows');
    expect(res.body.affectedRows).toBeGreaterThan(0);
  });

  it('Deve retornar erro se o e-mail já estiver em uso', async () => {
    const res = await request(app)
      .post('/cadastro-paciente')
      .send(novoPaciente);
  
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('E-mail já cadastrado');
  });  

});
