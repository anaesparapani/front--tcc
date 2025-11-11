import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import Footer from "../components/Footer";
import Calendario from "../components/Calendario";
import Blocos from "../components/Blocos";

export default function Home() {
  const navigate = useNavigate();

  const handleClick = (bloco) => {
    navigate("/salas", { state: { bloco } }); // envia o bloco selecionado
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFE9E9",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Container
        sx={{
          mt: 5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "black", fontWeight: "bold", textAlign: "center", mb: 1 }}
        >
          SEJA BEM-VINDO AO RESERVAS SENAI
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "black", textAlign: "center", mb: 3 }}
        >
          Selecione um bloco para fazer sua reserva:
        </Typography>

        <Blocos handleClick={handleClick} />

        <Typography
          variant="body1"
          sx={{ color: "black", textAlign: "center", mt: -2 }}
        >
          Visualizar salas disponíveis:
        </Typography>

        <Calendario />
      </Container>

      <Footer />
    </Box>
  );
}
