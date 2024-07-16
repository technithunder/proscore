import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addDepartmentType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DepartmentType/AddDepartmentType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllDepartmentType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DepartmentType/GetAllDepartmentType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteDepartmentType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/DepartmentType/DeleteDepartmentType`,
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

export const singleDepartmentType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/DepartmentType/GetDepartmentType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editDepartmentType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/DepartmentType/UpdateDepartmentType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
