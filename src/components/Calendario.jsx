import React, { useState } from "react";
import { Box, IconButton, Typography, Grid } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);
  const navigate = useNavigate();

  const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]; // cabeçalho

  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset)
    );
    setSelectedDays([]);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // dia da semana do 1º dia
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate(); // último dia do mês

  // cria os quadradinhos do calendário
  const days = [
    ...Array(firstDayOfMonth).fill(""),
    ...Array.from({ length: lastDayOfMonth }, (_, i) => i + 1),
  ];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day)); // remove se já estava
    } else {
      setSelectedDays([...selectedDays, day]); // adiciona se não estava
    }
  };

  const handleDayClick = (day) => {
    if (!day) return;

    toggleDay(day);

    const selectedDate = new Date(year, month, day).toISOString().split("T")[0];
    navigate("/salas", { state: { data: selectedDate } }); // envia a data pra tela salas
  };

  return (
    <Box
      sx={{
        width: 300,
        border: "1px solid #B92626",
        borderRadius: 2,
        p: 2,
        bgcolor: "white",
      }}
    >
      {/* Cabeçalho do calendário */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton onClick={() => changeMonth(-1)}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h6">
          {currentDate.toLocaleString("pt-BR", { month: "long" })} {year} {/* nome do mês */}
        </Typography>

        <IconButton onClick={() => changeMonth(1)}>
          <ArrowForward />
        </IconButton>
      </Box>

      {/* Cabeçalho dos dias da semana */}
      <Grid container>
        {daysOfWeek.map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography align="center" sx={{ fontWeight: "bold" }}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Dias do mês */}
      <Grid container sx={{ minHeight: 200 }}>
        {days.map((day, index) => (
          <Grid item xs={12 / 7} key={index}>
            <Box
              onClick={() => handleDayClick(day)}
              sx={{
                m: 0.5,
                p: 1,
                borderRadius: "50%",
                bgcolor: selectedDays.includes(day)
                  ? "#c9c9c9ff" // cor se selecionado
                  : "transparent",
                color: day
                  ? selectedDays.includes(day)
                    ? "white"
                    : "black"
                  : "#ccc",
                cursor: day ? "pointer" : "default",
                transition: "0.2s",
                "&:hover": {
                  bgcolor:
                    day && !selectedDays.includes(day) ? "#e0e0e0" : undefined,
                },
              }}
            >
              <Typography align="center">{day}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Calendario;
