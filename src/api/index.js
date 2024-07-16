import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const forgotPassword = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Authenticate/ClientUserForgotPassword?username=${payload}&source=web`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const validateOTP = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/Authenticate/ValidateOTP`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const clientUserResetURL = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Authenticate/ValidateClientUserResetUrl?url=${payload}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const resetEmployeeUserPassword = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ProScoreEmployee/EmployeeResetPassword?employeeId=${payload?.employeeId}&password=${payload?.password}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addLanguageType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/LanguageType/AddLanguageType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllLanguageType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/LanguageType/GetAllLanguageType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteLanguageType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/LanguageType/DeleteLanguageType`,
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

export const singleLanguageType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/LanguageType/GetLanguageType/${payload}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editLanguageType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/LanguageType/UpdateLanguageType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
