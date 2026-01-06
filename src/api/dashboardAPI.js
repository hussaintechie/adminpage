import API from "./api";
import axios from "axios";

export const getDashboardData = (date, range) => {
  return axios.get("/dashboard", {
    params: {
      date,
      range
    }
  });
};
