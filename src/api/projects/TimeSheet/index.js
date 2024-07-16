import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getEmployeeTimeSheet = async (employeeId, workDate) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Employee/GetEmployeeTimeEntry/${employeeId}/${workDate}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProjectTimeSheet = async (payload, projectId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/GetProjectPayrollTimeSheetReports?projectId=${projectId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProjectPayrollTimeSheet = async (payload, payrollTimeSheetId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Project/GetProjectPayrollTimeSheet?payrollTimeSheetId=${payrollTimeSheetId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeTimeSheetPDF = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/PdfManagement/UploadEmployeeTimeSheetFromPdf`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
