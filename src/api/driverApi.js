import API from "./api.js";
export const createDriverAPI = (data) =>
  API.post("/deliveryPartner/create", data);

// GET ALL DRIVERS
export const getDriversAPI = () =>
  API.get("/deliveryPartner");

// DELETE DRIVER
export const deleteDriverAPI = (id) =>
  API.delete(`/deliveryPartner/${id}`);