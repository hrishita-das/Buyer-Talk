import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart] = useState(location.state?.cart || []);

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const placeOrder = async () => {
    console.log("Cart Items Before Sending:", cart); 
    const order = {
      items: cart, 
      totalAmount: getTotalPrice(),
      status: "Pending",
      buyerName: localStorage.getItem("userName") || "Unknown",
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      const result = await response.json();
      console.log("Order Response:", result);  

      if (response.ok) {
        alert("Order placed successfully!");
        navigate("/consumerdashboard", { state: { order } }); // Navigate after order placement
      } else {
        alert("Failed to place the order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/placeorder")}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <h2 className="text-center">Your Cart</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total Amount: ₹{getTotalPrice()}</h4>

      <button className="btn btn-success w-100 mt-3" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
};

export default CartPage;