import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getPayrollSummaryReport = async (payload, projectId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/PdfManagement/GetAllProjectReports?projectId=${projectId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getFilePreSignedUrl= async (key) => {
  let result;
  try {
    result = await axiosInstance.get(`/api/Project/GetPreSignedFileFromS3?key=${key}`);
  } catch (e) {
    result = e;
  }
  return result;
};