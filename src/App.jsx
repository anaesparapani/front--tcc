import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DefaultLayout from "./components/DefaultLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Cadastro from "./pages/Cadastro";
import ListarUsuario from "./pages/ListarUsuarios";
import Perfil from "./pages/Perfil";
import SalasPage from "./pages/Salas";
import ReservaPage from "./pages/Reserva";
import CriarSala from "./pages/CriarSala";
import ListarSalas from "./pages/ListarSalas";
import MinhasReservas from "./pages/MinhasReservas";
import ReservasAdmin from "./pages/ReservasAdmin";

function App() {
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const showAlert = (type, message) => {
    setAlert({
      type,
      message,
      visible: true,
    });
  };

  const handleClose = () => {
    setAlert({ ...alert, visible: false });
  };

  useEffect(() => {
    const isRefreshToken = localStorage.getItem("refresh_token");
    if (isRefreshToken) {
      showAlert("warning", "Sua sessão expirou. Faça login novamente.");
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* Rota de Login - Não protegida */}
          <Route
            path="/"
            element={
              <DefaultLayout headerRender={1}>
                <Login />
              </DefaultLayout>
            }
          />

          {/* Rotas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cadastro"
            element={
              <ProtectedRoute tipo="Admin">
                <Cadastro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salas"
            element={
              <ProtectedRoute>
                <SalasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reserva"
            element={
              <ProtectedRoute>
                <ReservaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute tipo="Admin">
                <ListarUsuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/criarSala"
            element={
              <ProtectedRoute tipo="Admin">
                <CriarSala />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listarSalas"
            element={
              <ProtectedRoute tipo="Admin">
                <ListarSalas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allReservas"
            element={
              <ProtectedRoute tipo="Admin">
                <ReservasAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/minhasReservas"
            element={
              <ProtectedRoute>
                <MinhasReservas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

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
    </>
  );
}

export default App;
