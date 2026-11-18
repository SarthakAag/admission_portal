import api from "./api";

// Upload document
export const uploadDocument = async (applicationId, file, type) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("type", type);

  const response = await api.post(
    `/documents/${applicationId}/upload`,
    formData
  );

  return response.data;
};

// Get documents for an application
export const getApplicationDocuments = async (applicationId) => {
  const response = await api.get(`/documents/${applicationId}`);
  return response.data;
};

// Delete document
export const deleteDocument = async (applicationId, documentId) => {
  const response = await api.delete(
    `/documents/${applicationId}/${documentId}`
  );

  return response.data;
};
// View document
export const viewDocument = async (applicationId, documentId) => {
  const response = await api.get(
    `/documents/${applicationId}/${documentId}/view`,
    { responseType: "blob" }
  );

  const fileURL = URL.createObjectURL(response.data);
  window.open(fileURL, "_blank");
};

// Download document
export const downloadDocument = async (applicationId, documentId, fileName) => {
  const response = await api.get(
    `/documents/${applicationId}/${documentId}/download`,
    { responseType: "blob" }
  );

  const fileURL = URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = fileURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(fileURL);
};