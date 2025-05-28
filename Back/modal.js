// const multer = require('multer');
// const path = require('path');


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = './uploads';
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `foto-${req.params.id}${ext}`;
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage });

// app.post('/upload-foto/:id_paciente', upload.single('foto'), async (req, res) => {
//   const id_paciente = req.params.id_paciente;
//   const caminho = req.file.path;

//   try {
//     await pool.query(
//       'UPDATE pacientes SET foto = ? WHERE id_paciente = ?',
//       [caminho, id_paciente]
//     );
//     res.status(200).json({ message: 'Foto salva com sucesso', path: caminho });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erro ao salvar a imagem no banco de dados' });
//   }
// });

// app.get('/foto/:id_paciente', async (req, res) => {
//   const id_paciente = req.params.id_paciente;

//   try {
//     const [rows] = await pool.query(
//       'SELECT foto FROM pacientes WHERE id_paciente = ?', [id_paciente]
//     );

//     if (rows.length === 0 || !rows[0].foto) {
//       return res.status(404).json({ error: 'Foto não encontrada' });
//     }

//     const caminho = rows[0].foto;
//     res.sendFile(path.resolve(caminho));
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao buscar imagem do banco' });
//   }
// });

// app.use('/uploads', express.static('uploads'));
