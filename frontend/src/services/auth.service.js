import api from "./api";

export const signupUser = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Fetch student profile
export const getStudentProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

// Save/update student profile
export const updateStudentProfile = async (profileData) => {
  const response = await api.put("/profile", profileData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};