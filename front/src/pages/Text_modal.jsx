import * as React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const estiloCaixa = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function MeuModal() {
  const [aberto, setAberto] = React.useState(false);
  const abrir = () => setAberto(true);
  const fechar = () => setAberto(false);

  return (
    <div>
      <Button variant="contained" onClick={abrir}>
        Abrir Modal
      </Button>
      <Modal
        open={aberto}
        onClose={fechar}
        aria-labelledby="titulo-modal"
        aria-describedby="descricao-modal"
      >
        <Box sx={estiloCaixa}>
          <Typography id="titulo-modal" variant="h6" component="h2">
            Título do Modal
          </Typography>
          <Typography id="descricao-modal" sx={{ mt: 2 }}>
            Aqui vai o conteúdo do modal.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
