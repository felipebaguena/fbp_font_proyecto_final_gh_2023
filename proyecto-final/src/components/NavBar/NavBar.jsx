import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

function NavbarTop() {
  const expand = "md";
  const [showLoginOffcanvas, setShowLoginOffcanvas] = useState(false);
  const [showRegisterOffcanvas, setShowRegisterOffcanvas] = useState(false);

  const handleLoginOffcanvasClose = () => {
    setShowLoginOffcanvas(false);
  };
  const handleLoginOffcanvasShow = () => setShowLoginOffcanvas(true);

  const handleRegisterOffcanvasClose = () => {
    setShowRegisterOffcanvas(false);
  };
  const handleRegisterOffcanvasShow = () => setShowRegisterOffcanvas(true);

  return (
    <Navbar bg="light" expand={expand} className="mb-3">
      <Container fluid>
        <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link onClick={handleLoginOffcanvasShow}>Login</Nav.Link>
            <Nav.Link onClick={handleRegisterOffcanvasShow}>Register</Nav.Link>
            <NavDropdown title="Dropdown" id="navbar-dropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Login Offcanvas */}
      
      <Offcanvas
        show={showLoginOffcanvas}
        onHide={handleLoginOffcanvasClose}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Login</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Register Offcanvas */}
      
      <Offcanvas
        show={showRegisterOffcanvas}
        onHide={handleRegisterOffcanvasClose}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Register</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

    </Navbar>
  );
}

export default NavbarTop;
