import React, { useEffect, useState } from "react";
import { Container, Alert, Button, Card, Navbar, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBox, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const ConsumerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/orders?buyerName=${userName}`);
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

    fetchUserOrders();
  }, [userName]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="text-success me-2" />;
      case "Pending":
        return <FaClock className="text-warning me-2" />;
      default:
        return <FaTimesCircle className="text-danger me-2" />;
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" 
      style={{ 
        background: "linear-gradient(rgba(0, 0, 0, 0.7), url('/buy.avif') no-repeat center center / cover",
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
            onClick={() => navigate("/consumerdashboard")} 
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Back
          </Button>
          <Navbar.Brand className="text-white fs-4 mx-auto">
            <FaBox className="me-2" />
            <strong>My Orders</strong>
          </Navbar.Brand>
          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      {/* Orders Section */}
      <Container className="my-4 flex-grow-1">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="light" />
            <p className="text-white mt-3">Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {orders.map((order) => (
              <div key={order._id} className="col">
                <Card className="h-100 shadow-sm border-0 overflow-hidden">
                  <Card.Header 
                    className={`py-3 ${
                      order.status === "Completed" ? "bg-success" :
                      order.status === "Pending" ? "bg-warning" : "bg-danger"
                    } text-white`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </strong>
                      <small>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-3">
                      <h6 className="mb-2">Order #{order._id.slice(-6).toUpperCase()}</h6>
                      <ul className="list-group list-group-flush">
                        {order.items?.map((item, index) => (
                          <li key={index} className="list-group-item px-0 py-2 d-flex justify-content-between">
                            <span>{item.name}</span>
                            <span className="text-muted">x{item.quantity}</span>
                          </li>
                        )) || <li className="list-group-item px-0 py-2">No items found</li>}
                      </ul>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Amount:</span>
                        <strong className="text-success">₹{order.totalAmount?.toFixed(2)}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Delivery Status:</span>
                        <span className={`${
                          order.deliveryStatus === "Delivered" ? "text-success" :
                          order.deliveryStatus === "Shipped" ? "text-primary" : "text-warning"
                        }`}>
                          {order.deliveryStatus || "Processing"}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-light rounded-3">
            <FaBox size={48} className="text-muted mb-3" />
            <h5>No orders found</h5>
            <p className="text-muted">You have not placed any orders yet</p>
            <Button 
              variant="primary" 
              onClick={() => navigate("/consumerdashboard")}
              className="mt-3"
            >
              Browse Products
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ConsumerOrders;