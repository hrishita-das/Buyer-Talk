import React, { useEffect, useState } from "react";
import { Container, Navbar, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";
import { FaShoppingBag, FaShippingFast, FaComments, FaStar, FaPlus, FaBars, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const userName = localStorage.getItem("userName") || "User";
  const navigate = useNavigate();
  localStorage.setItem("role", "Business");
  const [showSidebar, setShowSidebar] = useState(false);

  const dashboardData = [
    { title: "Manage Orders", color: "bg-primary", icon: <FaShoppingBag />, onClick: () => navigate("/manageorders") },
    { title: "Track Shipments", color: "bg-success", icon: <FaShippingFast />, onClick: () => navigate("/trackshipments") },
    { title: "Chat Support", color: "bg-warning text-dark", icon: <FaComments />, onClick: () => navigate("/chat") },
    { title: "Add Company", color: "bg-secondary text-dark", icon: <FaPlus />, onClick: () => navigate("/addcompany") },
    { title: "Customer Feedback", color: "bg-info", icon: <FaStar />, onClick: () => navigate("/buyerfeedback") },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>
      
      {/* Navbar */}
      <Navbar expand="lg" className="px-3" style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
        <Container className="d-flex justify-content-between align-items-center w-100">
          <Button variant="transparent" className="border-0" onClick={() => setShowSidebar(true)}>
            <FaBars className="fs-3 text-white" />
          </Button>
          <Navbar.Brand className="text-white fs-4 position-absolute start-50 translate-middle-x">
            <FaShoppingBag className="me-2" /> <strong>Buyer Talk</strong>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" style={{ width: "35%", background: "rgba(0, 0, 0, 0.7)", color: "white", backdropFilter: "blur(8px)" }}>
        <Offcanvas.Header closeButton className="border-bottom border-light">
          <Offcanvas.Title className="d-flex align-items-center">
            <FaUser className="me-2" /> {userName}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <div></div>
          <Button 
            variant="light"
            className="w-100 mt-auto"
            style={{ background: "rgba(255, 255, 255, 0.2)", color: "white", border: "none", backdropFilter: "blur(5px)" }}
            onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.4)"}
            onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Welcome Message */}
      <Container className="text-center my-5">
        <h2 className="fw-bold text-white display-6">Welcome, {userName}!</h2>
      </Container>

      {/* Dashboard Cards */}
      <Container>
        <Row className="justify-content-center">
          {dashboardData.map((item, index) => (
            <Col key={index} md={4} sm={6} xs={12} className="mb-4">
              <Card className={`shadow-lg text-center text-white ${item.color}`}
                onClick={item.onClick}
                style={{ cursor: "pointer", borderRadius: "15px", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}>
                <Card.Body className="p-4">
                  <div className="icon mb-2" style={{ fontSize: "2.5rem" }}>{item.icon}</div>
                  <h5 className="fw-bold">{item.title}</h5>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default BuyerDashboard;