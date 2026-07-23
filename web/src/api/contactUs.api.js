import api from "./axios";

export const sendContactEmail = async (data) => {
  const { data: response } = await api.post("/api/contact-us", data);

  return response;
};