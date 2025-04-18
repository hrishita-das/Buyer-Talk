import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";
import { FaShoppingBag, FaShippingFast, FaComments, FaStar, FaInfoCircle, FaUser, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const ConsumerDashboard = () => {
  const userName = localStorage.getItem("userName") || "User";
  const [showFooter, setShowFooter] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  localStorage.setItem("role", "Consumer");

  const toggleFooter = () => {
    setShowFooter((prev) => !prev);
    if (!showFooter) {
      setTimeout(() => {
        document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFooter && !event.target.closest("#footer, .nav-link")) {
        setShowFooter(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showFooter]);

  const handleLogout = () => {
    navigate("/");
  };

  const dashboardData = [
    { title: "Place Order", color: "bg-primary", icon: <FaShoppingBag />, onClick: () => navigate("/placeorder") },
    { title: "Track Order", color: "bg-success", icon: <FaShippingFast />, onClick: () => navigate("/trackorder") },
    { title: "Chat", color: "bg-warning text-dark", icon: <FaComments />, onClick: () => navigate("/chat") },
    { title: "Feedback", color: "bg-info", icon: <FaStar />, onClick: () => navigate("/feedback") },
    { title: "My Orders", color: "bg-secondary", icon: <FaShoppingBag />, onClick: () => navigate("/consumer-orders") }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column"
      style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>

      {/* Navbar */}
      <Navbar
        expand="lg"
        className="px-3 position-relative"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
        }}
      >
        <Container className="d-flex justify-content-between align-items-center w-100">

          {/* Burger Menu Button */}
          <Button variant="transparent" className="border-0" onClick={() => setShowSidebar(true)}>
            <FaBars className="fs-3 text-white" />
          </Button>

          {/* Centered Buyer Talk */}
          <Navbar.Brand className="text-white fs-4 position-absolute start-50 translate-middle-x">
            <FaShoppingBag className="me-2" /> <strong>Buyer Talk</strong>
          </Navbar.Brand>

          {/* About Us Link */}
          <Nav className="ms-auto">
            <Nav.Link className="text-white fs-5" onClick={toggleFooter}>
              <FaInfoCircle className="me-2" /> About Us
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" 
        style={{ width: "35%", background: "rgba(0, 0, 0, 0.7)", color: "white", backdropFilter: "blur(8px)" }}>
        <Offcanvas.Header closeButton className="border-bottom border-light">
          <Offcanvas.Title className="d-flex align-items-center">
            <FaUser className="me-2" /> {userName}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <div></div> {/* Empty div to push logout button to bottom */}
          <Button 
            variant="light"
            className="w-100 mt-auto"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              border: "none",
              backdropFilter: "blur(5px)",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.4)"}
            onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Welcome Section */}
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

      {/* Footer */}
      {showFooter && (
        <footer id="footer" className="bg-black text-white py-5 mt-5 border-top border-light">
          <Container>
            <Row className="pb-3">
              <Col md={5} className="d-flex align-items-center">
                <FaInfoCircle className="me-2" />
                <h3 className="fw-bold mb-0">About Us</h3>
              </Col>
              <Col md={2}></Col>
              <Col md={5} className="text-end d-flex align-items-center">
                <h4 className="fw-bold mb-0">Contact Info</h4>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={5}>
                <p>We provide a seamless platform for users to place and track orders, chat with support, make secure payments, and share feedback.</p>
              </Col>
              <Col md={2}></Col>
              <Col md={5} className="text-end">
                <p>1234 Market St, City, Country</p>
                <p>+91 9724448160</p>
                <p>support@buyertalk.com</p>
              </Col>
            </Row>
          </Container>
        </footer>
      )}
    </div>
  );
};

export default ConsumerDashboard;