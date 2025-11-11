import React, { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem, Snackbar, Alert } from "@mui/material";
import DefaultLayout from "../components/DefaultLayout";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios";

function CriarSala() {
  const [sala, setSala] = useState({
    numero: "",
    descricao: "",
    capacidade: "",
    bloco: "",
  });

  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setSala({ ...sala, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createSala();
  };

  async function createSala() {
    try {
      const response = await api.createSala(sala);

      setAlert({
        type: "success",
        message: response.data.message,
        visible: true,
      });

      setSala({
        numero: "",
        descricao: "",
        capacidade: "",
        bloco: "",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.error || "Ocorreu um erro",
        visible: true,
      });
    }
  }

  const handleClose = () => {
    setAlert({ ...alert, visible: false });
  };

  return (
    <DefaultLayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#FFE9E9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#B9181D",
            borderRadius: 2,
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: "white", marginBottom: 2 }}>
            CRIAR SALA
          </Typography>

          <TextField
            required
            fullWidth
            id="numero"
            placeholder="Sala"
            name="numero"
            value={sala.numero}
            onChange={onChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
          <TextField
            required
            fullWidth
            id="descricao"
            placeholder="Descrição"
            name="descricao"
            value={sala.descricao}
            onChange={onChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />
          <TextField
            required
            fullWidth
            id="capacidade"
            placeholder="Capacidade"
            name="capacidade"
            type="number"
            value={sala.capacidade}
            onChange={onChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
              borderRadius: 1,
            }}
          />

          <TextField
            select
            fullWidth
            name="bloco"
            label="Bloco"
            value={sala.bloco}
            onChange={onChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
              borderRadius: 1,
            }}
          >
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
            <MenuItem value="D">D</MenuItem>
          </TextField>

          <Button
            sx={{
              backgroundColor: "white",
              color: "#B9181D",
              fontWeight: "bold",
              width: "100%",
              marginBottom: "15px"
            }}
            type="submit"
            variant="contained"
          >
            Criar
          </Button>
          <Button
            sx={{
              backgroundColor: "white",
              color: "#B9181D",
              fontWeight: "bold",
              width: "100%",
            }}
            variant="contained"
            onClick={() => navigate("/listarSalas")}

          >
            Listar Salas
          </Button>
        </Box>

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
      </Box>
    </DefaultLayout>
  );
}

export default CriarSala;
