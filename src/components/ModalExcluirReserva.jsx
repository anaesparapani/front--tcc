import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function ModalExcluirReserva({
  open,
  handleClose,
  reserva,
  onConfirm,
  title,
}) {
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    if (reserva?.periodoSelecionado) {
      // Seleciona automaticamente o horário clicado
      setSelecionados([Number(reserva.periodoSelecionado.id_reserva)]);
    } else {
      setSelecionados([]);
    }
  }, [reserva]);

  const dataInicio = reserva?.data_inicio
    ? reserva.data_inicio.split("T")[0].split("-").reverse().join("/")
    : "Não informada";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#C91E1E",
          borderRadius: 3,
          padding: 1.5,
          width: "500px", // largura fixa maior
          maxWidth: "90%", // para responsividade em telas pequenas
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
          paddingBottom: 2,
        }}
      >
        {title || "Excluir Reserva"}
      </DialogTitle>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          padding: 2,
          marginX: 2,
          marginBottom: 2,
        }}
      >
        {!reserva ? (
          <Typography textAlign="center">
            Nenhuma reserva selecionada.
          </Typography>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              SALA: {reserva.nomeSala}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              DATA: {dataInicio}
            </Typography>

            <FormControl fullWidth>
              <InputLabel id="select-label" shrink>
                Selecionar horários
              </InputLabel>
              <Select
                labelId="select-label"
                multiple
                value={selecionados}
                onChange={(e) => setSelecionados(e.target.value)}
                renderValue={(selected) =>
                  selected
                    .map(
                      (id) =>
                        reserva.periodos
                          .find((p) => p.id_reserva === id)
                          ?.horario_inicio.slice(0, 5) +
                        " - " +
                        reserva.periodos
                          .find((p) => p.id_reserva === id)
                          ?.horario_fim.slice(0, 5)
                    )
                    .join(", ")
                }
              >
                {reserva.periodos.map((p) => (
                  <MenuItem key={p.id_reserva} value={p.id_reserva}>
                    {p.horario_inicio.slice(0, 5)} - {p.horario_fim.slice(0, 5)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Box>

      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          sx={{
            color: "#C91E1E",
            backgroundColor: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            paddingX: 4,
          }}
          onClick={handleClose}
        >
          Cancelar
        </Button>

        <Button
          onClick={() => onConfirm(selecionados)}
          sx={{
            color: "#C91E1E",
            backgroundColor: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            paddingX: 4,
          }}
        >
          Deletar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
