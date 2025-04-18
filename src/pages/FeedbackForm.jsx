import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: "Arvinda Enterprise",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Thank you for your feedback!");
        reset();
        navigate("/consumerdashboard");
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column"
      style={{
        backgroundImage: "url('/feedback.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navbar */}
      <Navbar
        expand="lg"
        className="px-3 d-flex justify-content-between align-items-center"
        style={{
          background: "rgba(0, 0, 0, 0.9)", // Slight transparency
    color: "white",
    backdropFilter: "blur(5px)", // Soft blur effect
        }}
      >
        <Button 
          variant="outline-light" 
          onClick={() => navigate("/consumerdashboard")} 
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
        </Button>

        <Navbar.Brand className="text-white fs-4">
          <strong>Feedback</strong>
        </Navbar.Brand>

        <div></div> {/* Placeholder for alignment */}
      </Navbar>

      {/* Feedback Form */}
      <Container className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
        <div className="col-12 col-md-8 col-lg-6 p-4 shadow-lg rounded"
          style={{
            background: "#000", // Solid black background
            color: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h2 className="text-center mb-4">We Value Your Feedback</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Company Name */}
            <Form.Group className="mb-3">
              <Form.Control 
                type="text" 
                readOnly 
                {...register("companyName")} 
                className="border-0 bg-white text-black"
              />
            </Form.Group>

            {/* Email Input */}
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Your Email"
                {...register("email", { required: "Email is required" })}
                className="border-0 bg-white text-black"
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </Form.Group>

            {/* Rating Dropdown */}
            <Form.Group className="mb-3">
              <Form.Select 
                {...register("rating", { required: "Please select a rating" })}
                className="border-0 bg-white text-black"
              >
                <option value="">Rate Us</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </Form.Select>
              {errors.rating && <p className="text-danger">{errors.rating.message}</p>}
            </Form.Group>

            {/* Feedback Message */}
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Your Feedback"
                {...register("message", { required: "Feedback message is required" })}
                rows={4}
                className="border-0 bg-white text-black"
              />
              {errors.message && <p className="text-danger">{errors.message.message}</p>}
            </Form.Group>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary" 
              className="w-100"
              style={{
                backgroundColor: "#007BFF",
                borderColor: "#007BFF",
                fontSize: "18px",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              Submit Feedback
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default FeedbackForm;