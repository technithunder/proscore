import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getProjectPerDiem = async (projectId) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetProjectPerDiem/${projectId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getRapidCode = async (jobTitleId) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetAssignJobTitleRapidCode/${jobTitleId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllJobTitles = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/JobCategory/GetAllJobTitle`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllProjectJobTitles = async (payload, projectId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/GetAllProjectJobTitles?projectId=${projectId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNewProjectJobTitle = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/AddProjectJobTitle`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProjectJobTitle = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetProjectJobTitle/${payload}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProjectJobTitle = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/UpdateProjectJobTitle`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteProjectJobTitle = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.delete(`/api/Project/DeleteProjectJobTitle`, {
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

export const getPWCToken = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Authenticate/GetChatBotToken`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProjectWiseCountryAndState = async (projectId) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Project/GetProjectWiseCountryAndState/${projectId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAssignRAPDropDown = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/api/Rap/GetAllAssignRAPDropDown`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAssignRAPWageScaleDropDown = async (rapInfoId) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Rap/GetAllAssignRAPWageScaleDropDown?rapInfoId=${rapInfoId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};
