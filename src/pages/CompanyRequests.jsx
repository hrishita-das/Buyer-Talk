import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Card, Button, Row, Col, Alert, ListGroup } from "react-bootstrap";
import { FaCheck, FaTrash, FaArrowLeft } from "react-icons/fa";

const CompanyRequests = () => {
  const navigate = useNavigate();
  const { setValue, watch } = useForm({
    defaultValues: {
      requests: [],
      approvedCompanies: [],
      message: null,
    },
  });

  useEffect(() => {
    fetchCompanyRequests();
    fetchApprovedCompanies();
  }, []);

  const fetchCompanyRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/companies/pending");
      const data = await response.json();
      setValue("requests", data);
    } catch (error) {
      console.error("Error fetching company requests:", error);
    }
  };

  const fetchApprovedCompanies = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/companies/approved");
      const data = await response.json();
      setValue("approvedCompanies", data);
    } catch (error) {
      console.error("Error fetching approved companies:", error);
    }
  };

  const approveCompany = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/companies/approve/${id}`, { method: "PUT" });
      if (response.ok) {
        setValue("requests", watch("requests").filter((req) => req._id !== id));
        fetchApprovedCompanies();
      }
    } catch (error) {
      console.error("Error approving company:", error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/companies/delete/${id}`, { method: "DELETE" });
      if (response.ok) {
        setValue("requests", watch("requests").filter((req) => req._id !== id));
        setValue("approvedCompanies", watch("approvedCompanies").filter((comp) => comp._id !== id));
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>
      {/* Navbar */}
       <Navbar expand="lg" className="px-3"
             style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
             <Container className="d-flex justify-content-between align-items-center">
               <Button variant="outline-light" onClick={() => navigate("/AdminDashboard")} className="px-3">
                 <FaArrowLeft className="me-2" /> Back
               </Button>
     
               <Navbar.Brand className="text-white fs-4">
                        <strong>Company Request</strong>
                      </Navbar.Brand>
     
               <div style={{ width: "90px" }}></div>
             </Container>
           </Navbar>

      <Container className="mt-4">
        {watch("message") && <Alert variant={watch("message").type}>{watch("message").text}</Alert>}

        {/* Pending Requests */}
        <h2 className="text-center mb-4 text-white">Pending Company Requests</h2>
        <Row className="justify-content-center">
          {watch("requests").length === 0 ? (
            <Col className="text-center">
              <ListGroup>
                <ListGroup.Item className="text-muted text-center">No pending requests</ListGroup.Item>
              </ListGroup>
            </Col>
          ) : (
            watch("requests").map((request) => (
              <Col md={4} key={request._id} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{request.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Requested By: {request.requestedBy}</Card.Subtitle>
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="success" onClick={() => approveCompany(request._id)}>
                        <FaCheck /> Approve
                      </Button>
                      <Button variant="danger" onClick={() => deleteCompany(request._id)}>
                        <FaTrash /> Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Approved Companies */}
        <h2 className="text-center mt-5 mb-4 text-white">Approved Companies</h2>
        <Row className="justify-content-center">
          {watch("approvedCompanies").length === 0 ? (
            <Col className="text-center text-muted">No approved companies</Col>
          ) : (
            watch("approvedCompanies").map((company) => (
              <Col md={4} key={company._id} className="mb-4">
                <Card className="shadow-sm border-success">
                  <Card.Body>
                    <Card.Title>{company.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Approved By: {company.requestedBy}</Card.Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                      <Button variant="danger" onClick={() => deleteCompany(company._id)}>
                        <FaTrash /> Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default CompanyRequests;