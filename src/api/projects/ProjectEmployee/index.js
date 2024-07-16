import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllProjectEmployee = async (payload, projectId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/GetAllProjectEmployee?projectId=${projectId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllNonMappedEmployee = async (projectId,isApprentice) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetAllNonMappedEmployee/${projectId}/${isApprentice}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllMentorList = async (projectId) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetAllMentors/${projectId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeWageScaleList = async (employeeId,projectId) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Rap/GetEmployeeWageScale/${employeeId}/${projectId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeWageScaleDetail = async (employeeId,wageScaleId) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Rap/GetEmployeeWageScaleDetail/${employeeId}/${wageScaleId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNewProjectEmployee = async (payload) => {
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

export const getProjectEmployee = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetProjectEmployee/${payload}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProjectEmployee = async (payload) => {
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

export const deleteProjectEmployee = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.delete(`/api/Project/DeleteProjectEmployee`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    });
  } catch (e) {
    result = e;
  }
  return result;
};
