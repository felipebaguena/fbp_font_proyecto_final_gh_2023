import axios from "axios";
import { saveToken, saveUser } from "../authSlice";

const root = "http://localhost:8000/api/";

export const registerUser = async (body) => {
  return await axios.post(`${root}register`, body);
};

export const logMe = async (data, dispatch) => {
  const response = await axios.post(`${root}login`, data);
  const { token, user } = response.data;
  dispatch(saveToken(token));
  dispatch(saveUser(user));
  return response;
};

export const bringUsers = async (token) => {
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  return await axios.get(`${root}users`, config);
};

export const getUser = async (id, token) => {
  const response = await axios.get(`${root}users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserData = async (token) => {
  const response = await axios.get(`${root}profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const bringRoles = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return await axios.get(`${root}roles`, config);
};

export const changeUserRole = async (id, roleId, token) => {
  try {
    const response = await axios.put(
      `${root}user/${id}/change-role/${roleId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing user role:", error);
    throw error;
  }
};
