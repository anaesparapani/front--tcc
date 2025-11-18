import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  AlertTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Snackbar,
} from "@mui/material";
import api from "../axios/axios";
import ModalReserva from "../components/ModalReserva";

export default function ReservaPage() {
  const { state } = useLocation();
  const sala = state?.sala;

  const hoje = new Date().toISOString().split("T")[0];
  const idUsuario = localStorage.getItem("id_usuario");
  const nomeUsuario = localStorage.getItem("nome_usuario") || "Usuário";

  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const dataSelecionada = state?.data || hoje;
  const [dataInicio, setDataInicio] = useState(dataSelecionada);
  const [dataFim, setDataFim] = useState(dataSelecionada);
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setAlert((prev) => ({ ...prev, visible: false }));

  const fetchHorarios = async () => {
    if (!sala) return;
    try {
      setLoading(true);

      const res = await api.getPeriodoStatus(sala.id_sala, dataInicio);

      const todosHorarios = res.data.periodos || [];

      const horariosProcessados = todosHorarios.map((h) => ({
        ...h,
        reservado: h.status === "reservado",
      }));

      setHorarios(horariosProcessados);
      setErro(false);
    } catch (err) {
      console.error("Erro ao buscar horários:", err);
      setErro(true);
      setHorarios([]);
      setAlert({
        type: "warning",
        message: "Não foi possível carregar os horários.",
        visible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, [sala, dataInicio]);

  const handleToggleHorario = (id, status) => {
    if (status === "ocupado") return;
    setHorariosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setHorariosSelecionados([]);
    setDiasSelecionados([]);
    setDataInicio(hoje);
    setDataFim(hoje);
  };

  const handleReservar = async () => {
    if (!idUsuario) {
      return setAlert({
        type: "error",
        message: "ID do usuário não encontrado. Faça login novamente.",
        visible: true,
      });
    }

    if (
      !dataInicio ||
      !dataFim ||
      diasSelecionados.length === 0 ||
      horariosSelecionados.length === 0
    ) {
      return setAlert({
        type: "warning",
        message:
          "Selecione dias da semana, horário e defina a data de início e fim!",
        visible: true,
      });
    }

    try {
      const response = await api.createReserva({
        periodos: horariosSelecionados,
        fk_id_user: idUsuario,
        fk_id_sala: sala.id_sala,
        dias: diasSelecionados,
        data_inicio: dataInicio,
        data_fim: dataFim,
      });

      const msgErros =
        Array.isArray(response.data?.msgErros) &&
          response.data.msgErros.length > 0
          ? response.data.msgErros
            .map(
              (e, i) =>
                `${i + 1}. ${e.erro || e.sqlMessage || JSON.stringify(e)}`
            )
            .join("\n")
          : "";

      const mensagemFinal = [
        response.data?.message || `Reserva feita para sala ${sala?.numero}!`,
        msgErros ? `\n\nErros:\n${msgErros}` : "",
      ].join("");

      setAlert({
        type: msgErros ? "warning" : "success",
        message: mensagemFinal,
        visible: true,
      });

      resetForm();
      fetchHorarios();
    } catch (err) {
      console.error("Erro ao reservar:", err);
      const errorData = err.response?.data;

      const errorMessage =
        (errorData?.msgErros &&
          errorData.msgErros
            .map((e, i) => `${i + 1}. ${e.erro || e.sqlMessage}`)
            .join("\n")) ||
        errorData?.error ||
        errorData?.message ||
        "Erro ao fazer a reserva. Tente novamente.";

      setAlert({ type: "error", message: errorMessage, visible: true });
    }
  };

  const handleAbrirModal = () => {
    if (
      !dataInicio ||
      !dataFim ||
      diasSelecionados.length === 0 ||
      horariosSelecionados.length === 0
    ) {
      return setAlert({
        type: "warning",
        message:
          "Selecione dias da semana, horário e defina a data de início e fim!",
        visible: true,
      });
    }
    setModalOpen(true);
  };

  if (!sala) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">
          Sala não encontrada!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#ffe9e9", minHeight: "100vh", width: "100%" }}>
      <Box sx={{ width: "100%", p: 3, boxSizing: "border-box" }}>
        {/* número da sala */}
        <Box
          sx={{
            backgroundColor: "#f4bcbc",
            width: "100%",
            py: 1.5,
            px: 2,
            mb: 1,
            mt: 3,
            boxSizing: "border-box",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "black",
              textAlign: "left",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#000000ff",
              }}
            >
              {sala?.numero}
            </Box>
          </Typography>
        </Box>

        {/* campos de data */}
        <Grid
          container
          spacing={2}
          alignItems="flex-start"
          justifyContent="center"
          sx={{
            maxWidth: 800,
            mx: "auto",
            mb: 2,
          }}
        >
          <Grid item xs={12} md={4}>
            <Box>
              <Typography sx={{ fontSize: "0.9rem", mb: 1 }}>
                Data Início:
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                sx={{
                  background: "#ddd",
                  "& input": { fontSize: "0.85rem", padding: "6px 8px" },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <Typography sx={{ fontSize: "0.9rem", mb: 1 }}>
                Data Fim:
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                sx={{
                  background: "#ddd",
                  "& input": { fontSize: "0.85rem", padding: "6px 8px" },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography sx={{ fontSize: "0.9rem", mb: 1 }}>
              Dias da semana:
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Dias da semana</InputLabel>
              <Select
                multiple
                value={diasSelecionados}
                onChange={(e) => setDiasSelecionados(e.target.value)}
                input={<OutlinedInput label="Dias da semana" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((dia) => (
                  <MenuItem key={dia} value={dia}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* lista de horários */}
      <Box
        sx={{ width: "100%", maxWidth: 600, px: 2, mx: "auto", mt: -5, pb: 3 }}
      >
        {loading ? (
          <Typography textAlign="center">Carregando horários...</Typography>
        ) : erro ? (
          <Typography color="error" textAlign="center">
            Erro ao carregar horários. Tente novamente.
          </Typography>
        ) : horarios.length === 0 ? (
          <Typography textAlign="center">Nenhum horário disponível.</Typography>
        ) : (
          <Grid container spacing={1} justifyContent="center">
            {horarios.map((h) => {
              const selecionado = horariosSelecionados.includes(h.id_periodo);
              return (
                <Grid item xs={6} sm={4} key={h.id_periodo}>
                  <Button
                    fullWidth
                    onClick={() =>
                      !h.reservado && handleToggleHorario(h.id_periodo)
                    }
                    disabled={h.reservado}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "2px",
                      backgroundColor: h.reservado
                        ? "#E56565"
                        : selecionado
                          ? "#ffffff"
                          : "#a5d6a7",
                      color: "black",
                      border: selecionado
                        ? "2px solid #b22222"
                        : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: h.reservado ? "#E56565" : "#81c784",
                      },
                      minHeight: "50px",
                      textTransform: "none",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {`${h.horario_inicio.slice(0, 5)} - ${h.horario_fim.slice(
                        0,
                        5
                      )}`}
                    </Typography>

                    {h.reservado && (
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "0.75rem", color: "#222" }}
                      >
                        {h.usuario || "Desconhecido"}
                      </Typography>
                    )}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Snackbar
          open={alert.visible}
          autoHideDuration={4000}
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

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              background: "red",
              "&:hover": { background: "#c62828" },
              py: 1.5,
            }}
            onClick={handleAbrirModal}
          >
            Reservar
          </Button>
        </Box>
      </Box>

      <ModalReserva
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        reserva={{
          sala: sala?.numero,
          data: `${dataInicio} a ${dataFim}`,
          horario: horariosSelecionados
            .map(
              (id) =>
                horarios
                  .find((h) => h.id_periodo === id)
                  ?.horario_inicio.slice(0, 5) +
                " - " +
                horarios
                  .find((h) => h.id_periodo === id)
                  ?.horario_fim.slice(0, 5)
            )
            .join(", "),
          usuario: nomeUsuario,
        }}
        onConfirm={() => {
          handleReservar();
          setModalOpen(false);
        }}
      />
    </Box>
  );
}
