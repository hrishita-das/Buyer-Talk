import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Button, ListGroup, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const CompanyListPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const { register, handleSubmit, watch } = useForm();
const searchQuery = watch("search", "");

  // Fetch approved companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/companies/approved");
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const selectCompany = (companyId) => {
    navigate(`/placeorder?company=${companyId}`);
  };

  // Filter companies based on search input
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-vh-100 d-flex flex-column"
      style={{ background: "url('/buy.avif') no-repeat center center / cover" }}>

      {/* Navbar */}
      <Navbar
        expand="lg"
        className="px-3 d-flex justify-content-between align-items-center"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
        }}
      >
        <Button 
          variant="outline-light" 
          onClick={() => navigate("/consumerdashboard")} 
          className="d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
        </Button>

        <Navbar.Brand className="text-white fs-4">
          <strong>Choose a Supplier</strong>
        </Navbar.Brand>

        <div></div> {/* Placeholder for spacing alignment */}
      </Navbar>

      {/* Search Form */}
      <Container className="mt-4">
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search for a company..."
            {...register("search")}
            className="shadow-sm"
          />
        </Form>

        {/* Company List */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            {filteredCompanies.length === 0 ? (
              <p className="text-center text-white">No matching companies found.</p>
            ) : (
              <ListGroup>
                {filteredCompanies.map((company, index) => (
                  <ListGroup.Item
                    key={company._id}
                    className="d-flex justify-content-between align-items-center shadow-sm border rounded py-3 px-4 mb-2"
                    style={{ cursor: "pointer", transition: "0.3s", background: "rgba(255, 255, 255, 0.9)" }}
                    onClick={() => selectCompany(company._id)}
                    onMouseOver={(e) => (e.target.style.background = "#f8f9fa")}
                    onMouseOut={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.9)")}
                  >
                    <span className="fw-bold">
                      <span className="text-primary me-2">#{index + 1}</span> {company.name}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CompanyListPage;