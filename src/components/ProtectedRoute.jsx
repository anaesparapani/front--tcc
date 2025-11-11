import { Navigate } from "react-router-dom";
import DefaultLayout from "./DefaultLayout";

const ProtectedRoute = ({ children, tipo }) => {
  const isAuthenticated = localStorage.getItem("authenticated");
  const userTipo = localStorage.getItem("tipo");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (tipo && tipo !== userTipo) {
    return <Navigate to="/home" />;
  }

  return <DefaultLayout headerRender={2}>{children}</DefaultLayout>;
};

export default ProtectedRoute;
