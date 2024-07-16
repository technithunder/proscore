import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers['Content-Type'] = 'application/json';

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const getAllAssignRAPWageScale = async (payload, rapInfoId) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Rap/GetAllAssignRAPWageScale?rapInfoId=${rapInfoId}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addAssignRAPWageScale = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Rap/AddAssignRAPWageScale`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateAssignRAPWageScale = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Rap/UpdateAssignRAPWageScale`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteAssignRAPWageScale = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(`/api/Rap/DeleteAssignRAPWageScale`, {
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

export const singleAssignRAPWageScale = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Rap/GetAssignRAPWageScale/${payload}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addAssignRAPWageScaleDetail = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/Rap/AddAssignRAPWageScaleDetail`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAssignRAPWageScaleDetail = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/Rap/GetAllAssignRAPWageScaleDetail/${payload}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllRAPStatusDetail = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/api/Rap/GetRAPStatusDetail/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAssignRAP = async (payload) => {
  let result;
  console.log(payload);
  try {
    result = await axiosInstance.post(`/api/Rap/GetAllAssignRAP`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteAssignRAPWageScaleDetail = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/Rap/DeleteAssignRAPWageScaleDetail?assignRAPWageScaleDetailId=${payload}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllApprentice = async (payload, queryValue) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/rap/GetAllEmployeeApprenticeshipByAssignRapInfoId?assignRapInfoId=${queryValue}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getEmployeeCourse = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/api/lms/GetEmployeeCourses/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};
