import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getUserData, updateUserData } from "../../services/apiCalls";
import dayjs from "dayjs";
import { validate } from "../../services/validations";
import "./Profile.css";

export const UserProfile = () => {
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isEditable, setIsEditable] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData(token);
        setUserData(data);
        setFormData({ name: data.data.name, email: data.data.email });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const nameValidation = validate("name", name, true);
    const emailValidation = validate("email", email, true);
    const passwordValidation = isEditable
      ? validate("password", password, true)
      : { validated: true };

    let newErrors = {};

    if (!nameValidation.validated) {
      newErrors.name = nameValidation.message;
    }

    if (!emailValidation.validated) {
      newErrors.email = emailValidation.message;
    }

    if (!passwordValidation.validated) {
      newErrors.password = passwordValidation.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedData = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const updatedUserData = await updateUserData(token, updatedData);
      setUserData(updatedUserData);
      setIsEditable(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditable(false);
    setErrors({});
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} lg={8} className="custom-modal-content">
          <h1>Perfil de usuario</h1>
          {userData ? (
            <Form>
              <Form.Group>
                <Form.Label htmlFor="name">Nombre</Form.Label>
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  disabled={!isEditable}
                  isInvalid={errors.name}
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  // disabled={!isEditable}
                  disabled={true}
                  isInvalid={errors.email}
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Nueva contraseña</Form.Label>
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  disabled={!isEditable}
                  isInvalid={errors.password}
                  placeholder="Introduce una nueva contraseña"
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="createdAt">
                <Form.Label>Fecha de creación</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    userData.data.created_at
                      ? dayjs(userData.data.created_at).format("DD MMMM YYYY")
                      : ""
                  }
                  disabled={true}
                />
              </Form.Group>
              <div className="d-flex">
                {!isEditable ? (
                  <Button
                    variant="primary"
                    onClick={handleEditClick}
                    className="inventory-button edit-button-profile font-size-modal-l"
                  >
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="success"
                      onClick={handleSaveClick}
                      className="edit-button-profile"
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancelClick}
                      className="ms-2 edit-button-profile font-size-modal-l"
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </Form>
          ) : (
            <p>Cargando datos del usuario...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};
