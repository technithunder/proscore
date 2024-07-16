import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllClientContractorType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContractType/GetAllClientContractType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
export const getClientContractorTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContractType/GetClientContractType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
export const getAllClientList = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreClient/GetAllProScoreClients`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllProjectClientContractor = async (payload, projectId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/GetAllProjectClientContractor?projectId=${projectId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNewProjectClientContractor = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/AddProjectClientContractor`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProjectClientContractor = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetProjectClientContractor/${payload}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProjectClientContractor = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/UpdateProjectClientContractor`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteProjectClientContractor = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.delete(
      `/api/Project/DeleteProjectClientContractor`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      }
    );
  } catch (e) {
    result = e;
  }
  return result;
};
