import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addProjectEmployee = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/AddProjectEmployee`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteProjecEmployee = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/DeleteProjectEmployee`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editProjectEmployee = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/UpdateProjectEmployee`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleProjectEmployee = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/GetProjectEmployee/${payload}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllProjectEmployee = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/GetAllProjectEmployee`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllClients = async (payload, projectId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DropDown/GetAllClientsByProjectId?projectId=${projectId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
