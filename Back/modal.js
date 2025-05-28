const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
      cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/upload-foto/:id_paciente', upload.single('foto'), async (req, res) => {
  try {
    const { id_paciente } = req.params;
    const foto = req.file;

    if (!foto) {
      return res.status(400).json({ erro: 'Nenhuma foto enviada' });
    }

    const [result] = await pool.execute(
      'UPDATE pacientes SET foto_perfil = ? WHERE id_paciente = ?',
      [`/uploads/${foto.filename}`, id_paciente]
    );    

    res.status(200).json({ mensagem: 'Foto enviada com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar foto:', error);
    res.status(500).json({ erro: 'Erro interno ao enviar foto' });
  }
});