const { apiRequest } = require("./index");

export const CreateProject = async (project) =>
  apiRequest("post", "/api/projects/create-project", project);

export const GetAllProjects = async (filters) =>
  apiRequest("get", "/api/projects/get-all-projects", filters);

export const GetProjectById = async (id) =>
  apiRequest("get", "/api/projects/get-project-by-id", { _id: id });

export const EditProject = async (project) =>
  apiRequest("put", "/api/projects/edit-project", project);

export const DeleteProject = async (id) =>
  apiRequest("delete", "/api/projects/delete-project", { _id: id });

export const GetProjectsByRole = async (userId) =>
  apiRequest("get", "/api/projects/get-projects-by-role", { userId });

export const AddMemberToProject = async (data) =>
  apiRequest("post", "/api/projects/add-member", data);

export const RemoveMemberFromProject = async (data) =>
  apiRequest("post", "/api/projects/remove-member", data);
