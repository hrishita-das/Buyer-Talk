import React, { useEffect, useState } from "react";
import { Container, ListGroup, Button, Alert, Navbar, Spinner, Badge } from "react-bootstrap";
import { FaTrash, FaArrowLeft, FaStar, FaRegStar, FaCommentAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch feedback when the component loads
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/feedback");
        if (!response.ok) throw new Error("Failed to fetch feedback");

        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        setMessage({ type: "danger", text: "Error fetching feedback. Please try again later." });
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Feedback deleted successfully!" });
        setFeedbacks(prev => prev.filter(feedback => feedback._id !== id));
      } else {
        throw new Error("Failed to delete feedback");
      }
    } catch (error) {
      setMessage({ type: "danger", text: error.message || "Error deleting feedback." });
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-warning" />
        ) : (
          <FaRegStar key={i} className="text-warning" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="min-vh-100 d-flex flex-column" 
      style={{ 
        background: "linear-gradient(rgba(0, 0, 0, 0.7), url('/buy.avif') no-repeat center center / cover",
        backgroundAttachment: 'fixed'
      }}>

      {/* Navbar */}
      <Navbar expand="lg" className="px-3 py-3"
        style={{ 
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
        }}>
        <Container>
          <Button 
            variant="outline-light" 
            onClick={() => navigate("/AdminDashboard")} 
            className="px-3 d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Back
          </Button>
          <Navbar.Brand className="text-white fs-4 mx-auto">
            <FaCommentAlt className="me-2" />
            <strong>Customer Feedback</strong>
          </Navbar.Brand>
          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      <Container className="my-4 flex-grow-1">
        {message && (
          <Alert 
            variant={message.type} 
            dismissible 
            onClose={() => setMessage(null)}
            className="mt-3"
          >
            {message.text}
          </Alert>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="light" />
            <p className="text-white mt-3">Loading feedback...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-3">
            <FaCommentAlt size={48} className="text-muted mb-3" />
            <h5>No feedback available</h5>
            <p className="text-muted">There are no feedback submissions to display</p>
          </div>
        ) : (
          <ListGroup className="shadow-sm">
            {feedbacks.map((feedback) => (
              <ListGroup.Item 
                key={feedback._id} 
                className="mb-3 rounded-3 border-0 shadow-sm"
                style={{ background: "rgba(255, 255, 255, 0.95)" }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0">
                        <Badge bg="primary" className="me-2">
                          {feedback.companyName}
                        </Badge>
                        {feedback.name}
                      </h5>
                      <div className="d-flex align-items-center">
                        {renderStars(feedback.rating)}
                        <span className="ms-2 text-muted small">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="mb-2 text-muted small">{feedback.email}</p>
                    <p className="mb-0">{feedback.message}</p>
                  </div>
                  <Button 
                    variant="outline-danger" 
                    onClick={() => handleDelete(feedback._id)}
                    size="sm"
                    className="ms-3"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
    </div>
  );
};

export default ManageFeedback;