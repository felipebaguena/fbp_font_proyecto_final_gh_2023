import React, { useEffect, useState } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";
import dayjs from "dayjs";
import "./UserDetailsModal.css";

export const UserDetailsModal = ({
  show,
  handleClose,
  user,
  roles,
  handleRoleChange,
}) => {
  const [activeHeroIndex, setActiveHeroIndex] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const toggleHeroDetails = (index) => {
    setActiveHeroIndex(index === activeHeroIndex ? null : index);
  };

  const handleSelectRole = (e) => {
    const newSelectedRoleId = e.target.value;
    setSelectedRole(newSelectedRoleId);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"

    >
      <Modal.Header closeButton 
      className="custom-modal-content">
        <Modal.Title>Detalles del usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body
            className="custom-modal-content">
        {user && (
          <>
            <p>ID: {user.id}</p>
            <p>Nombre: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role ID: {user.role_id}</p>
            <p>
              Email verificado en:{" "}
              {user.email_verified_at
                ? dayjs(user.email_verified_at).format("DD MMMM YYYY")
                : "-"}
            </p>
            <p>
              Creado en:{" "}
              {user.created_at
                ? dayjs(user.created_at).format("DD MMMM YYYY")
                : "-"}
            </p>
            <p>
              Actualizado en:{" "}
              {user.updated_at
                ? dayjs(user.updated_at).format("DD MMMM YYYY")
                : "-"}
            </p>
            <p>
              ID de héroe seleccionado: {user.selected_hero_id || "Ninguno"}
            </p>
            <Form>
              <Form.Group controlId="formRoleSelect">
                <Form.Label>Cambiar Rol</Form.Label>
                <Form.Control as="select" onChange={handleSelectRole}>
                  <option value="">Selecciona un rol...</option>
                  {Array.isArray(roles.data) &&
                    roles.data.length > 0 &&
                    roles.data
                      .filter((role) => role.id !== user.role_id)
                      .map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                </Form.Control>
              </Form.Group>
            </Form>
            <div className="mt-2 mb-2">Héroes:</div>
            {user.heroes && user.heroes.length > 0 ? (
              user.heroes.map((hero, index) => (
                <Card className="custom-modal-content modal-text-button font-size-modal-l" key={hero.id}>
                  <Card.Header variant="link" className="pointer-modal"
                      onClick={() => toggleHeroDetails(index)}>
                    <div className="text-hero-modal">
                      {hero.name}
                    </div>
                  </Card.Header>
                  {activeHeroIndex === index && (
                    <Card.Body>
                      <p>Ítems del héroe:</p>
                      {hero.items && hero.items.length > 0 ? (
                        hero.items.map((item) => (
                          <p key={item.id}>- {item.name}</p>
                        ))
                      ) : (
                        <p>No hay ítems disponibles.</p>
                      )}
                    </Card.Body>
                  )}
                </Card>
              ))
            ) : (
              <p>No hay héroes disponibles.</p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="custom-modal-content">
        <Button variant="secondary" className="modal-text-button" onClick={handleClose}>
          Cerrar
        </Button>
        <Button
          variant="primary"
          className="modal-text-button"
          onClick={() => handleRoleChange(selectedRole)}
          disabled={!selectedRole}
        >
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
