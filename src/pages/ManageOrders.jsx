import React, { useEffect, useState } from "react";
import { Container, Navbar, ListGroup, Button, Row, Col, Alert, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaArrowLeft, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
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

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update order status");
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      setError(error.message || "Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning" className="d-flex align-items-center"><FaClock className="me-1" /> Pending</Badge>;
      case "Shipped":
        return <Badge bg="primary" className="d-flex align-items-center"><FaTruck className="me-1" /> Shipped</Badge>;
      case "Delivered":
        return <Badge bg="success" className="d-flex align-items-center"><FaCheckCircle className="me-1" /> Delivered</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
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
            onClick={() => navigate("/buyerdashboard")} 
            className="px-3 d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Back
          </Button>
          <Navbar.Brand className="text-white fs-4 mx-auto d-flex align-items-center">
            <FaShoppingBag className="me-2" />
            <strong>Order Management</strong>
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

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="light" />
            <p className="text-white mt-3">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-3">
            <FaShoppingBag size={48} className="text-muted mb-3" />
            <h5>No orders available</h5>
            <p className="text-muted">There are currently no orders to manage</p>
          </div>
        ) : (
          <Row className="justify-content-center g-4">
            <Col lg={10}>
              <ListGroup className="shadow-lg">
                {orders.map((order) => (
                  <ListGroup.Item 
                    key={order._id} 
                    className="p-4 mb-3 border-0 rounded-3"
                    style={{ background: "rgba(255, 255, 255, 0.95)" }}
                  >
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <div className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center mb-2">
                          <h5 className="mb-0 me-3">Order #{order._id.slice(-6).toUpperCase()}</h5>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="d-flex flex-wrap gap-4">
                          <div>
                            <small className="text-muted">Buyer</small>
                            <p className="mb-0 fw-bold">{order.buyerName}</p>
                          </div>
                          <div>
                            <small className="text-muted">Date</small>
                            <p className="mb-0">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <small className="text-muted">Amount</small>
                            <p className="mb-0 fw-bold text-success">₹{order.totalAmount?.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {order.status === "Pending" && (
                          <Button 
                            variant="warning" 
                            size="sm" 
                            onClick={() => updateOrderStatus(order._id, "Shipped")}
                            className="d-flex align-items-center"
                          >
                            <FaTruck className="me-2" /> Mark as Shipped
                          </Button>
                        )}
                        {order.status === "Shipped" && (
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => updateOrderStatus(order._id, "Delivered")}
                            className="d-flex align-items-center"
                          >
                            <FaCheckCircle className="me-2" /> Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ManageOrders;