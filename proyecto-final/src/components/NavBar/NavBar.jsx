import React, { useEffect, useState } from "react";
import "./NavBar.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, logMe, registerUser } from "../../services/apiCalls";
import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../../authSlice";

export function NavbarTop() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const expand = "md";
  const [showLoginOffcanvas, setShowLoginOffcanvas] = useState(false);
  const [showRegisterOffcanvas, setShowRegisterOffcanvas] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const handleLoginOffcanvasClose = () => {
    setShowLoginOffcanvas(false);
  };
  const handleLoginOffcanvasShow = () => setShowLoginOffcanvas(true);

  const handleRegisterOffcanvasClose = () => {
    setShowRegisterOffcanvas(false);
  };
  const handleRegisterOffcanvasShow = () => setShowRegisterOffcanvas(true);

  // Manejador para el registro de usuarios
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.formBasicName.value;
    const email = event.target.formBasicEmail.value;
    const password = event.target.formBasicPassword.value;

    try {
      const response = await registerUser({ name, email, password });
      console.log(response.data);

      handleRegisterOffcanvasClose();
    } catch (error) {
      console.error(error);
    }
  };

  // Manejador para el inicio de sesión
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.formBasicEmail.value;
    const password = event.target.formBasicPassword.value;

    try {
      const response = await logMe({ email, password }, dispatch);
      console.log(response.data);

      handleLoginOffcanvasClose();
    } catch (error) {
      console.error(error);
    }
  };

  // Manejador para el cierre de sesión
  const handleLogout = () => {
    dispatch(clearToken());
    navigate("/");
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) {
        setUserRole(null);
        return;
      }
      try {
        const response = await getUserData(token);
        const fetchedUserData = response.data;
        setUserRole(fetchedUserData.role_id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserRole();
  }, [token]);

  return (
    <Navbar
      bg="black"
      variant="dark"
      expand={expand}
      className="mb-3 sega-navbar"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src="../../../public/images/logo-juego-s.png"
            alt="Nombre de tu logo"
            height="40"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {userRole === 2 && (
              <NavDropdown title="Admin" id="navbar-dropdown" align="end">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/users">
                  Ver usuarios
                </NavDropdown.Item>{" "}
              </NavDropdown>
            )}
            {token ? (
              <NavDropdown title="Perfil" id="navbar-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profile">
                  Mi perfil
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/myheroes">
                  Mis héroes
                </NavDropdown.Item>
                <NavDropdown.Item href="#">Configuración</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link onClick={handleLoginOffcanvasShow}>Login</Nav.Link>
                <Nav.Link onClick={handleRegisterOffcanvasShow}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Login Offcanvas */}

      <Offcanvas
        show={showLoginOffcanvas}
        onHide={handleLoginOffcanvasClose}
        placement="end"
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton className="white-close-button">
          <Offcanvas.Title className="text-dark">Login</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="text-white">Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="text-white">Password</Form.Label>
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
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton className="white-close-button">
          <Offcanvas.Title className="text-dark">Register</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="text-white">Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="text-white">Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="text-white">Password</Form.Label>
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
