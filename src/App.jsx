import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComponent from "./components/NavbarComponent";
// import Sidebar from "./components/Sidebar";
// import FloatingInfo from "./components/FloatingInfo";
import InfoPopup from "./components/InfoPopup";
import Login from "./components/Login";
import LoginSignupModal from "./components/LoginSignupModal"; 
import Signup from "./components/Signup";
import FeedbackForm from "./pages/FeedbackForm";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import CompanyListPage from "./components/CompanyListPage";
import CartPage from "./pages/CartPage";
import ConsumerDashboard from "./components/ConsumerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BuyerDashboard from "./components/BuyerDashboard";
import ManageOrders from "./pages/ManageOrders";
import ConsumerOrders from "./pages/ConsumerOrders"; 
import BuyerFeedback from "./pages/BuyerFeedback";
import TrackOrder from "./pages/TrackOrder";
import TrackShipments from "./pages/TrackShipments";
import AddCompanyPage from "./pages/AddCompanyPage"; 
import CompanyRequests from "./pages/CompanyRequests";
import Chatpage from "./pages/Chatpage";
import ManageUsers from "./pages/ManageUsers";
import ManageFeedback from "./pages/ManageFeedback";





const HomePage = ({ toggleModal, toggleOffcanvas, togglePopup, showOffcanvas, showPopup }) => {
  return (
    <div
      className="app d-flex flex-column min-vh-100"
      style={{
        backgroundImage: "url('/cons.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <NavbarComponent toggleModal={toggleModal} toggleOffcanvas={toggleOffcanvas} />
      {/* <Sidebar showOffcanvas={showOffcanvas} toggleOffcanvas={toggleOffcanvas} togglePopup={togglePopup} /> */}
      {/* <FloatingInfo /> */}
      {showPopup && <InfoPopup type={showPopup} onClose={() => togglePopup(null)} />}
    </div>
  );
};

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showPopup, setShowPopup] = useState(null);

  const toggleModal = () => {
    setIsSignup(false);
    setShowModal(!showModal);
  };

  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);
  const togglePopup = (type) => setShowPopup((prevType) => (prevType === type ? null : type));

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
        <Route path="/companylist" element={<CompanyListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/manageorders" element={<ManageOrders />} />
        <Route path="/consumer-orders" element={<ConsumerOrders />} />
        <Route path="/buyerfeedback" element={<BuyerFeedback />} />
        <Route path="/trackorder" element={<TrackOrder userType="consumer" />} />
        <Route path="/trackshipments" element={<TrackShipments />} />
        <Route path="/addcompany" element={<AddCompanyPage />} />
        <Route path="/company-requests" element={<CompanyRequests />} />
        <Route path="/chat" element={<Chatpage />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-feedback" element={<ManageFeedback />} />
        

      


        <Route element={<PrivateRoute allowedRoles={["Consumer"]} />}>
          <Route path="/consumerdashboard" element={<ConsumerDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["Business"]} />}>
          <Route path="/buyerdashboard" element={<BuyerDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["Admin"]} />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Route>
        
        

        {/* Default Home Page */}
        <Route
          path="/"
          element={
            <HomePage
              toggleModal={toggleModal}
              toggleOffcanvas={toggleOffcanvas}
              togglePopup={togglePopup}
              showOffcanvas={showOffcanvas}
              showPopup={showPopup}
            />
          }
        />
      </Routes>

      {/* Login & Signup Modal */}
      {showModal && <LoginSignupModal showModal={showModal} toggleModal={toggleModal} isSignup={isSignup} setIsSignup={setIsSignup} />}
    </Router>
  );
};

export default App;