const request = require('supertest');
const app = require('../../../App'); // ajuste se for diferente
const pool = require('../../../config/db.config'); // conexão MySQL

describe('Cadastro de Profissionais', () => {
  // Dados base para teste
  const profissionalValido = {
    nome: "Teste Usuário",
    cpf: "12345678900",
    email: "teste_profissional@email.com",
    senha: "senha123",
    telefone: "11999999999",
    crp: "12345-6",
    especializacao: "Psicologia Clínica",
    abordagem: "TCC",
    data_nascimento: "1990-01-01",
    email_profissional: "teste.profissional@email.com",
    valor_consulta: 150
  };

  // Limpa o banco após os testes
  afterAll(async () => {
    await pool.query('DELETE FROM profissionais WHERE email = ?', [profissionalValido.email]);
    await pool.end();
  });

  it('Deve cadastrar profissional com dados válidos', async () => {
    const res = await request(app)
      .post('/cadastro-profissional')
      .send(profissionalValido);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('affectedRows', 1);
  });

  it('Não deve permitir cadastro com e-mail já existente', async () => {
    // Primeiro cadastro (já feito no teste anterior)

    // Segunda tentativa com o mesmo e-mail
    const res = await request(app)
      .post('/cadastro-profissional')
      .send(profissionalValido);

    // Espera status 409 (se tratamento de duplicidade for feito)
    expect([409, 500]).toContain(res.status); // Temporário até tratar no backend
  });
});
