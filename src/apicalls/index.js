import axios from "axios";

const BASE_URL = "https://task-be.onrender.com"; // Base URL for the API

export const apiRequest = async (method, endpoint, payload) => {
  try {
    const url = `${BASE_URL}${endpoint}`;

    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("API Request failed");
  }
};
