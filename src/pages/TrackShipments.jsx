import React, { useEffect, useState } from "react";
import { 
  Container, 
  Alert, 
  Form, 
  Button, 
  Navbar, 
  Accordion, 
  Card, 
  Spinner, 
  ProgressBar, 
  Badge,
  ListGroup // Added missing import
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaArrowLeft, FaBoxOpen, FaSearch, FaCheck, FaTruck, FaShippingFast } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const TrackShipments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) throw new Error("Failed to load orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStep = (status) => {
    const statusMap = {
      Pending: 0,
      Confirmed: 1,
      Processing: 1,
      Shipped: 2,
      Delivered: 3,
      Cancelled: -1
    };
    return statusMap[status] || 0;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Delivered": return "success";
      case "Shipped": return "primary";
      case "Processing":
      case "Confirmed": return "info";
      case "Pending": return "warning";
      case "Cancelled": return "danger";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Shipped": return <FaTruck className="me-1" />;
      case "Delivered": return <FaCheck className="me-1" />;
      case "Processing": return <FaShippingFast className="me-1" />;
      default: return <FaBoxOpen className="me-1" />;
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.buyerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-vh-100 d-flex flex-column"
      style={{ 
        background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/buy.avif') no-repeat center center / cover",
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
            onClick={() => navigate("/buyerdashboard")} 
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Back
          </Button>
          <Navbar.Brand className="text-white fs-4 mx-auto d-flex align-items-center">
            <FaShoppingBag className="me-2" />
            <strong>Track Shipments</strong>
          </Navbar.Brand>
          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="my-4 flex-grow-1">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <div className="position-relative mb-4">
          <Form.Control
            type="text"
            placeholder="Search by Order ID or Buyer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow-sm ps-4"
          />
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="light" />
            <p className="text-white mt-3">Loading shipments...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="row g-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="col-12">
                <Card className="shadow-lg border-0 overflow-hidden">
                  <Card.Body className="p-4" style={{ background: "rgba(255, 255, 255, 0.95)" }}>
                    <div className="d-flex flex-column">
                      {/* Order Header */}
                      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="mb-1">Order #{order._id.slice(-6).toUpperCase()}</h5>
                          <small className="text-muted">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.buyerName}
                          </small>
                        </div>
                        <Badge bg={getStatusVariant(order.status)} className="fs-6">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <ProgressBar 
                        now={getStatusStep(order.status) * 33.33} 
                        variant={getStatusVariant(order.status)}
                        animated={order.status !== "Delivered" && order.status !== "Cancelled"}
                        className="mb-3"
                        style={{ height: "8px" }}
                      />

                      {/* Timeline */}
                      <div className="d-flex justify-content-between text-center mb-3">
                        <div className={`step ${getStatusStep(order.status) >= 0 ? "active" : ""}`}>
                          <div className="mb-1">🟡</div>
                          <small>Pending</small>
                        </div>
                        <div className={`step ${getStatusStep(order.status) >= 1 ? "active" : ""}`}>
                          <div className="mb-1">🔵</div>
                          <small>Confirmed</small>
                        </div>
                        <div className={`step ${getStatusStep(order.status) >= 2 ? "active" : ""}`}>
                          <div className="mb-1">🚚</div>
                          <small>Shipped</small>
                        </div>
                        <div className={`step ${getStatusStep(order.status) >= 3 ? "active" : ""}`}>
                          <div className="mb-1">✅</div>
                          <small>Delivered</small>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}
                        </div>
                        <div>
                          <strong>Items:</strong> {order.items?.length || 0}
                        </div>
                      </div>

                      {/* Order Details Accordion */}
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header className="bg-light">
                            <FaBoxOpen className="me-2" />
                            View Order Details
                          </Accordion.Header>
                          <Accordion.Body className="p-0">
                            {order.items?.length > 0 ? (
                              <ListGroup variant="flush">
                                {order.items.map((item, index) => (
                                  <ListGroup.Item key={index}>
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        <strong>{item.name}</strong>
                                        <div className="text-muted small">Qty: {item.quantity}</div>
                                      </div>
                                      <div className="text-end">
                                        ₹{item.price}
                                        <div className="text-muted small">Total: ₹{(item.price * item.quantity).toFixed(2)}</div>
                                      </div>
                                    </div>
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            ) : (
                              <Alert variant="info" className="m-3">
                                No items found in this order
                              </Alert>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-light rounded-3">
            <FaBoxOpen size={48} className="text-muted mb-3" />
            <h5>No shipments found</h5>
            <p className="text-muted">
              {searchQuery ? "Try a different search" : "You don't have any shipments yet"}
            </p>
          </div>
        )}
      </Container>

      {/* CSS Styles */}
      <style>
        {`
          .step {
            flex: 1;
            color: #6c757d;
            font-weight: 500;
          }
          .step.active {
            color: #212529;
            font-weight: bold;
          }
          .accordion-button:not(.collapsed) {
            background-color: rgba(0,0,0,0.03);
          }
        `}
      </style>
    </div>
  );
};

export default TrackShipments;