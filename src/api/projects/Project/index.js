import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllProjectDocumentTypes = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProjectDocumentType/GetAllProjectType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllProjects = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.post(`/api/Project/GetAllProject`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const generatePDF = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.post(
      `/api/PdfManagement/DownloadFilledPdf?projectId=${payload?.projectId}&weekEndingDate=${payload?.weekEndingDate}&clientId=${payload?.clientId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllWorkType = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.post(`/api/WorkType/GetAllWorkType`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNewProject = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/Project/AddProject`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProject = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(`/api/Project/GetProject/${payload}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProject = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/Project/UpdateProject`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteProject = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.delete(`/api/Project/DeleteProject`, {
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

export const GetAllClients = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/DropDown/GetAllClients`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const GetClients = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(`/api/Client/GetAllClients`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const GetAllProject = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/DropDown/GetAllPojects`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const generateSampleExcel = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.post(
      `/api/ExcelManagement/DownloadExcelEmployeePayrollDetails1?projectId=${payload?.projectId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const SubmitExcel = async (payload, projectId, clientId) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.post(
      `/api/ExcelManagement/UploadExcelEmployeePayrollDetails?projectId=${projectId}&clientId=${clientId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const SubmitTimeSheetExcel = async (payload, projectId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ExcelManagement/UploadExcelProjectEmployeePayrollTimeSheet?projectId=${projectId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
