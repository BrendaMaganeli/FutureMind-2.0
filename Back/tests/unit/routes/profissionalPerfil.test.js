const request = require('supertest');
const app = require('../../../App');
const pool = require('../../../config/db.config');

describe('Perfil do Profissional', () => {
  let testProfessionalId;
  const testProfessionalData = {
    nome: 'Profissional Teste',
    cpf: '98765432109',
    email: 'profissional_teste@example.com',
    telefone: '11987654321',
    data_nascimento: '1985-05-15',
    senha: 'senha123',
    crp: '12345/SP',
    especializacao: 'Psicologia Clínica',
    abordagem: 'TCC',
    valor_consulta: 150.00,
    email_profissional: 'prof.teste@example.com'
  };

  // Criar um profissional de teste antes de executar os testes
  beforeAll(async () => {
    const [result] = await pool.query(
      'INSERT INTO profissionais SET ?',
      testProfessionalData
    );
    testProfessionalId = result.insertId;
  });

  // Limpar dados de teste após os testes
  afterAll(async () => {
    await pool.query('DELETE FROM profissionais WHERE id_profissional = ?', [testProfessionalId]);
    await pool.end();
  });

  // Caso 5: Atualização de dados
  describe('PUT /editarprofissional - Atualização de dados', () => {
    it('deve atualizar os dados do profissional com sucesso', async () => {
      const updatedData = {
        nome: 'Profissional Atualizado',
        email: 'prof.atualizado@example.com',
        telefone: '11999999999',
        valor_consulta: 200.00,
        sobre_mim: 'Novo texto sobre mim',
        id_profissional: testProfessionalId
      };

      const response = await request(app)
        .put('/editarprofissional')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe(updatedData.nome);
      expect(response.body.email).toBe(updatedData.email);
      expect(response.body.valor_consulta).toBe(updatedData.valor_consulta);
    });

    it('deve retornar erro 404 se o profissional não existir', async () => {
      const response = await request(app)
        .put('/editarprofissional')
        .send({
          nome: 'Profissional Inexistente',
          id_profissional: 999999
        });
    
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Profissional não encontrado');
    });

    it('deve retornar erro 500 se houver erro no servidor', async () => {
      // Simular um erro forçando um campo inválido
      const response = await request(app)
        .put('/editarprofissional')
        .send({
          id_profissional: testProfessionalId,
          data_nascimento: 'data-invalida'
        });

      expect(response.status).toBe(500);
    });
  });

  // Caso 7: Exclusão de conta
  describe('DELETE /editar-profissional - Exclusão de conta', () => {
    let tempProfessionalId;

    // Criar um profissional temporário para teste de exclusão
    beforeEach(async () => {
      const [result] = await pool.query(
        'INSERT INTO profissionais SET ?',
        {
          nome: 'Profissional Temp',
          email: 'temp@example.com',
          cpf: '11122233344',
          crp: '54321/SP'
        }
      );
      tempProfessionalId = result.insertId;
    });

    it('deve deletar o profissional com sucesso', async () => {
      const response = await request(app)
        .delete('/editar-profissional')
        .send({ id_profissional: tempProfessionalId });
    
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profissional e agendamentos relacionados deletados com sucesso');
    
      // Verificação no banco
      const [rows] = await pool.query(
        'SELECT * FROM profissionais WHERE id_profissional = ?',
        [tempProfessionalId]
      );
      expect(rows.length).toBe(0);
    });

    it('deve retornar erro 404 se o profissional não existir', async () => {
      const response = await request(app)
        .delete('/editar-profissional')
        .send({ id_profissional: 999999 });
    
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Profissional não encontrado');
    });

    it('deve deletar os agendamentos relacionados ao profissional', async () => {
      // Criar um paciente de teste para o agendamento
      const [patient] = await pool.query(
        'INSERT INTO pacientes (nome, email) VALUES ("Paciente Teste", "teste@example.com")'
      );
      const patientId = patient.insertId;
    
      // Criar um agendamento para o profissional temporário
      await pool.query(
        'INSERT INTO Agendamento (id_profissional, id_paciente, data, hora) VALUES (?, ?, "2023-12-01", "10:00:00")',
        [tempProfessionalId, patientId]
      );
    
      // Verificar que o agendamento foi criado
      const [initialAppointments] = await pool.query(
        'SELECT * FROM Agendamento WHERE id_profissional = ?',
        [tempProfessionalId]
      );
      expect(initialAppointments.length).toBe(1);
    
      // Deletar o profissional
      await request(app)
        .delete('/editar-profissional')
        .send({ id_profissional: tempProfessionalId });
    
      // Verificar se os agendamentos foram deletados
      const [finalAppointments] = await pool.query(
        'SELECT * FROM Agendamento WHERE id_profissional = ?',
        [tempProfessionalId]
      );
      expect(finalAppointments.length).toBe(0);
    
      // Limpeza
      await pool.query('DELETE FROM pacientes WHERE id_paciente = ?', [patientId]);
    });
  });


});