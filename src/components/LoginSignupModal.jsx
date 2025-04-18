import React from "react";
import { Modal, Button } from "react-bootstrap";
import Login from "./Login";
import Signup from "./Signup";
import PropTypes from 'prop-types';

const LoginSignupModal = ({ 
  showModal, 
  toggleModal, 
  isSignup, 
  setIsSignup 
}) => {
  const handleToggleAuthMode = () => {
    setIsSignup(prev => !prev);
  };

  return (
    <Modal 
      show={showModal} 
      onHide={toggleModal} 
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton closeVariant="white" className="bg-dark text-white">
        <Modal.Title>
          {isSignup ? "Create Account" : "Login"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {isSignup ? (
          <Signup 
            setIsSignup={setIsSignup} 
            onSuccess={toggleModal}
          />
        ) : (
          <Login 
            toggleModal={toggleModal} 
            setIsSignup={setIsSignup}
          />
        )}
      </Modal.Body>
      
      <Modal.Footer className="justify-content-center">
        <Button 
          variant="link" 
          onClick={handleToggleAuthMode}
          className="text-primary"
        >
          {isSignup ? (
            <>Already have an account? <strong>Log In</strong></>
          ) : (
            <>Do not have an account? <strong>Sign Up</strong></>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

LoginSignupModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  isSignup: PropTypes.bool.isRequired,
  setIsSignup: PropTypes.func.isRequired
};

export default LoginSignupModal;