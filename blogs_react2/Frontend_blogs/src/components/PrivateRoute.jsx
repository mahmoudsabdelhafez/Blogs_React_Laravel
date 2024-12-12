import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("TOKEN");

  if (!token) {
    // If no token, redirect to login page (or any other page you prefer)
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
