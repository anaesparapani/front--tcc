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

function ConfirmDialog({ open, onClose, onConfirm, title, periodos = [] }) {
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    if (open?.periodoSelecionado) {
      const periodoEncontrado = periodos.find(
        (p) => p.id === open.periodoSelecionado.id_reserva
      );

      if (periodoEncontrado) {
        setSelecionados([periodoEncontrado.id]);
      } else {
        setSelecionados([]);
      }
    } else {
      setSelecionados([]);
    }
  }, [open, periodos]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#C91E1E",
          borderRadius: 3,
          padding: 1.5,
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
        {title}
      </DialogTitle>

      {/* Seleção de horários */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          padding: 2,
          marginX: 2,
          marginBottom: 2,
        }}
      >
        {periodos.length > 0 ? (
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
                      periodos.find((p) => p.id === id)?.inicio +
                      " - " +
                      periodos.find((p) => p.id === id)?.fim
                  )
                  .join(", ")
              }
            >
              {periodos.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.inicio} - {p.fim}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography textAlign="center">Nenhum horário encontrado.</Typography>
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
          onClick={onClose}
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

export default ConfirmDialog;
