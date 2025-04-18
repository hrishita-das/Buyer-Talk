import React from 'react';
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt,
  faShieldAlt,
  faHandshake
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';

const InfoPopup = ({ type, onClose }) => {
  return (
    <Modal 
      show={true} 
      onHide={onClose} 
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          <FontAwesomeIcon 
            icon={type === "about" ? faShieldAlt : faHandshake} 
            className="me-2"
          />
          {type === "about" ? "About BuyerTalk" : "Contact Our Team"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {type === "about" ? (
          <div className="about-content">
            <h5 className="mb-3">Our Platform</h5>
            <p className="lead">
              <FontAwesomeIcon icon={faHandshake} className="me-2 text-primary" />
              BuyerTalk connects buyers and sellers seamlessly
            </p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FontAwesomeIcon icon={faShieldAlt} className="me-2 text-success" />
                Secure transactions with end-to-end encryption
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-info" />
                Verified sellers from across the globe
              </li>
            </ul>
          </div>
        ) : (
          <div className="contact-content">
            <h5 className="mb-4">How to reach us</h5>
            <div className="contact-item d-flex align-items-center mb-3">
              <FontAwesomeIcon 
                icon={faPhone} 
                className="me-3 text-primary"
                style={{ fontSize: '1.2rem' }}
              />
              <div>
                <h6 className="mb-0">Phone Support</h6>
                <p className="mb-0">+1 (234) 567-8900 (24/7)</p>
              </div>
            </div>
            <div className="contact-item d-flex align-items-center mb-3">
              <FontAwesomeIcon 
                icon={faEnvelope} 
                className="me-3 text-danger"
                style={{ fontSize: '1.2rem' }}
              />
              <div>
                <h6 className="mb-0">Email Support</h6>
                <p className="mb-0">support@buyertalk.com</p>
              </div>
            </div>
            <div className="contact-item d-flex align-items-center">
              <FontAwesomeIcon 
                icon={faMapMarkerAlt} 
                className="me-3 text-success"
                style={{ fontSize: '1.2rem' }}
              />
              <div>
                <h6 className="mb-0">Headquarters</h6>
                <p className="mb-0">1234 Market Street, Suite 500<br />San Francisco, CA 94103</p>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {type === "contact" && (
          <Button variant="primary" onClick={() => window.location.href = "mailto:support@buyertalk.com"}>
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Email Us
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

InfoPopup.propTypes = {
  type: PropTypes.oneOf(['about', 'contact']).isRequired,
  onClose: PropTypes.func.isRequired
};

export default InfoPopup;