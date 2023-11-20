import { apiRequest } from "./index";

export const CreateTask = async (task) =>
  apiRequest("post", "/api/tasks/create-task", task);

export const GetAllTasks = async (filters) =>
  apiRequest("get", "/api/tasks/get-all-tasks", filters);

export const UpdateTask = async (task) =>
  apiRequest("put", "/api/tasks/update-task", task);

export const DeleteTask = async (id) =>
  apiRequest("delete", "/api/tasks/delete-task", { _id: id });

export const UploadImage = async (payload) => {
  return apiRequest("post", "/api/tasks/upload-image", payload);
};
