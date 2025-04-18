import React, { useState, useEffect } from "react";
import { Container, Navbar, Button, Form, Alert, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const AddCompanyPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/companies/user-requests?user=" + localStorage.getItem("userName"));
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching company requests:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/api/companies/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, requestedBy: localStorage.getItem("userName") }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage({ type: "success", text: "Company request sent successfully!" });
      setCompanies([...companies, { name: companyName, status: "Pending", createdAt: new Date().toISOString() }]);
      setCompanyName("");
    } else {
      setMessage({ type: "danger", text: data.error || "Something went wrong." });
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="px-3"
        style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)" }}>
        <Container className="d-flex justify-content-between align-items-center">
          <Button variant="outline-light" onClick={() => navigate("/buyerdashboard")} className="px-3">
            <FaArrowLeft className="me-2" /> Back
          </Button>

          <Navbar.Brand className="text-white fs-4">
          <strong>Add Company</strong>
        </Navbar.Brand>

          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      {/* Content */}
      <Container className="text-center my-4">
        <h2 className="mb-3 text-white">Add Your Company</h2>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        
        {/* Form */}
        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group controlId="companyName">
            <Form.Control
              type="text"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="success" className="mt-3">Add</Button>
        </Form>
      </Container>

      {/* Company Requests Table */}
      <Container className="mt-4">
        <h3 className="text-center text-white">Your Company Requests</h3>
        <Table striped bordered hover variant="light" className="shadow mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Status</th>
              <th>Requested At</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">No company requests found.</td>
              </tr>
            ) : (
              companies.map((company, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{company.name}</td>
                  <td>
                    <span className={`badge ${company.status === "Approved" ? "bg-success" : "bg-warning text-dark"}`}>
                      {company.status}
                    </span>
                  </td>
                  <td>{new Date(company.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AddCompanyPage;