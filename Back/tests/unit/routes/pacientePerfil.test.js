const request = require('supertest');
const app = require('../../../App');
const pool = require('../../../config/db.config');

describe('Perfil do Paciente - Fluxo Completo', () => {
  let testPatientId;
  const testPatientData = {
    nome: 'Paciente Teste',
    cpf: '12345678901',
    email: 'paciente_teste@example.com',
    telefone: '11987654321',
    data_nascimento: '1990-01-01',
    senha: 'senha123'
  };

  beforeAll(async () => {
    // Cria paciente para testes
    const [result] = await pool.query(
      'INSERT INTO pacientes SET ?',
      testPatientData
    );
    testPatientId = result.insertId;
  });

  afterAll(async () => {
    // Limpeza final
    await pool.query('DELETE FROM pacientes WHERE id_paciente = ?', [testPatientId]);
    await pool.end();
  });

  // CASO 5: Atualização de dados
  describe('Atualização de Perfil', () => {
    it('deve atualizar os dados do paciente', async () => {
      const updatedData = {
        nome: 'Nome Atualizado',
        email: 'novo_email@example.com',
        telefone: '11999998888',
        id_paciente: testPatientId
      };

      const response = await request(app)
        .put('/paciente')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(updatedData.email);
    });

    it('deve detectar conflitos em dados existentes', async () => {
      // Criar outro paciente para testar conflito
      const [otherPatient] = await pool.query(
        'INSERT INTO pacientes SET ?',
        {
          nome: 'Outro Paciente',
          email: 'conflito@example.com',
          cpf: '99988877766',
          telefone: '11977776666'
        }
      );

      const response = await request(app)
        .post('/verificar_paciente')
        .send({
          valorEmail: 'conflito@example.com', // Email já existente
          cpf: '99988877766', // CPF já existente
          telefone: '11977776666' // Telefone já existente
        });

      expect(response.body).toEqual({
        emailExiste: true,
        cpfExiste: true,
        telefoneExiste: true
      });

      // Limpeza
      await pool.query('DELETE FROM pacientes WHERE id_paciente = ?', [otherPatient.insertId]);
    });
  });

  describe('Exclusão de Conta', () => {
    it('deve deletar o paciente permanentemente', async () => {
      // Cria um paciente temporário só para este teste
      const [tempPatient] = await pool.query(
        'INSERT INTO pacientes SET ?',
        {
          nome: 'Paciente Temporário',
          email: 'temp@example.com',
          cpf: '11122233344'
        }
      );
      const tempId = tempPatient.insertId;
  
      const response = await request(app)
        .delete('/paciente') // Novo endpoint
        .send({ id_paciente: tempId }); // Campo correto
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Paciente deletado com sucesso!');
      
      // Verificação no banco
      const [rows] = await pool.query(
        'SELECT * FROM pacientes WHERE id_paciente = ?',
        [tempId]
      );
      expect(rows.length).toBe(0);
    });
  });
  
});