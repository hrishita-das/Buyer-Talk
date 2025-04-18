import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Navbar, Spinner, Badge } from "react-bootstrap";
import { FaTrash, FaArrowLeft, FaUser, FaUserShield, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch users when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");
      
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      setError({ type: "success", text: "User deleted successfully!" });
    } catch (error) {
      console.error("Error deleting user:", error);
      setError({ type: "danger", text: error.message || "Failed to delete user" });
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return <Badge bg="danger" className="d-flex align-items-center"><FaUserShield className="me-1" /> Admin</Badge>;
      case "Business":
        return <Badge bg="primary" className="d-flex align-items-center"><FaUserTie className="me-1" /> Business</Badge>;
      default:
        return <Badge bg="secondary" className="d-flex align-items-center"><FaUser className="me-1" /> {role}</Badge>;
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
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container>
          <Button 
            variant="outline-light" 
            onClick={() => navigate("/AdminDashboard")} 
            className="px-3 d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" /> Back
          </Button>
          <Navbar.Brand className="text-white fs-4 mx-auto">
            <strong>User Management</strong>
          </Navbar.Brand>
          <div style={{ width: "90px" }}></div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="my-4 flex-grow-1">
        {error && (
          <Alert 
            variant={error.type} 
            dismissible 
            onClose={() => setError(null)}
            className="mt-3"
          >
            {error.text}
          </Alert>
        )}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="light" />
            <p className="text-white mt-3">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-3">
            <FaUser size={48} className="text-muted mb-3" />
            <h5>No users found</h5>
            <p className="text-muted">There are currently no users to manage</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="bg-white shadow-sm rounded-3 overflow-hidden">
              <thead className="bg-dark text-white">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                        className="d-flex align-items-center gap-1"
                      >
                        <FaTrash /> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ManageUsers;