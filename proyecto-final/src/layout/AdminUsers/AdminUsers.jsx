import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  bringUsers,
  getUser,
  changeUserRole,
  bringRoles,
} from "../../services/apiCalls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserDetailsModal } from "../../components/UserModal/UserDetailsModal";

export const UserList = () => {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

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
      <Row>
        <Col>
          <h1>Lista de usuarios</h1>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Gestión</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td
                      onClick={() => handleShowModal(user)}
                      style={{ cursor: "pointer" }}
                    >
                      {user.name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <FontAwesomeIcon icon={faEdit} className="me-2" />
                      <FontAwesomeIcon icon={faTrash} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
    </Container>
  );
};
