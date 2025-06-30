const express = require("express");
const router = express.Router();
const pool = require("../config/db.config");

router.post("/assinatura", async (req, res) => {
  const {
    data_assinatura,
    fk_id_paciente,
    tipo_assinatura,
    data_fim_assinatura: dataFimOriginal,
  } = req.body;

  try {
    let consultas_disponiveis;
    let data_fim_assinatura = dataFimOriginal;

    // Ajusta consultas disponíveis conforme tipo de plano
    if (tipo_assinatura === "prata") {
      consultas_disponiveis = 4;
    } else if (tipo_assinatura === "ouro") {
      consultas_disponiveis = 12;

      // Adiciona 2 meses extras à data_fim_assinatura, que já vem 1 mês à frente
      const data = new Date(dataFimOriginal);
      data.setMonth(data.getMonth() + 2);
      data_fim_assinatura = data.toISOString().split("T")[0];
    } else {
      consultas_disponiveis = null;
    }

    // Valida se todos os dados obrigatórios estão presentes
    if (
      !data_assinatura ||
      !fk_id_paciente ||
      !tipo_assinatura ||
      !consultas_disponiveis ||
      !data_fim_assinatura
    ) {
      return res.status(404).json({ Error: "Dados incompletos" });
    }

    // Insere assinatura no banco
    const [response] = await pool.query(
      "INSERT INTO assinaturas (data_assinatura, fk_id_paciente, tipo_assinatura, consultas_disponiveis, data_fim_assinatura) VALUES (?, ?, ?, ?, ?)",
      [
        data_assinatura,
        fk_id_paciente,
        tipo_assinatura,
        consultas_disponiveis,
        data_fim_assinatura,
      ]
    );

    if (response.affectedRows > 0) {
      return res.status(201).json({ success: true });
    }

    return res.status(404).json({ Error: "Erro ao inserir dados" });
  } catch (error) {
    console.error("Erro ao salvar assinatura:", error);
    res.status(500).json({ Error: "Erro interno do servidor" });
  }
});


router.get("/pagamento/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT consultas_disponiveis FROM assinaturas WHERE fk_id_paciente = ?",
      [id]
    );
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json("Profissional não encontrado!");
    }
  } catch (err) {
    res.status(500).json({ Erro: "Erro no servidor, erro: ", err });
  }
});

router.post("/planos", async (req, res) => {
  try {
    const { id } = req.body; // <-- CORRETO para POST

    const [rows] = await pool.query(
      "SELECT data_fim_assinatura FROM assinaturas WHERE fk_id_paciente = ?",
      [id]
    );

    if (rows.length > 0) {
      res.status(200).json(rows[0]); // retorna { data_fim_assinaturas: '...' }
    } else {
      res.status(404).json({ erro: "Assinatura não encontrada!" });
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhes: err.message });
  }
});

router.post("/plano_empressarial", async (req, res) => {
  const { tipo_assinatura, fk_id_paciente, data_assinatura } = req.body;

  try {
    const [response] = await pool.query(
      "INSERT INTO assinaturas (tipo_assinatura, fk_id_paciente, data_assinatura) VALUES (?, ?, ?)",
      [tipo_assinatura, fk_id_paciente, data_assinatura]
    );

    if (response.affectedRows > 0) {
      return res.status(201).json({ success: true });
    }

    return res.status(404).json({ Error: "erro ao inserir dados" });
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    res.status(500).json({ Error: "Erro interno do servidor" });
  }
});

router.put("/pagamento", async (req, res) => {
  const { id_paciente, chk_plano } = req.body;

  try {
    const [response] = await pool.query(
      `UPDATE pacientes SET chk_plano=? WHERE id_paciente=?`,
      [chk_plano, id_paciente]
    );

    if (response.affectedRows > 0) {
      return res.status(201).json({ success: true });
    }
    return res.status(404).json({ Error: "erro ao inserir dados" });
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    res.status(500).json({ Error: "Erro interno do servidor" });
  }
});

router.put("/validacao_planos", async (req, res) => {
  const { id_paciente, chk_plano } = req.body;

  try {
    const [response] = await pool.query(
      `UPDATE pacientes SET chk_plano = ? WHERE id_paciente = ?`,
      [chk_plano, id_paciente]
    );

    const [result] = await pool.query(
      `DELETE FROM assinaturas WHERE fk_id_paciente = ?`,
      [id_paciente]
    );

    if (response.affectedRows > 0) {
      console.log("update");
      return res.status(200).json({ success: true });
    } else {
      console.log("err update");
    }

    if (result.affectedRows > 0) {
      console.log("delete");
      return res.status(200).json({ success: true });
    } else {
      console.log("erro delete");
    }

    return res.status(404).json({ error: "Paciente não encontrado." });
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/valor_consultas", async (req, res) => {
  const { id_paciente } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT consultas_disponiveis FROM assinaturas WHERE fk_id_paciente = ?",
      [id_paciente]
    );

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      console.log("erro ao buscar contador!");
    }
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.put("/mudar_valor_consultas", async (req, res) => {
  const { id_paciente, chk_plano } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT consultas_disponiveis FROM assinaturas WHERE fk_id_paciente = ?",
      [id_paciente]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Assinatura não encontrada para esse paciente." });
    }

    const consultasDisponiveis = rows[0].consultas_disponiveis;

    if (consultasDisponiveis > 1) {
      // Debita 1 consulta
      await pool.query(
        "UPDATE assinaturas SET consultas_disponiveis = consultas_disponiveis - 1 WHERE fk_id_paciente = ?",
        [id_paciente]
      );
      return res
        .status(200)
        .json({ message: "Consulta debitada com sucesso." });
    } else if (consultasDisponiveis === 1) {
      // Última consulta: remove assinatura e atualiza chk_plano
      await pool.query("DELETE FROM assinaturas WHERE fk_id_paciente = ?", [
        id_paciente,
      ]);

      await pool.query(
        "UPDATE pacientes SET chk_plano = ? WHERE id_paciente = ?",
        [chk_plano, id_paciente]
      );

      return res.status(200).json({
        message:
          "Última consulta usada, assinatura removida e plano cancelado.",
      });
    } else {
      return res.status(400).json({
        error: "Paciente não possui consultas disponíveis.",
      });
    }
  } catch (error) {
    console.error("Erro ao debitar consulta:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.delete("/remover_assinatura", async (req, res) => {
  const { id_paciente } = req.body;

  try {
    const [result] = await pool.query(
      "DELETE FROM assinaturas WHERE fk_id_paciente = ?",
      [id_paciente]
    );

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Assinatura removida com sucesso." });
    } else {
      return res.status(404).json({ error: "Assinatura não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao remover assinatura:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.put("/atualizar_chk_plano", async (req, res) => {
  const { id_paciente, chk_plano } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE pacientes SET chk_plano = ? WHERE id_paciente = ?",
      [chk_plano, id_paciente]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "chk_plano atualizado com sucesso" });
    } else {
      res.status(404).json({ error: "Paciente não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar chk_plano:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/estado_plano", async (req, res) => {
  const { id_paciente } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT chk_plano FROM pacientes WHERE id_paciente = ?",
      [id_paciente]
    );

    if (rows.length > 0) {
      // Retorna o valor direto, ou um objeto mais limpo
      res.status(200).json({ chk_plano: rows[0].chk_plano });
    } else {
      res.status(404).json({ error: "Paciente não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao pegar valor chk:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/Valores_assinatura", async (req, res) => {

const { id_paciente } = req.body

const [rows] = await pool.query( 
  "SELECT data_assinatura, tipo_assinatura, consultas_disponiveis, data_fim_assinatura FROM assinaturas WHERE fk_id_paciente = ?",
  [id_paciente]
)

if(rows.length > 0){

     res.status(200).json(rows);
}else{

   console.error("Erro ao pegar valor do plano:");
  res.status(500).json({ error: "Erro interno do servidor" });
}
})


module.exports = router;
