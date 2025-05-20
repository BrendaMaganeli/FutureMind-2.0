const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

app.post('/upload-foto/:id_paciente', upload.single('foto'), async (req, res) => {
    try {
      const { id_paciente } = req.params;
      const filePath = '/uploads/' + req.file.filename;
  
      const [result] = await pool.query(
        'UPDATE pacientes SET foto=? WHERE id_paciente=?',
        [filePath, id_paciente]
      );
  
      if (result.affectedRows > 0) {
        res.status(200).json({ mensagem: 'Foto atualizada com sucesso!', caminho: filePath });
      } else {
        res.status(404).json('Paciente não encontrado');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Erro ao fazer upload da foto');
    }
  });
  