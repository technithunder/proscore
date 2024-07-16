import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllEmployementTermType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/EmploymentTermType/GetAllEmploymentTermType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
