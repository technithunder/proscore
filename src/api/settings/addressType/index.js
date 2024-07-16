import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getAllAddressType = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/api/AddressType/GetAllAddressTypes`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addAddressType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/AddressType/AddAddressType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const singleAddressType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(
      `/api/AddressType/GetAddressType/${payload}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const editAddressType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/api/AddressType/UpdateAddressType`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteAddressType = async (payload) => {
  let result;
  try {
    result = await axiosInstance.delete(`/api/AddressType/DeleteAddressType`, {
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
