const STORE_ID = Number(import.meta.env.VITE_STORE_ID);
import api from "./api";

// GET all categories
export const getCategoriesAPI = () =>
  api.post("/product/allcatedetails", {
    mode_fetchorall: 0,
    cate_id: 0,
    register_id: STORE_ID,
  });

// ADD category
export const addCategoryAPI = (formData) =>
  api.post("/product/neweditcategory", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
;



// UPDATE category
export const updateCategoryAPI = (data) =>
  api.post("/product/neweditcategory", {
    category_name: data.name,
    sts: 1,
    mode: 1,
    catid: data.id,
  });
