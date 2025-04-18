import { Navigate, Outlet } from "react-router-dom";
import PropTypes from 'prop-types';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;  // Better to redirect to unauthorized page
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default PrivateRoute;