import API from "./api"; // same API instance you already use

// ➕ Create coupon (ADMIN)
export const createCouponAPI = (payload) => {
  return API.post("/coupon/create", payload);
};

// 📋 Get all coupons (ADMIN)
export const getCouponsAPI = () => {
  return API.get("/coupon/all");
};
// ❌ Delete coupon
export const deleteCouponAPI = (coupon_id) => {
  return API.delete(`coupon/delete/${coupon_id}`);
};

