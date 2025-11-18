import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModalEditarPerfil from "../components/ModalEditarPerfil";
import ConfirmDialog from "../components/ConfirmDialog";

function Perfil() {
  const [userData, setUserData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
  });

  const [alert, setAlert] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const navigate = useNavigate();
  const id_usuario = localStorage.getItem("id_usuario");

  const handleClose = () => {
    setAlert({ ...alert, visible: false });
  };
  const showAlert = (message, type = "info") => {
    setAlert({
      message,
      type,
      visible: true,
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await api.getUserByID(id_usuario);
      setUserData({
        nome: response.data.user.nome || "",
        email: response.data.user.email || "",
        cpf: response.data.user.cpf || "",
        senha: response.data.user.senha || "",
      });
    } catch (error) {
      showAlert(
        error.response?.data?.error || "Erro ao buscar usuário",
        "error"
      );
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.deleteUser(id_usuario);
      localStorage.removeItem("token");
      localStorage.removeItem("authenticated");
      navigate("/");
      showAlert("Usuário deletado com sucesso!", "success");
    } catch (error) {
      showAlert(
        error.response?.data?.error || "Erro ao deletar usuário",
        "error"
      );
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFE9E9",
        display: "flex",
        flexDirection: "column",
        paddingTop: "45px",
        paddingBottom: "30px",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "500px", padding: 2 }}>
        <Box
          sx={{
            backgroundColor: "#B9181D",
            borderRadius: 2,
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              borderRadius: "50%",
              width: 100,
              height: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 1,
            }}
          >
            <AccountCircleIcon sx={{ color: "white", fontSize: 140 }} />
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "white",
              fontWeight: "bold",
              marginBottom: 1,
              textAlign: "center",
            }}
          >
            {userData.nome || "NOME DO USUÁRIO"}
          </Typography>

          <Typography
            sx={{
              color: "white",
              marginBottom: 0.5,
              marginRight: "auto",
              fontWeight: "bold",
            }}
          >
            EMAIL
          </Typography>
          <TextField
            fullWidth
            disabled
            value={userData.email}
            placeholder={userData.email}
            type="text"
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputBase-input": { color: "black" },
              "& .Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
            }}
          />

          <Typography
            sx={{
              color: "white",
              marginBottom: 0.5,
              marginRight: "auto",
              fontWeight: "bold",
            }}
          >
            SENHA
          </Typography>
          <TextField
            fullWidth
            disabled
            value="********"
            placeholder="********"
            type="password"
            sx={{
              marginBottom: 2,
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputBase-input": { color: "black" },
              "& .Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
            }}
          />

          {/* CPF */}
          <Typography
            sx={{
              color: "white",
              marginBottom: 0.5,
              marginRight: "auto",
              fontWeight: "bold",
            }}
          >
            CPF
          </Typography>
          <TextField
            fullWidth
            disabled
            value={userData.cpf}
            placeholder={userData.cpf}
            type="text"
            sx={{
              marginBottom: 2.5,
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiInputBase-input": { color: "black" },
              "& .Mui-disabled": {
                WebkitTextFillColor: "black",
                color: "black",
              },
            }}
          />

          {/* Botões */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#B9181D",
              fontWeight: "bold",
              padding: "10px 20px",
              marginBottom: "10px",
              width: "100%",
              borderRadius: 1,
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
            onClick={() => navigate("/minhasReservas")}
          >
            Minhas Reservas
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#B9181D",
              fontWeight: "bold",
              padding: "10px 20px",
              marginBottom: "10px",
              width: "100%",
              borderRadius: 1,
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
            onClick={() => setOpenModal(true)}
          >
            Editar Perfil
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#B9181D",
              fontWeight: "bold",
              padding: "10px 20px",
              marginBottom: "10px",
              width: "100%",
              borderRadius: 1,
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
            onClick={() => setOpenConfirm(true)}
          >
            Deletar Perfil
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

      <ModalEditarPerfil
        open={openModal}
        onClose={() => setOpenModal(false)}
        userData={userData}
        setUserData={setUserData}
        showAlert={showAlert}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Deseja realmente deletar seu perfil?"
      />
    </Box>
  );
}

export default Perfil;
