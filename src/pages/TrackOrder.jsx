import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Navbar, 
  Button, 
  ProgressBar, 
  Form, 
  ListGroup, 
  Alert, 
  Spinner,
  Badge // Added missing import
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckCircle, faTruck, faBoxOpen, faSearch } from "@fortawesome/free-solid-svg-icons";

const TrackOrder = ({ userType }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/orders?${userType === "consumer" ? `buyerName=${userName}` : ""}`
        );
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
  }, [userName, userType]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order status");
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      setError(error.message || "Failed to update order status");
    }
  };

  const getStatusProgress = (status) => {
    const statusMap = {
      Pending: 25,
      Confirmed: 50,
      Processing: 50,
      Shipped: 75,
      Delivered: 100,
      Cancelled: 100
    };
    return statusMap[status] || 10;
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
      case "Shipped": return faTruck;
      case "Delivered": return faBoxOpen;
      default: return faCheckCircle;
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
      <Navbar
        expand="lg"
        className="px-3 py-3"
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Container>
          <Button 
            variant="outline-light" 
            onClick={() => navigate(userType === "consumer" ? "/consumerdashboard" : "/buyerdashboard")} 
            className="d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
          </Button>
          <Navbar.Brand className="text-white fs-4 mx-auto">
            <strong>Order Tracking</strong>
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

        <div className="position-relative mb-4">
          <Form.Control
            type="text"
            placeholder="Search by Order ID or Buyer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="shadow-sm ps-4"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
          />
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="light" />
            <p className="text-white mt-3">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <ListGroup className="shadow-sm">
            {filteredOrders.map((order) => (
              <ListGroup.Item
                key={order._id}
                className="mb-3 rounded-3 border-0"
                style={{ background: "rgba(255, 255, 255, 0.95)" }}
              >
                <div className="d-flex flex-column">
                  <div className="d-flex flex-wrap justify-content-between mb-3">
                    <div>
                      <h5 className="mb-1">Order #{order._id.slice(-6).toUpperCase()}</h5>
                      <small className="text-muted">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.buyerName}
                      </small>
                    </div>
                    <Badge bg={getStatusVariant(order.status)} className="align-self-start">
                      {order.status}
                    </Badge>
                  </div>

                  <ProgressBar 
                    now={getStatusProgress(order.status)} 
                    variant={getStatusVariant(order.status)}
                    label={`${getStatusProgress(order.status)}%`}
                    className="mb-3"
                    animated={order.status !== "Delivered" && order.status !== "Cancelled"}
                  />

                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                      <strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}
                    </div>
                    {userType === "buyer" && order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => updateOrderStatus(order._id, 
                          order.status === "Shipped" ? "Delivered" : "Shipped"
                        )}
                        className="d-flex align-items-center gap-2"
                      >
                        <FontAwesomeIcon icon={getStatusIcon(order.status)} />
                        {order.status === "Shipped" ? "Mark as Delivered" : "Mark as Shipped"}
                      </Button>
                    )}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-center py-5 bg-light rounded-3">
            <FontAwesomeIcon icon={faBoxOpen} size="3x" className="text-muted mb-3" />
            <h5>No orders found</h5>
            <p className="text-muted">
              {searchQuery ? "Try a different search" : "You don't have any orders yet"}
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default TrackOrder;