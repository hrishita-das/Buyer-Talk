import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Navbar, Button, Card, Form, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faArrowLeft, faCheckCircle, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setValue, watch } = useForm();
  const companyId = new URLSearchParams(location.search).get("company");

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) {
      navigate("/companylist");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Try to fetch products from API first
        const response = await fetch(`http://localhost:5000/api/products?company=${companyId}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          return;
        }

        // Fallback to local data if API fails
        const cncProductNames = [
          { id: 1, name: "CNC Milling Cutter", price: 1250 },
          { id: 2, name: "Precision Lathe Chuck", price: 980 },
          { id: 3, name: "Ball Nose End Mill", price: 750 },
          { id: 4, name: "Carbide Drill Bit", price: 650 },
          { id: 5, name: "Tapered End Mill", price: 850 },
          { id: 6, name: "Coolant Nozzle System", price: 1200 },
        ];
        setProducts(cncProductNames);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [companyId, navigate]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        setValue(`quantity_${product.id}`, 1);
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const onSubmit = (data) => {
    if (cart.length === 0) {
      setError("Please add items to your cart before proceeding");
      return;
    }
    navigate("/cart", { state: { cart, companyId } });
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
            onClick={() => navigate("/companylist")} 
            className="d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
          </Button>
          <Navbar.Brand className="text-white fs-4 mx-auto">
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            <strong>Place Order</strong>
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
            <p className="text-white mt-3">Loading products...</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {products.map((product) => {
                    const cartItem = cart.find((item) => item.id === product.id);
                    return (
                      <div key={product.id} className="col">
                        <Card className="h-100 shadow-sm border-0 overflow-hidden">
                          <Card.Body className="d-flex flex-column">
                            {product.image && (
                              <div className="text-center mb-3" style={{ height: "150px" }}>
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="img-fluid h-100"
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                            )}
                            <Card.Title className="text-center" style={{ minHeight: "3rem" }}>
                              {product.name}
                            </Card.Title>
                            <Card.Text className="text-center text-primary fw-bold fs-5">
                              ₹{product.price}
                            </Card.Text>
                            <div className="mt-auto">
                              {cartItem ? (
                                <div className="d-flex justify-content-center align-items-center">
                                  <Button 
                                    variant="outline-danger" 
                                    onClick={() => removeFromCart(product.id)}
                                    size="sm"
                                  >
                                    <FontAwesomeIcon icon={faMinus} />
                                  </Button>
                                  <Form.Control
                                    type="number"
                                    {...register(`quantity_${product.id}`, { min: 1 })}
                                    className="text-center mx-2"
                                    value={cartItem.quantity}
                                    readOnly
                                    style={{ width: "50px" }}
                                  />
                                  <Button 
                                    variant="outline-success" 
                                    onClick={() => addToCart(product)}
                                    size="sm"
                                  >
                                    <FontAwesomeIcon icon={faPlus} />
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="primary" 
                                  className="w-100"
                                  onClick={() => addToCart(product)}
                                >
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-lg-4">
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-center mb-4">
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Order Summary
                    </Card.Title>
                    
                    {cart.length > 0 ? (
                      <>
                        <div className="flex-grow-1">
                          {cart.map((item) => (
                            <div key={item.id} className="d-flex justify-content-between mb-2">
                              <span>
                                {item.name} (x{item.quantity})
                              </span>
                              <span className="fw-bold">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-top pt-3">
                          <div className="d-flex justify-content-between fw-bold fs-5">
                            <span>Total:</span>
                            <span className="text-success">₹{getTotalPrice()}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-muted my-auto">
                        Your cart is empty
                      </div>
                    )}

                    <Button 
                      type="submit"
                      variant="success" 
                      className="w-100 mt-4"
                      disabled={cart.length === 0}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                      Proceed to Checkout
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Form>
        )}
      </Container>
    </div>
  );
};

export default PlaceOrderPage;