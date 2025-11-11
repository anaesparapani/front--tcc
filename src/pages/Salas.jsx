import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import api from "../axios/axios";

export default function SalasPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const blocoSelecionadoInicial = location.state?.bloco || "A";
  const dataSelecionada = location.state?.data; // data enviada pelo calendário

  const [salas, setSalas] = useState([]);
  const [search, setSearch] = useState("");
  const [blocoSelecionado, setBlocoSelecionado] = useState(
    blocoSelecionadoInicial
  );

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        let salasObtidas = [];

        if (dataSelecionada) {
          const res = await api.getSalasDisponiveisPorData(dataSelecionada);

          salasObtidas = Object.values(res.data.salasDisponiveis).flat();
        } else {
          const res = await api.getSalaByBloco(blocoSelecionado);
          salasObtidas = res.data.salas || [];
        }

        setSalas(salasObtidas);
      } catch (err) {
        console.error("Erro ao buscar salas:", err);
        setSalas([]);
      }
    };

    fetchSalas();
  }, [blocoSelecionado, dataSelecionada]);

  {/*pesquisar*/}
  const salasFiltradas = salas.filter(
    (s) =>
      s.numero?.toString().toLowerCase().includes(search.toLowerCase()) ||
      s.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardClick = (sala) => {
    navigate("/reserva", { state: { sala, data: dataSelecionada } });
  };

  return (
    <Box sx={{ backgroundColor: "#FFE9E9", minHeight: "100vh", p: 2 }}>
      <Container sx={{ pt: "80px" }}>
        {/* Topo */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <TextField
            variant="outlined"
            placeholder="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ background: "#fff", flex: 1, mr: 2 }}
          />
          {!dataSelecionada && (
            <TextField
              select
              value={blocoSelecionado}
              onChange={(e) => setBlocoSelecionado(e.target.value)}
              sx={{ width: 120, background: "#fff" }}
              label="Bloco"
            >
              {["A", "B", "C", "D"].map((bloco) => (
                <MenuItem key={bloco} value={bloco}>
                  {bloco}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>

        {/* Cards de salas */}
        <Grid container spacing={2}>
          {salasFiltradas.length === 0 ? (
            <Typography textAlign="center" sx={{ width: "100%" }}>
              Nenhuma sala disponível{dataSelecionada ? " nesta data." : "."}
            </Typography>
          ) : (
            salasFiltradas.map((sala, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  onClick={() => handleCardClick(sala)}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{
                        backgroundColor: "#bc2c2f",
                        color: "white",
                        borderRadius: 1,
                        p: 1,
                        mb: 2,
                      }}
                    >
                      {sala.numero} - {sala.descricao}
                    </Typography>

                    <Typography>Capacidade: {sala.capacidade}</Typography>
                    <Typography>Bloco: {sala.bloco}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}
