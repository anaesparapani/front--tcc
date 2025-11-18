import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import DefaultLayout from "../components/DefaultLayout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import api from "../axios/axios";

function Cadastro() {
  const [user, setUser] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    tipo: "",
  });

  const [alert, setAlert] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    cadastro();
  };

  const passwordVisibility = () => {
    setShowPassword((state) => !state);
  };

  async function cadastro() {
    try {
      const response = await api.postCadastro(user);

      setAlert({
        type: "success",
        message: response.data.message,
        visible: true,
      });

      setUser({
        nome: "",
        email: "",
        cpf: "",
        senha: "",
        tipo: "",
      });
    } catch (error) {
      console.log(error);

      setAlert({
        type: "error",
        message: error.response?.data?.error ?? "Ocorreu um erro inesperado",
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
            CADASTRAR USUÁRIO
          </Typography>

          <TextField
            required
            fullWidth
            id="nome"
            placeholder="Nome"
            name="nome"
            value={user.nome}
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
            id="email"
            placeholder="Email"
            name="email"
            value={user.email}
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
            id="cpf"
            placeholder="CPF"
            name="cpf"
            type="number"
            value={user.cpf}
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
            id="senha"
            placeholder="Senha"
            name="senha"
            type={showPassword ? "text" : "password"}
            value={user.senha}
            onChange={onChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
              borderRadius: 1,
            }}
            InputProps={{
              endAdornment: (
                <Button
                  onClick={passwordVisibility}
                  sx={{ minWidth: "auto", padding: 0, color: "black" }}
                >
                  {showPassword ? (
                    <VisibilityIcon color="disabled" />
                  ) : (
                    <VisibilityOffIcon color="disabled" />
                  )}
                </Button>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            name="tipo"
            label="Tipo"
            value={user.tipo}
            onChange={onChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
              borderRadius: 1,
            }}
          >
            <MenuItem value="Admin">Administrador</MenuItem>
            <MenuItem value="Comum">Comum</MenuItem>
          </TextField>

          <Button
            sx={{
              backgroundColor: "white",
              color: "#B9181D",
              fontWeight: "bold",
              width: "100%",
            }}
            type="submit"
            variant="contained"
          >
            Cadastrar
          </Button>
        </Box>

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
    </DefaultLayout>
  );
}

export default Cadastro;
