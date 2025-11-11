import * as React from "react";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios";
import senaiLogo from "../assets/senai_logo.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import fotologin1 from "../assets/fotologin1.png";
import fotologin2 from "../assets/fotologin2.png";

function Login() {
  const [user, setUser] = useState({
    email: "",
    senha: "",
  });
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setAlert({ ...alert, visible: false });
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  const passwordVisibility = () => {
    setShowPassword((state) => !state);
  };

  async function login() {
    try {
      const response = await api.postLogin(user);
      setAlert({
        type: "success",
        message: response.data.message,
        visible: true,
      });

      localStorage.setItem("authenticated", true);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id_usuario", response.data.user.id_user);
      localStorage.setItem("tipo", response.data.user.tipo);

      setTimeout(() => {
        navigate("home/");
      }, 600);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.error || "Ocorreu um erro",
        visible: true,
      });
      console.log(error);
      localStorage.removeItem("refresh_token");
    }
  }

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#FFE9E9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", flexGrow: 1, height: "100%" }}>
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${fotologin1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Formulário central */}
        <Box
          sx={{
            width: "360px",
            backgroundColor: "#AE0000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
          }}
        >
          <img
            src={senaiLogo}
            alt="SENAI Logo"
            style={{ height: "55px", borderRadius: 2 }}
          />

          <Box
            component="form"
            sx={{ mt: 3, width: "100%" }}
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              required
              fullWidth
              id="email"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={onChange}
              sx={{
                marginBottom: 3.5,
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
                marginBottom: 3,
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
            <Button
              sx={{
                mt: 0.5,
                mb: 2,
                backgroundColor: "#FF2A2A",
                borderRadius: 1,
                boxShadow: "none",
                padding: "7px 12px",
                fontSize: "13px",
              }}
              fullWidth
              type="submit"
              variant="contained"
            >
              Login
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${fotologin2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
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
  );
}

export default Login;
