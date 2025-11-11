import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

function ConfirmDialog({ open, onClose, onConfirm, title }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#C91E1E",
          borderRadius: 3,
          padding: 1.5,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
          paddingBottom: 2,
        }}
      >
        {title}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          sx={{
            color: "#C91E1E",
            backgroundColor: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            paddingX: 4,
          }}
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            color: "#C91E1E",
            backgroundColor: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            paddingX: 4,
          }}
        >
          Deletar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
