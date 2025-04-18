import { useForm } from "react-hook-form";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import PropTypes from 'prop-types';

const Signup = ({ setIsSignup }) => {
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
      const response = await axios.post("http://localhost:5000/api/users/signup", data);
      console.log(response.data);
      alert("Signup successful! Redirecting to login...");
      setIsSignup(false);
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Sign Up</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            {...register("name", { 
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
              }
            })}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>

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
          <Form.Label>Select Role</Form.Label>
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
          className="w-100"
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Form>
    </div>
  );
};

Signup.propTypes = {
  setIsSignup: PropTypes.func.isRequired
};

export default Signup;