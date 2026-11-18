import api from "./api";

// Create a new application draft
export const createApplication = async (applicationData) => {
  const response = await api.post("/applications", applicationData);
  return response.data;
};

// Fetch all applications of the logged-in student
export const getMyApplications = async () => {
  const response = await api.get("/applications");
  return response.data;
};

// Fetch a single application
export const getApplicationById = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}`);
  return response.data;
};

// Update an existing draft
export const updateApplication = async (applicationId, applicationData) => {
  const response = await api.put(
    `/applications/${applicationId}`,
    applicationData
  );
  return response.data;
};

// Submit application
export const submitApplication = async (applicationId) => {
  const response = await api.post(`/applications/${applicationId}/submit`);
  return response.data;
};

// Delete draft application
export const deleteApplication = async (applicationId) => {
  const response = await api.delete(`/applications/${applicationId}`);
  return response.data;
};