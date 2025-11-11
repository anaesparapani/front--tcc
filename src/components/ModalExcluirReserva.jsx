import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function ModalExcluirReserva({
  open,
  handleClose,
  reserva,
  onConfirm,
}) {
  if (!reserva) return null;

  const formatarData = (dataISO) => {
    if (!dataISO) return "Não informada";
    const [ano, mes, dia] = dataISO.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const dataInicio = formatarData(reserva?.data_inicio || "");

  // Pega apenas o horário clicado
  const horarioInicio =
    reserva?.periodoSelecionado?.horario_inicio?.slice(0, 5) || "";
  const horarioFim =
    reserva?.periodoSelecionado?.horario_fim?.slice(0, 5) || "";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#b9181d",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        EXCLUIR
      </DialogTitle>

      <DialogContent sx={{ mt: 2, textAlign: "left" }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          SALA: {reserva?.nomeSala || reserva?.descricaoSala || "Desconhecida"}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          DATA: {dataInicio}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          HORÁRIO:{" "}
          {horarioInicio && horarioFim
            ? `${horarioInicio} - ${horarioFim}`
            : "Não informado"}
        </Typography>
      </DialogContent>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 2,
          pb: 2,
        }}
      >
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: "#f4c6c6",
            color: "#b9181d",
            fontWeight: "bold",
            px: 5,
            "&:hover": { bgcolor: "#e0a5a5" },
          }}
        >
          DELETAR RESERVA
        </Button>

        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            bgcolor: "#b9181d",
            color: "white",
            fontWeight: "bold",
            px: 5,
          }}
        >
          FECHAR
        </Button>
      </Box>
    </Dialog>
  );
}
