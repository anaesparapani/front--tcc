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

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // garante comparação apenas de datas

  const handleClose = () => setAlert({ ...alert, visible: false });

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

        const reservasFormatadas = Object.entries(reservasObj)
          .flatMap(([data, reservasDoDia]) =>
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
              id_reserva: r.id_reserva || r.periodos?.[0]?.id_reserva,
              uniqueKey: `${data}-${r.nomeSalaDisplay || r.nomeSala || idx}-${
                r.descricaoDetalhe || r.descricaoSala || idx
              }`,
            }))
          )
          // 🔥 FILTRA APENAS RESERVAS DE HOJE OU FUTURO (somente FRONT!)
          .filter((r) => {
            const dataReserva = new Date(r.data_inicio);
            dataReserva.setHours(0, 0, 0, 0);
            return dataReserva >= hoje;
          });

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

  const handleExcluir = async (ids) => {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        setAlert({
          type: "warning",
          message: "Nenhum horário selecionado para exclusão.",
          visible: true,
        });
        return;
      }

      const idsNumericos = ids.map((v) =>
        typeof v === "string" && /^\d+$/.test(v) ? Number(v) : v
      );

      try {
        await api.deleteSchedule(reservaId);
      } catch (err) {
        await Promise.all(idsNumericos.map((id) => api.deleteSchedule(id)));
      }

      setAlert({
        type: "success",
        message: "Reserva excluída com sucesso!",
        visible: true,
      });

      setModalOpen(false);
      carregarReservas();
    } catch (err) {
      console.error("Erro ao excluir reservas:", err);
      setAlert({
        type: "error",
        message:
          err.response?.data?.error ||
          err.message ||
          "Erro ao excluir as reservas.",
        visible: true,
      });
    }
  };

  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

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
            Você não possui reservas futuras.
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

                            {periodos.map((p) => {
                              const inicio = p.horario_inicio?.slice(0, 5);
                              const fim = p.horario_fim?.slice(0, 5);

                              return (
                                <Typography
                                  key={p.id_periodo || p.id_reserva}
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
                                      id_reserva: reserva.id_reserva,
                                      nomeSala: reserva.nomeSala,
                                      descricaoSala: reserva.descricaoSala,
                                      data_inicio: reserva.data_inicio,
                                      periodos: reserva.periodos,
                                      periodoSelecionado: p,
                                    });
                                    setModalOpen(true);
                                  }}
                                >
                                  {inicio} - {fim}
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
        onConfirm={(ids) => handleExcluir(ids)}
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
