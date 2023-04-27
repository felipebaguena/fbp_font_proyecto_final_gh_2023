import React, { useState, useEffect } from "react";
import "./AdminUsers.css";
import { Container, Row, Col, Modal, Button, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  bringUsers,
  getUser,
  changeUserRole,
  bringRoles,
  deleteUser,
} from "../../services/apiCalls";
import { UserDetailsModal } from "../../components/UserModal/UserDetailsModal";

export const UserList = () => {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete && userToDelete.id) {
      try {
        await deleteUser(userToDelete.id, token);
        const updatedUsers = users.filter(
          (user) => user.id !== userToDelete.id
        );
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const handleShowModal = async (user) => {
    setLoading(true);
    try {
      const detailedUser = await getUser(user.id, token);
      setSelectedUser(detailedUser);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleRoleChange = async (roleId) => {
    if (selectedUser && selectedUser.id) {
      setLoading(true);
      try {
        await changeUserRole(selectedUser.id, roleId, token);
        const updatedUser = await getUser(selectedUser.id, token);
        setSelectedUser(updatedUser);
        setShowModal(false);
        setSelectedRole(null);
      } catch (error) {
        console.error("Error changing user role:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Error: selected user is null or does not have an id.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await bringUsers(token);
        const fetchedUsers = response.data;
        if (Array.isArray(fetchedUsers)) {
          setUsers(fetchedUsers);
        } else {
          console.error(
            "Error: bringUsers did not return an array:",
            fetchedUsers
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await bringRoles(token);
        setRoles(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <Container>
      <Row className="custom-modal-content">
        <Col className="pb-3">
          <h1>Lista de usuarios</h1>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <ListGroup>
              {users.map((user, index) => (
                <ListGroup.Item
                  key={user.id}
                  className="d-flex flex-wrap align-items-center custom-modal-content font-size-modal-l custom-modal-content-mames"
                  onClick={() => handleShowModal(user)}
                  action
                >
                  <Col xs={12} sm={6} className="d-flex">
                    <span className="me-2">{index + 1}.</span>
                    <span>{user.name}</span>
                  </Col>
                  <Col
                    xs={12}
                    sm={6}
                    className="d-flex justify-content-between mt-2 mt-sm-0"
                  >
                    <span>{user.email}</span>
                    <div
                      className="custom-delete-button ms-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(user);
                      }}
                    >
                      Eliminar
                    </div>
                  </Col>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
      <UserDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        user={selectedUser}
        roles={roles}
        handleRoleChange={handleRoleChange}
        loading={loading}
      />
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el usuario{" "}
          <strong>{userToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
