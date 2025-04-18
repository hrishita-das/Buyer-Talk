import React, { useEffect, useState } from "react";
import { Container, Card, Navbar, Button } from "react-bootstrap";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const BuyerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/feedback");
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="px-3"
        style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
        <Container className="d-flex justify-content-between align-items-center">
          <Button variant="outline-light" onClick={() => navigate("/buyerdashboard")} className="px-3">
            <FaArrowLeft className="me-2" /> Back
          </Button>

          <Navbar.Brand className="text-white fs-4">
                   <strong>FeedBack</strong>
                 </Navbar.Brand>

          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      {/* Feedback Section */}
      <Container className="my-5">
        <h2 className="text-center text-white">Customer Feedback</h2>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <Card key={index} className="mb-3 p-3 shadow bg-light">
              <Card.Body>
                <FaStar className="text-warning me-2" />
                <strong>Buyer Talk</strong>
                <p className="fst-italic">{feedback.message}</p>
                <small>{new Date(feedback.createdAt).toLocaleString()}</small>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-center text-white">No feedback available.</p>
        )}
      </Container>
    </div>
  );
};

export default BuyerFeedback;