
import { useForm } from "react-hook-form";
import { Container, Navbar, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";
import { FaShoppingBag, FaComments, FaStar, FaInfoCircle, FaSignOutAlt, FaUser, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  // Using useForm instead of useState
  const { setValue, watch } = useForm({
    defaultValues: {
      showSidebar: false,
    },
  });

  const handleSidebarToggle = (value) => {
    setValue("showSidebar", value);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  const adminOptions = [
    { title: "Manage Users", color: "bg-primary", icon: <FaShoppingBag />,onClick: () => navigate("/manage-users") },
    { title: "Manage Feedback", color: "bg-warning text-dark", icon: <FaComments />, onClick: () => navigate("/manage-feedback") },
   // { title: "Analytics", color: "bg-info", icon: <FaStar /> , onClick:() =>navigate("/view-analytics")},
    { title: "Company Requests", color: "bg-dark", icon: <FaInfoCircle />, onClick: () => navigate("/company-requests") },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/adm.avif') no-repeat center center / cover" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="px-3" style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
        <Container className="d-flex justify-content-between align-items-center w-100">
          <Button variant="transparent" className="border-0" onClick={() => handleSidebarToggle(true)}>
            <FaBars className="fs-3 text-white" />
          </Button>
          <Navbar.Brand className="text-white fs-4 position-absolute start-50 translate-middle-x">
            <FaShoppingBag className="me-2" /> <strong>Buyer Talk</strong>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <Offcanvas show={watch("showSidebar")} onHide={() => handleSidebarToggle(false)} placement="start" style={{ width: "35%", background: "rgba(0, 0, 0, 0.7)", color: "white", backdropFilter: "blur(8px)" }}>
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

      {/* Admin Options */}
      <Container fluid>
        <Row className="justify-content-center">
          {adminOptions.map((item, index) => (
            <Col key={index} md={3} sm={6} className="mb-4">
              <Card className={`dashboard-card ${item.color} shadow-lg p-3 text-center text-white card-hover`} style={{ cursor: "pointer" }} onClick={item.onClick} >
                <Card.Body>
                  <div className="icon" style={{ fontSize: "2rem", marginBottom: "10px" }}>{item.icon}</div>
                  <p>{item.title}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;