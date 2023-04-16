import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getUserData, updateUserData } from "../../services/apiCalls";
import dayjs from "dayjs";

export const UserProfile = () => {
  const token = useSelector((state) => state.auth.token);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isEditable, setIsEditable] = useState(false);

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
    const updatedData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
    };

    try {
      const updatedUserData = await updateUserData(token, updatedData);
      setUserData(updatedUserData);
      setIsEditable(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  return (
    <Container>
      <Row>
        <Col>
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
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled={!isEditable}
                  onChange={handleInputChange}
                />
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
                  <Button variant="primary" onClick={handleEditClick}>
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button variant="success" onClick={handleSaveClick}>
                      Guardar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancelClick}
                      className="ms-2"
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