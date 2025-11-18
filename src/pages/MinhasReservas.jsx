import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import api from "../axios/axios";
import ModalExcluirReserva from "../components/ModalExcluirReserva";

export default function MinhasReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [modalOpen, setModalOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const idUsuario = localStorage.getItem("id_usuario");

  const handleClose = () => setAlert({ ...alert, visible: false });

  // Carrega reservas do usuário
  const carregarReservas = useCallback(() => {
    if (!idUsuario) {
      setAlert({
        type: "error",
        message: "ID do usuário não encontrado.",
        visible: true,
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    api
      .getSchedulesByUserID(idUsuario)
      .then((res) => {
        const reservasObj = res.data?.reservas || {};

        const reservasFormatadas = Object.entries(reservasObj).flatMap(
          ([data, reservasDoDia]) =>
            reservasDoDia.map((r, idx) => ({
              ...r,
              data_inicio: data,
              nomeSala: r.nomeSala || r.nomeSalaDisplay || "Sala não informada",
              descricaoSala:
                r.descricaoSala || r.descricaoDetalhe || "Sem descrição",
              periodos: r.periodos.map((p) => ({
                ...p,
                id_periodo: p.id_periodo,
              })),
              // Se vier do backend, mantém. Caso contrário, pega do primeiro período.
              id_reserva: r.id_reserva || r.periodos?.[0]?.id_reserva,
              uniqueKey: `${data}-${r.nomeSalaDisplay || r.nomeSala || idx}-${r.descricaoDetalhe || r.descricaoSala || idx
                }`,
            }))
        );

        setReservas(reservasFormatadas);
      })
      .catch((e) => {
        setAlert({
          type: "error",
          message: e.response?.data?.error || e.message,
          visible: true,
        });
      })
      .finally(() => setLoading(false));
  }, [idUsuario]);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  const handleExcluir = async () => {
    if (!reservaSelecionada) return;

    try {
      const idReserva =
        reservaSelecionada?.id_reserva ||
        reservaSelecionada?.periodoSelecionado?.id_reserva;

      if (!idReserva) {
        throw new Error("ID da reserva não encontrado.");
      }

      await api.deleteSchedule(idReserva);

      setAlert({
        type: "success",
        message: "Reserva excluída com sucesso!",
        visible: true,
      });

      setModalOpen(false);
      carregarReservas();
    } catch (err) {
      console.error("Erro ao excluir:", err);
      setAlert({
        type: "error",
        message:
          err.response?.data?.error ||
          err.message ||
          "Erro ao excluir a reserva.",
        visible: true,
      });
    }
  };

  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Agrupa reservas por data
  const reservasPorData = {};
  reservas.forEach((reserva) => {
    const dataFormatada = reserva.data_inicio || "Data não informada";
    if (!reservasPorData[dataFormatada]) reservasPorData[dataFormatada] = [];
    reservasPorData[dataFormatada].push(reserva);
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#FFE9E9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 8,
        pb: 4,
      }}
    >
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            width: "100%",
          }}
        >
          <Typography>Carregando...</Typography>
        </Box>
      )}

      {!loading && Object.keys(reservasPorData).length === 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            width: "100%",
          }}
        >
          <Typography
            sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem" }}
          >
            Você não possui reservas no momento.
          </Typography>
        </Box>
      )}

      {!loading && Object.keys(reservasPorData).length > 0 && (
        <Box sx={{ width: "90%", maxWidth: "800px" }}>
          {Object.keys(reservasPorData)
            .sort()
            .map((data) => (
              <Box key={data} sx={{ width: "100%", mb: 3 }}>
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "#FF9696",
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {reservasPorData[data][0]?.diaDaSemana || ""} -{" "}
                    {formatarData(data)}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {reservasPorData[data].map((reserva) => {
                    const { nomeSala, descricaoSala, periodos, uniqueKey } =
                      reserva;

                    return (
                      <Grid item key={uniqueKey}>
                        <Card
                          sx={{
                            width: 200,
                            borderRadius: 2,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                          }}
                        >
                          <CardHeader
                            title={nomeSala}
                            titleTypographyProps={{
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "0.95rem",
                              color: "white",
                            }}
                            sx={{ bgcolor: "#b9181d", p: 1 }}
                          />
                          <CardContent sx={{ p: 1.5 }}>
                            <Box
                              sx={{
                                bgcolor: "#f5f5f5",
                                p: 1,
                                borderRadius: 1,
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "bold", textAlign: "center" }}
                              >
                                {descricaoSala}
                              </Typography>
                            </Box>

                            {periodos.map((p, idx) => {
                              const inicio = p.horario_inicio?.slice(0, 5);
                              const fim = p.horario_fim?.slice(0, 5);
                              const texto =
                                inicio && fim
                                  ? `${inicio} - ${fim}`
                                  : "Horário: não informado";

                              return (
                                <Typography
                                  key={`${uniqueKey}-${idx}`}
                                  variant="body2"
                                  sx={{
                                    mt: 1,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": { color: "primary.main" },
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReservaSelecionada({
                                      ...reserva,
                                      periodoSelecionado: p,
                                    });
                                    setModalOpen(true);
                                  }}
                                >
                                  {texto}
                                </Typography>
                              );
                            })}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))}
        </Box>
      )}

      <ModalExcluirReserva
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        reserva={reservaSelecionada}
        onConfirm={handleExcluir}
      />

      <Snackbar
        open={alert.visible}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {alert.type && (
          <Alert severity={alert.type} onClose={handleClose} sx={{ width: "100%" }}>
            <AlertTitle>
              {alert.type === "success" && "Sucesso"}
              {alert.type === "error" && "Erro"}
              {alert.type === "warning" && "Atenção"}
              {alert.type === "info" && "Informação"}
            </AlertTitle>

            {alert.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}
