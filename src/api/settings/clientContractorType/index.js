import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const addClientContractorType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContractType/AddClientContractType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllClientContractorType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContractType/GetAllClientContractType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteClientContractorType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(
      `/api/ClientContractType/DeleteClientContractType`,
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

export const singleClientContractorType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContractType/GetClientContractType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editClientContractorType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/ClientContractType/UpdateClientContractType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};
