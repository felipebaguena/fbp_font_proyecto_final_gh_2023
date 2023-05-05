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
import { validate } from "../../services/validations";

export function NavbarTop() {
  const [showLoginOffcanvas, setShowLoginOffcanvas] = useState(false);
  const [showRegisterOffcanvas, setShowRegisterOffcanvas] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [password, setPassword] = useState("");
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState(null);

  const displayRegisterSuccess = (name) => {
    setRegisterSuccessMessage(`${name} registrado con éxito`);
    setTimeout(() => {
      setRegisterSuccessMessage(null);
      handleRegisterOffcanvasClose();
    }, 2000);
  };

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expand = "md";

  const handleLoginOffcanvasClose = () => {
    setShowLoginOffcanvas(false);
  };
  const handleLoginOffcanvasShow = () => setShowLoginOffcanvas(true);
  const handleRegisterOffcanvasClose = () => {
    setShowRegisterOffcanvas(false);
  };
  const handleRegisterOffcanvasShow = () => setShowRegisterOffcanvas(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationResult = validate(name, value, true);
    setErrors({ ...errors, [name]: validationResult.message });
  };

  // Manejador para el registro de usuarios

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.formBasicName.value;
    const email = event.target.formBasicEmail.value;
    const password = event.target.formBasicPassword.value;
    const confirmPassword = event.target.formBasicConfirmPassword.value;
    const newErrors = {};
    const nameValidation = validate("name", name, true);
    const emailValidation = validate("email", email, true);
    const passwordValidation = validate("password", password, true);

    if (!nameValidation.validated) newErrors.name = nameValidation.message;
    if (!emailValidation.validated) newErrors.email = emailValidation.message;
    if (!passwordValidation.validated)
      newErrors.password = passwordValidation.message;

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return;
    } else {
      setConfirmPasswordError(null);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await registerUser({ name, email, password });
      console.log(response.data);

      await logMe({ email, password }, dispatch);
      displayRegisterSuccess(name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword !== "" && confirmPassword === password) {
      setConfirmPasswordError(null);
    } else {
      setConfirmPasswordError("Las contraseñas no coinciden");
    }
  };

  // Manejador para el inicio de sesión
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.formBasicEmail.value;
    const password = event.target.formBasicPassword.value;

    const emailValidation = validate("email", email, true);
    if (!emailValidation.validated) {
      setErrors({ email: emailValidation.message });
      return;
    }

    try {
      const response = await logMe({ email, password }, dispatch);
      console.log(response.data);

      handleLoginOffcanvasClose();
      setLoginError(null);
    } catch (error) {
      console.error(error);
      setLoginError("Email o contraseña incorrectos");
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
      className="sega-navbar navbar-font"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/images/logo-juego-s.png"
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
            <Nav.Link as={Link} to="/ranking">
              Ranking
            </Nav.Link>
            {userRole === 2 && (
              <Nav.Link as={Link} to="/users">
                Admin
              </Nav.Link>
            )}
            {token ? (
              <NavDropdown title="Perfil" id="navbar-dropdown" align="end">
                <NavDropdown.Item
                  as={Link}
                  to="/profile"
                  className="navbar-font"
                >
                  Mi perfil
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/myheroes"
                  className="navbar-font"
                >
                  Mis héroes
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="navbar-font"
                >
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
        className="bg-dark text-white navbar-font"
      >
        <Offcanvas.Header closeButton className="white-close-button">
          <Offcanvas.Title className="text-dark">Login</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleLoginSubmit}>
            {loginError && (
              <div className="alert alert-danger" role="alert">
                {loginError}
              </div>
            )}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="text-white">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                isInvalid={!!errors.email}
                onBlur={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="text-white">Contraseña</Form.Label>
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
        className="bg-dark text-white navbar-font"
      >
        <Offcanvas.Header closeButton className="white-close-button">
          <Offcanvas.Title className="text-dark">Register</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {registerSuccessMessage && (
            <div className="alert alert-success" role="alert">
              {registerSuccessMessage}
            </div>
          )}
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="text-white">Nombre</Form.Label>
              <Form.Control
                name="name"
                type="text"
                placeholder="Enter name"
                isInvalid={!!errors.name}
                onBlur={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="text-white">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                isInvalid={!!errors.email}
                onBlur={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="text-white">Contraseña</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                isInvalid={!!errors.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label className="text-white">Repetir contraseña</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                placeholder="Repetir contraseña"
                isInvalid={!!confirmPasswordError}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmPasswordBlur}
              />
              <Form.Control.Feedback type="invalid">
                {confirmPasswordError}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Registro
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}
