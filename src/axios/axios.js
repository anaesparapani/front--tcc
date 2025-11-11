import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.117:3000/api",
  headers: { accept: "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && error.response.data.auth === false) {
        localStorage.setItem("refresh_token", true);
        localStorage.removeItem("token");
        localStorage.removeItem("authenticated");
        window.location.href = "/";
      } else if (
        error.response.status === 403 &&
        error.response.data.auth === false
      ) {
        localStorage.setItem("refresh_token", true);
        localStorage.removeItem("token");
        localStorage.removeItem("authenticated");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

const sheets = {
  postLogin: (user) => api.post("/user/login", user),
  postCadastro: (user) => api.post("/user/", user),
  updateUser: (data) => api.put("/user/", data),
  getUserByID: (id_usuario) => api.get(`/user/${id_usuario}`),
  deleteUser: (id_usuario) => api.delete(`/user/${id_usuario}`),
  getSalasDisponiveisPorData: (dataSelecionada) =>
    api.get(`/salas/disponiveis?data=${dataSelecionada}`),
  getSalaByBloco: (bloco) => api.get(`/sala/bloco/${bloco}`),
  createReserva: (reserva) => api.post("/reserva/", reserva),
  getAllPeriodos: () => api.get("/periodo/"),
  getUsers: () => api.get("/user"),
  getSala: () => api.get("/sala"),
  createSala: (sala) => api.post("/sala", sala),
  deleteSala: (sala) => api.delete(`/sala/${sala}`),
  getReservasByData: (data) => api.get(`/reservas/data/${data}`),
  getSchedulesByUserID: (id_usuario) =>
    api.get(`/reserva/usuario/${id_usuario}`),
  deletePeriodoReserva: (idReserva, idPeriodo) =>
    api.delete(`/reserva/periodo/${idReserva}/${idPeriodo}`),
  deleteSchedule: (id_reserva) => api.delete(`/reserva/${id_reserva}`),
  getPeriodoStatus: (idSala, data) =>
    api.get("/periodo/status", {
      params: {
        idSala: idSala,
        data: data,
      },
    }),
};

export default sheets;
