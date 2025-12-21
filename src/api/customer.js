import API from "./api";

export const getCustomersAPI = ({ page = 1, limit = 10, search = "" }) =>
  API.get(
    `/usercustomer/customers?page=${page}&limit=${limit}&search=${search}`
  );


export const getUserOrdersAPI = (userid) =>
  API.post("/usercustomer/getuserorders", { userid });

export const getSingleOrderDetailAPI = (orderid) =>
  API.post("/tuser/singleorddetail", { orderid });

export const trackOrderAPI = (order_id) =>
  API.post("/tuser/trackOrder", { order_id });


