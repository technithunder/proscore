import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});


export const getAllProjectSchedules = async (payload, projectId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/GetAllProjectSchedules?projectId=${projectId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNewProjectSchedule = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/AddProjectSchedule`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProjectSchedule = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetProjectSchedule/${payload}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProjectSchedule = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/UpdateProjectSchedule`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteProjectSchedule = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.delete(
      `/api/Project/DeleteProjectSchedule`,
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
