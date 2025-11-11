import * as React from "react";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { useNavigate } from "react-router-dom";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const tipo = localStorage.getItem("tipo");

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { label: "HOME", path: "/home" },
    { label: "PERFIL", path: "/profile" },
    { label: "MINHAS RESERVAS", path: "/minhasReservas" },
    ...(tipo === "Admin"
      ? [
          { label: "TODAS RESERVAS", path: "/allReservas"},
          { label: "CADASTRAR USUÁRIO", path: "/cadastro" },
          { label: "VISUALIZAR USUÁRIOS", path: "/users" },
          { label: "CRIAR SALA", path: "/criarSala" },
          
        ]
      : []),
    { label: "SAIR", path: "/" },
  ];

  const handleMenuClick = (item) => {
    if (item.label === "SAIR") {
      setConfirmLogoutOpen(true); 
    } else {
      navigate(item.path);
      setDrawerOpen(false);
    }
  };

  const handleLogoutConfirm = () => {
    setConfirmLogoutOpen(false);
    navigate("/");
    setDrawerOpen(false);
  };

  const handleLogoutCancel = () => {
    setConfirmLogoutOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#C91E1E",
          height: "50px",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        <IconButton onClick={toggleDrawer(true)}>
          <AccountCircleIcon fontSize="large" sx={{ color: "white" }} />
        </IconButton>
      </Box>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 240, backgroundColor: "#C91E1E", height: "100%" }}
          role="presentation"
        >
          <List style={{ marginTop: 35 }}>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.label}
                onClick={() => handleMenuClick(item)}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { color: "white", fontWeight: "bold" },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Dialog
        open={confirmLogoutOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            backgroundColor: "#C91E1E",
            borderRadius: 3,
            padding: 3,
            minWidth: 300,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.4rem",
            paddingBottom: 2,
          }}
        >
          Deseja realmente sair?
        </DialogTitle>

        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{
              color: "#C91E1E",
              backgroundColor: "#fff",
              borderColor: "#fff",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              paddingX: 3,
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "#fff",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="outlined"
            sx={{
              color: "#C91E1E",
              backgroundColor: "#fff",
              borderColor: "#fff",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              paddingX: 3,
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "#fff",
              },
            }}
          >
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Header;
