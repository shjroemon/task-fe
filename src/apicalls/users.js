const { apiRequest } = require("./index");

export const RegisterUser = async (payload) =>
  apiRequest("post", "/api/users/register", payload);

export const LoginUser = async (payload) =>
  apiRequest("post", "/api/users/login", payload);

export const GetLoggedInUser = async () =>
  apiRequest("get", "/api/users/logged-in-user");
