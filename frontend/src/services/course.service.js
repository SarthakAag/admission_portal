import api from "./api";

export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};