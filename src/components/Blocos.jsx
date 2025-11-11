import { Button, Typography, Box } from "@mui/material";

// botão individual
function OpcaoBotao({ letra, onClick }) {
  return (
    <Button
      variant="outlined"
      onClick={() => onClick(letra)}
      sx={{
        margin: 1,
        padding: 0,
        borderColor: "#d97d87",
        color: "#bc2c2f",
        backgroundColor: "#f0f4ff",
        width: "60px",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        "&:hover": {
          boxShadow: "0 0 10px rgba(189, 58, 63, 0.5)",
        },
      }}
    >
      <Typography variant="h5" component="span">
        {letra}
      </Typography>
    </Button>
  );
}

// grupo de botões
export default function Blocos({ handleClick }) {
  return (
    <Box display="flex" justifyContent="center" gap={2} mt={-5} mb={4}>
      {["A", "B", "C", "D"].map((letra) => (
        <OpcaoBotao key={letra} letra={letra} onClick={handleClick} />
      ))}
    </Box>
  );
}
