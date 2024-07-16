import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addProjectInfo = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/Project/AddProjectInfo`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProjectInfo = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/Project/GetProjectInfo`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProjectInfo = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/Project/UpdateProjectInfo`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};
