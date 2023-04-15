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

export const getUserData = async (token) => {
  const response = await axios.get(`${root}profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
