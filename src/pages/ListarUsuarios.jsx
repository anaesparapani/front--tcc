import React, { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../axios/axios";

function ListarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  const handleClose = () => {
    setAlert({ ...alert, visible: false });
  };

  async function getUsers() {
    try {
      const response = await api.getUsers();
      setUsuarios(response.data.users);
    } catch (error) {
      setAlert({
        message: error.response.data.error,
        type: "error",
        visible: true,
      });
      console.log(error);
    }
  }

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await api.deleteUser(selectedUserId);
      setUsuarios((prev) =>
        prev.filter((usuario) => usuario.id_user !== selectedUserId)
      );

      setOpenConfirm(false);

      setAlert({
        message: response.data.message,
        type: "success",
        visible: true,
      });
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || "Erro ao deletar usuário",
        type: "error",
        visible: true,
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFE9E9",
        display: "flex",
        flexDirection: "column",
        paddingTop: "60px",
        paddingBottom: "60px",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "500px", padding: 2 }}>
        <Box
          sx={{
            backgroundColor: "#B9181D",
            borderRadius: 2,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "white",
              fontWeight: "bold",
              marginBottom: 3,
              textAlign: "center",
            }}
          >
            LISTA DE USUÁRIOS
          </Typography>
          {usuarios.map((usuario) => (
            <Box
              key={usuario.id_user}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                padding: 1.5,
                mb: 1.5,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6" fontSize={18}>
                  {usuario.nome}
                </Typography>
                <Typography variant="body2" color="gray">
                  {usuario.email}
                </Typography>
              </Box>
              <IconButton onClick={() => handleDeleteClick(usuario.id_user)}>
                <DeleteOutlineIcon color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Deseja realmente deletar esse perfil?"
      />

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
  );
}

export default ListarUsuario;
