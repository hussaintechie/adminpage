export const getDashboardAPI = (period) => {
  return axios.get(`/dashboard?period=${period}`);
};
