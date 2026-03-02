import API from "./api";

// Orders list (pagination)
export const getOrdersAPI = (page, limit) => {
  return API.post("order/getuserorders", {
    limit,
    offset: (page - 1) * limit,
  });
};

// Single order details
export const getSingleOrderAPI = (orderId) => {
  return API.post("order/singleorddetail", {
    orderid: orderId,
  });
};

// Mark out for delivery
export const markOutForDeliveryAPI = (orderId) => {
  return API.post("tuser/markOutForDelivery", {
    order_id: orderId,
  });
};

// Verify OTP
export const verifyDeliveryOTPAPI = (orderId, otp) => {
  return API.post("product/verifyDeliveryOTP", {
    order_id: orderId,
    otp,
  });
};

// Track order
export const trackOrderAPI = (orderId) => {
  return API.post("product/trackOrder", {
    order_id: orderId,
  });
};
export const printInvoiceAPI = (orderId) => {
  return API.get(`invoice/orders/${orderId}/invoice`, {
    responseType: "blob", // 👈 VERY IMPORTANT for PDF
  });
};

export const getAdminOrdersAPI = (page, limit) => {
  return API.post("order/orderdatas", {
    limit,
    offset: (page - 1) * limit,
  });
};
export const markcancelAPI  = (orderId) => {
  return API.post("tuser/markcancelModel", {
    order_id: orderId,
  });
};
