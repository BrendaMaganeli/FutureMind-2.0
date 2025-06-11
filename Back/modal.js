// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, 'public/uploads/');
//   },
//   filename: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
//       cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// app.post('/upload-foto/:id_paciente', upload.single('foto'), async (req, res) => {
//   try {
//     const { id_paciente } = req.params;
//     const foto = req.file;

//     if (!foto) {
//       return res.status(400).json({ erro: 'Nenhuma foto enviada' });
//     }

//     const [result] = await pool.execute(
//       'UPDATE pacientes SET foto_perfil = ? WHERE id_paciente = ?',
//       [`/uploads/${foto.filename}`, id_paciente]
//     );    

//     res.status(200).json({ mensagem: 'Foto enviada com sucesso' });
//   } catch (error) {
//     console.error('Erro ao enviar foto:', error);
//     res.status(500).json({ erro: 'Erro interno ao enviar foto' });
//   }
// });







// Pastas

app.get('/pastas', async (req, res) => {
  const { id_paciente, id_profissional } = req.query;

  try {
    let query = '';
    let params = [];

    if (id_paciente) {
      query = 'SELECT * FROM pasta WHERE id_paciente = ?';
      params = [id_paciente];
    } else if (id_profissional) {
      query = 'SELECT * FROM pasta WHERE id_profissional = ?';
      params = [id_profissional];
    } else {
      return res.status(400).json({ error: 'É necessário informar id_paciente ou id_profissional' });
    }

    const [pasta] = await pool.query(query, params);
    res.json(pasta || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post('/pastas', async (req, res) => {
  const { id_paciente, id_profissional, nome } = req.body;

  try {
    let query = '';
    let params = [];

    if (id_paciente) {
      query = 'INSERT INTO pasta (id_paciente, nome) VALUES (?, ?)';
      params = [id_paciente, nome];
    } else if (id_profissional) {
      query = 'INSERT INTO pasta (id_profissional, nome) VALUES (?, ?)';
      params = [id_profissional, nome];
    } else {
      return res.status(400).json({ error: 'É necessário informar id_paciente ou id_profissional' });
    }

    const [result] = await pool.query(query, params);
    res.status(201).json({ id: result.insertId, nome });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/pastas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    const [result] = await pool.query('UPDATE pasta SET nome = ? WHERE id_pasta = ?', [nome, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pasta não encontrada' });
    }

    res.json({ id, nome });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/pastas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM pasta WHERE id_pasta = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pasta não encontrada' });
    }

    res.json({ message: 'Pasta deletada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






// Notas

app.get('/notas', async (req, res) => {
  const { id_paciente, id_profissional, id_pasta } = req.query;

  try {
    let query = '';
    let params = [];

    if (!id_pasta) {
      return res.status(400).json({ error: 'É necessário informar o id_pasta' });
    }

    if (id_paciente) {
      query = 'SELECT * FROM nota WHERE id_paciente = ? AND id_pasta = ?';
      params = [id_paciente, id_pasta];
    } else if (id_profissional) {
      query = 'SELECT * FROM nota WHERE id_profissional = ? AND id_pasta = ?';
      params = [id_profissional, id_pasta];
    } else {
      return res.status(400).json({ error: 'É necessário informar id_paciente ou id_profissional' });
    }

    const [nota] = await pool.query(query, params);
    const notaParseadas = nota.map(nota => {
      try {
        return {
          ...nota,
          conteudo: JSON.parse(nota.conteudo)
        };
      } catch (e) {
        return {
          ...nota,
          conteudo: { checklist: [], imageNote: "" }
        };
      }
    });

    res.json(notaParseadas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/notas', async (req, res) => {
  const { id_paciente, id_profissional, titulo, conteudo, id_pasta } = req.body;

  try {
    if (!id_pasta) {
      return res.status(400).json({ error: 'É necessário informar o id_pasta' });
    }

    const conteudoPadronizado = {
      checklist: conteudo?.checklist || [],
      imageNote: conteudo?.imageNote || ""
    };

    const conteudoStr = JSON.stringify(conteudoPadronizado);

    let query = '';
    let params = [];

    if (id_paciente) {
      query = `INSERT INTO nota (id_paciente, titulo, conteudo, id_pasta) VALUES (?, ?, ?, ?)`;
      params = [id_paciente, titulo, conteudoStr, id_pasta];
    } else if (id_profissional) {
      query = `INSERT INTO nota (id_profissional, titulo, conteudo, id_pasta) VALUES (?, ?, ?, ?)`;
      params = [id_profissional, titulo, conteudoStr, id_pasta];
    } else {
      return res.status(400).json({ error: 'É necessário informar id_paciente ou id_profissional' });
    }

    const [result] = await pool.query(query, params);
    res.status(201).json({ id: result.insertId, titulo, conteudo, id_pasta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/notas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo } = req.body;

  try {
    const conteudoStr = JSON.stringify(conteudo);

    const [result] = await pool.query(
      'UPDATE nota SET titulo = ?, conteudo = ? WHERE id_nota = ?',
      [titulo, conteudoStr, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }

    res.json({ id, titulo, conteudo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/notas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM nota WHERE id_nota = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }

    res.json({ message: 'Nota deletada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
