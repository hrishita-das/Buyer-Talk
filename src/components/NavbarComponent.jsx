import React from 'react';
import { Navbar, Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';

const NavbarComponent = ({ toggleOffcanvas, toggleModal }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3 py-2">
      <Container fluid>
        <Button 
          variant="outline-light" 
          onClick={toggleOffcanvas} 
          className="me-3"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        
        <Navbar.Brand className="mx-auto d-flex align-items-center">
          <FontAwesomeIcon 
            icon={faShoppingCart} 
            className="me-2" 
            style={{ fontSize: '1.2rem' }}
          />
          <span style={{ fontSize: "1.5rem", fontWeight: "700" }}>
            BuyerTalk
          </span>
        </Navbar.Brand>
        
        <Button 
          variant="outline-light" 
          onClick={toggleModal}
          className="px-3 py-2 rounded-pill"
          style={{ fontSize: "0.9rem" }}
        >
          Login / Signup
        </Button>
      </Container>
    </Navbar>
  );
};

NavbarComponent.propTypes = {
  toggleOffcanvas: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default NavbarComponent;