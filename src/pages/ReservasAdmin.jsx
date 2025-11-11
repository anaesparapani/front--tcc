import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Snackbar,
  Alert,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import api from "../axios/axios";
import ConfirmDialog from "../components/ConfirmDialog";
import Blocos from "../components/Blocos";

export default function ReservasAdmin() {
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [reservas, setReservas] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [reservaId, setReservaId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filtroLetra, setFiltroLetra] = useState(null);

  const handleOpenDialog = (id) => {
    console.log("Abrindo diálogo para reserva:", id);
    setReservaId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReservaId(null);
  };

  const handleClose = () => {
    setAlert({ ...alert, visible: false });
  };

  async function getReservas(dataFormatada) {
    try {
      const response = await api.getReservasByData(dataFormatada);
      console.log("Reservas recebidas:", response.data.reservaBySala);
      setReservas(response.data.reservaBySala);
    } catch (error) {
      setReservas({});
      setAlert({
        message: error.response?.data?.message || "Erro desconhecido",
        type: "error",
        visible: true,
      });
      console.log(error);
    }
  }

  const handleDeleteReserva = async () => {
    try {
      const response = await api.deleteSchedule(reservaId);
      console.log("Reserva deletada com sucesso!");
      setOpenDialog(false);

      setAlert({
        message: response?.data?.message,
        type: "success",
        visible: true,
      });
      if (dataSelecionada) {
        const dataFormatada = dayjs(dataSelecionada).format("YYYY-MM-DD");
        getReservas(dataFormatada);
      }
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || "Erro desconhecido",
        type: "error",
        visible: true,
      });
    }
  };

  useEffect(() => {
    if (dataSelecionada) {
      const dataFormatada = dayjs(dataSelecionada).format("YYYY-MM-DD");
      getReservas(dataFormatada);
    } else {
      setReservas({});
    }
  }, [dataSelecionada]);

  const handleClick = (letra) => {
    console.log(`Botão clicado: ${letra}`);
    setFiltroLetra((prev) => (prev === letra ? null : letra));
  };

  return (
    <Box
      sx={{
        fontFamily: "Arial",
        height: "100%",
        backgroundColor: "#FFE9E9",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Container
        sx={{
          mt: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
            mb: -1,
          }}
        >
          Selecione uma data:
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <DateCalendar
            value={dataSelecionada}
            onChange={(novaData) => setDataSelecionada(novaData)}
            sx={{
              backgroundColor: "white",
              border: "1px solid black",
              marginBottom: 3,
            }}
          />
        </LocalizationProvider>

        <Blocos handleClick={handleClick} />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {Object.entries(reservas)
            .filter(([nomeSala]) => {
              if (!filtroLetra) return true;
              return nomeSala.startsWith(filtroLetra);
            })
            .sort(([nomeSalaA], [nomeSalaB]) =>
              nomeSalaA.localeCompare(nomeSalaB)
            )
            .map(([nomeSala, reservasSala]) => {
              const infoSala = reservasSala[0];
              const reservasPorUsuario = reservasSala.reduce(
                (agrupamento, reserva) => {
                  if (!agrupamento[reserva.nomeUsuario]) {
                    agrupamento[reserva.nomeUsuario] = [];
                  }
                  agrupamento[reserva.nomeUsuario].push(reserva);
                  return agrupamento;
                },
                {}
              );

              return (
                <Box
                  key={nomeSala}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: "white",
                    width: "23%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      backgroundColor: "#b22222",
                      color: "#fff",
                      padding: "15px",
                      fontWeight: "bold",
                      fontSize: "20px",
                      mb: 1,
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  >
                    {infoSala.salaNome}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "#f5f5f5",
                      p: 1,
                      borderRadius: 1,
                      mb: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      {infoSala.descricaoSala}
                    </Typography>
                  </Box>

                  <Typography sx={{ mb: 2, textAlign: "center" }}>
                    Capacidade: {infoSala.capacidade} pessoas
                  </Typography>

                  {Object.entries(reservasPorUsuario).map(
                    ([usuario, reservasUsuario]) => (
                      <Box key={usuario} sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "#333",
                            textAlign: "center",
                          }}
                        >
                          {usuario}
                        </Typography>

                        {reservasUsuario.map((reserva, i) => (
                          <Typography
                            key={i}
                            sx={{
                              textAlign: "center",
                              cursor: "pointer",
                              "&:hover": {
                                color: "#b22222",
                                fontWeight: "bold",
                              },
                            }}
                            onClick={() => handleOpenDialog(reserva.id_reserva)}
                          >
                            {reserva.horario_inicio.slice(0, 5)} -{" "}
                            {reserva.horario_fim.slice(0, 5)}
                          </Typography>
                        ))}
                      </Box>
                    )
                  )}
                </Box>
              );
            })}
        </Box>
      </Container>

      <Snackbar
        open={alert.visible}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {alert.type && (
          <Alert
            severity={alert.type}
            onClose={handleClose}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        )}
      </Snackbar>

      <ConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteReserva}
        title="Você tem certeza que deseja excluir esta reserva?"
      />
    </Box>
  );
}
