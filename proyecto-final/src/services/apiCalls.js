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

export const getHeroImage = async (imageId, token) => {
  try {
    const response = await axios.get(`${root}hero/image/${imageId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.image_url) {
      return {
        status: "success",
        data: { image_url: response.data.image_url },
      };
    } else {
      console.error("Error fetching hero image:", response.data);
      return { status: "error", error: "Failed to fetch hero image" };
    }
  } catch (error) {
    console.error("Error fetching hero image:", error);
    return { status: "error", error: error };
  }
};

export const getMonsterImage = async (imageId) => {
  try {
    const response = await axios.get(`${root}monster/image/${imageId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data.image_url) {
      return {
        status: "success",
        data: { image_url: response.data.image_url },
      };
    } else {
      console.error("Error fetching monster image:", response.data);
      return { status: "error", error: "Failed to fetch monster image" };
    }
  } catch (error) {
    console.error("Error fetching monster image:", error);
    return { status: "error", error: error };
  }
};

export const updateUserData = async (token, updatedData) => {
  const response = await axios.put(`${root}profile`, updatedData, {
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

export const getHeroesAndItems = async (token) => {
  try {
    const response = await axios.get(`${root}profile/heroes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching heroes and items:", error);
    return [];
  }
};

export const selectHero = async (token, heroId) => {
  try {
    const response = await axios.post(
      `${root}heroes/${heroId}/select`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error selecting hero:", error);
    return null;
  }
};

export const createHero = async (token, body) => {
  try {
    const response = await axios.post(`${root}heroes`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating hero:", error);
    return null;
  }
};

export const getHeroItems = async (token, heroId) => {
  try {
    const response = await axios.get(`${root}hero/${heroId}/items`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hero items:", error);
    return null;
  }
};

export const getItemById = async (token, itemId) => {
  try {
    const response = await axios.get(`${root}items/${itemId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    return null;
  }
};

export const assignRandomItemToSelectedHero = async (token) => {
  try {
    const response = await axios.post(
      `${root}add-item-to-hero`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning random item to selected hero:", error);
    return null;
  }
};

export const assignRandomItemToHeroById = async (token, heroId) => {
  try {
    const response = await axios.post(
      `${root}add-item-to-hero/${heroId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning random item to selected hero:", error);
    return null;
  }
};

export const levelUpHero = async (token, heroId) => {
  try {
    const response = await axios.put(
      `${root}heroes/${heroId}/level-up`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: "success",
      data: response.data.data,
      addedValues: response.data.addedValues,
    };
  } catch (error) {
    console.error("Error leveling up hero:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const createBattle = async (token) => {
  try {
    const response = await axios.post(
      `${root}battles`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating battle:", error);
    return null;
  }
};
