import React, { useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import dayjs from "dayjs";

const UserDetailsModal = ({ show, handleClose, user }) => {
  const [activeHeroIndex, setActiveHeroIndex] = useState(null);

  const toggleHeroDetails = (index) => {
    setActiveHeroIndex(index === activeHeroIndex ? null : index);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <h5>Héroes:</h5>
            {user.heroes && user.heroes.length > 0 ? (
              user.heroes.map((hero, index) => (
                <Card key={hero.id}>
                  <Card.Header>
                    <Button
                      variant="link"
                      onClick={() => toggleHeroDetails(index)}
                    >
                      {hero.name}
                    </Button>
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
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
