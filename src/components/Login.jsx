import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import PropTypes from 'prop-types';

const Login = ({ toggleModal }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", data);
      const { token, user } = response.data;

      if (!user) {
        throw new Error("User not found");
      }

      // Store user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name);

      // Determine dashboard route based on role
      const dashboardRoutes = {
        Consumer: "/consumerdashboard",
        Admin: "/admindashboard",
        Business: "/buyerdashboard"
      };

      const route = dashboardRoutes[user.role];
      if (!route) {
        throw new Error("Invalid user role");
      }

      // Close modal and navigate
      toggleModal();
      navigate(route);

    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Role</Form.Label>
          <Form.Select
            {...register("role", { required: "Role is required" })}
            isInvalid={!!errors.role}
          >
            <option value="">Select your role</option>
            <option value="Consumer">Consumer</option>
            <option value="Business">Business</option>
            <option value="Admin">Admin</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.role?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          className="w-100 py-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </Form>
    </div>
  );
};

Login.propTypes = {
  toggleModal: PropTypes.func.isRequired
};

export default Login;