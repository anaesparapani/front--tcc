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
  const [horariosDaSala, setHorariosDaSala] = useState([]);

  const handleOpenDialog = (id, horariosSala) => {
    setReservaId(id);
    setHorariosDaSala(
      horariosSala.map((h) => ({
        id: h.id_reserva,
        inicio: h.horario_inicio.slice(0, 5),
        fim: h.horario_fim.slice(0, 5),
      }))
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReservaId(null);
    setHorariosDaSala([]);
  };

  const handleClose = () => {
    setAlert({ ...alert, visible: false });
  };

  async function getReservas(dataFormatada) {
    try {
      const response = await api.getReservasByData(dataFormatada);
      setReservas(response.data.reservaBySala);
    } catch (error) {
      setReservas({});
      setAlert({
        message: error.response?.data?.message || "Erro desconhecido",
        type: "error",
        visible: true,
      });
    }
  }

  const handleDeleteReserva = async (idsSelecionados) => {
    try {
      if (!Array.isArray(idsSelecionados) || idsSelecionados.length === 0) {
        setAlert({
          message: "Nenhum horário selecionado.",
          type: "warning",
          visible: true,
        });
        return;
      }

      const ids = idsSelecionados.map(Number);

      // CORREÇÃO AQUI: usar id, não id_reserva
      await Promise.all(ids.map((id) => api.deleteSchedule(id)));

      setOpenDialog(false);

      // CORREÇÃO AQUI
      setAlert({
        message: "Horário(s) deletado(s) com sucesso!",
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

        {/* LISTA DAS SALAS */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {Object.entries(reservas)
            .filter(([nomeSala]) => {
              if (!filtroLetra) return true;
              return nomeSala.startsWith(filtroLetra);
            })
            .sort(([a], [b]) => a.localeCompare(b))
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
                    width: {
                      xs: "75%", // telas muito pequenas (celular)
                      sm: "48%", // tablets pequenos (~2 por linha)
                      md: "31%", // telas médias (~3 por linha)
                      lg: "23%", // desktops (~4 por linha)
                    },
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
                      marginX: 1,
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
                            onClick={() =>
                              handleOpenDialog(
                                reserva.id_reserva,
                                reservasSala.filter((r) => r.nomeUsuario === reserva.nomeUsuario)
                              )
                            }


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

      {/* ALERTA */}
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

      {/* DIALOG DE CONFIRMAÇÃO COM HORÁRIOS */}
      <ConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteReserva}
        title="Selecione os horários que deseja deletar."
        periodos={horariosDaSala}
        periodoSelecionado={reservaId}  // <-- ESSENCIAL
      />
    </Box>
  );
}