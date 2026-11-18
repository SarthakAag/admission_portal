import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApplicationProgress from "../components/ApplicationProgress";

import {
  getApplicationById,
  submitApplication,
  deleteApplication,
} from "../services/application.service";

import {
  uploadDocument,
  getApplicationDocuments,
  deleteDocument,
  viewDocument,
  downloadDocument,
} from "../services/document.service";

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Loader2,
  Trash2,
  Send,
  AlertCircle,
  Upload,
  File,
  Eye,
  Download,
} from "lucide-react";

const documentTypes = [
  { value: "PHOTO", label: "Passport Size Photo" },
  { value: "SIGNATURE", label: "Signature" },
  { value: "CLASS_10_MARKSHEET", label: "Class 10 Marksheet" },
  { value: "CLASS_12_MARKSHEET", label: "Class 12 Marksheet" },
  { value: "TRANSFER_CERTIFICATE", label: "Transfer Certificate" },
  { value: "ENTRANCE_SCORECARD", label: "Entrance Scorecard" },
  { value: "ID_PROOF", label: "ID Proof" },
  { value: "OTHER", label: "Other Document" },
];

const requiredDocuments = [
  "PHOTO",
  "SIGNATURE",
  "CLASS_10_MARKSHEET",
  "CLASS_12_MARKSHEET",
  "ID_PROOF",
];

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [deleteDocumentLoading, setDeleteDocumentLoading] = useState(null);
  const [viewDocumentLoading, setViewDocumentLoading] = useState(null);
  const [downloadDocumentLoading, setDownloadDocumentLoading] = useState(null);

  const [error, setError] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [missingDocuments, setMissingDocuments] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Fetch application
  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getApplicationById(id);
      setApplication(response.application);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load application details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await getApplicationDocuments(id);
      setDocuments(response.documents || []);
    } catch (err) {
      setDocumentError(
        err.response?.data?.message || "Unable to load documents."
      );
    }
  };

  useEffect(() => {
    fetchApplication();
    fetchDocuments();
  }, [id]);

  // Submit application
  const handleSubmitApplication = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to submit this application? You won't be able to edit it afterward."
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setMissingDocuments([]);
      setSubmissionSuccess("");

      await submitApplication(id);

      setSubmissionSuccess("Your application has been submitted successfully!");

      await fetchApplication();
      await fetchDocuments();
    } catch (err) {
      const responseData = err.response?.data;

      setError(
        responseData?.message || "Failed to submit application."
      );

      // Capture missing document types returned by the backend
      const missing = responseData?.missingDocuments || [];
      setMissingDocuments(missing);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete application
  const handleDeleteApplication = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this draft application? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await deleteApplication(id);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete application."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Select file
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setDocumentError("");
    setUploadSuccess("");
    setSelectedFile(null);

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setDocumentError(
        "Only PDF, JPG, JPEG, and PNG files are allowed."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setDocumentError("File size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Upload document
  const handleUploadDocument = async (event) => {
    event.preventDefault();

    if (!selectedFile || !selectedType) {
      setDocumentError("Please select a document type and file.");
      return;
    }

    try {
      setUploadLoading(true);
      setDocumentError("");
      setUploadSuccess("");

      await uploadDocument(id, selectedFile, selectedType);

      setUploadSuccess("Document uploaded successfully!");
      setSelectedFile(null);
      setSelectedType("");

      // Clear previous submission validation warnings
      setMissingDocuments([]);
      setError("");
      setSubmissionSuccess("");

      const fileInput = document.getElementById("document-file");
      if (fileInput) fileInput.value = "";

      await fetchDocuments();
      await fetchApplication();
    } catch (err) {
      setDocumentError(
        err.response?.data?.message || "Failed to upload document."
      );
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      setDeleteDocumentLoading(documentId);
      setDocumentError("");
      setUploadSuccess("");

      await deleteDocument(id, documentId);

      // Clear old validation feedback
      setMissingDocuments([]);
      setError("");
      setSubmissionSuccess("");

      await fetchDocuments();
      await fetchApplication();

      setUploadSuccess("Document deleted successfully.");
    } catch (err) {
      setDocumentError(
        err.response?.data?.message || "Failed to delete document."
      );
    } finally {
      setDeleteDocumentLoading(null);
    }
  };

  // View document
  const handleViewDocument = async (document) => {
    try {
      setViewDocumentLoading(document.id);
      setDocumentError("");

      await viewDocument(id, document.id);
    } catch (err) {
      setDocumentError(
        err.response?.data?.message || "Failed to view document."
      );
    } finally {
      setViewDocumentLoading(null);
    }
  };

  // Download document
  const handleDownloadDocument = async (document) => {
    try {
      setDownloadDocumentLoading(document.id);
      setDocumentError("");

      await downloadDocument(id, document.id, document.fileName);
    } catch (err) {
      setDocumentError(
        err.response?.data?.message || "Failed to download document."
      );
    } finally {
      setDownloadDocumentLoading(null);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Status styles
  const getStatusStyle = (status) => {
    const styles = {
      DRAFT: "bg-amber-100 text-amber-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-purple-100 text-purple-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return styles[status] || "bg-slate-100 text-slate-700";
  };

  // Document label
  const getDocumentLabel = (type) => {
    return (
      documentTypes.find((item) => item.value === type)?.label ||
      type?.replaceAll("_", " ") ||
      "Document"
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-3 text-slate-600">Loading application...</p>
      </div>
    );
  }

  // Error state
  if (error && !application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />

          <h2 className="text-xl font-bold text-slate-900">
            Application Not Found
          </h2>

          <p className="text-slate-600 mt-2">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!application) return null;

  const course = application.course;
  const isDraft = application.status === "DRAFT";

  // Calculate required documents missing on the frontend too
  const uploadedTypes = documents.map((doc) => doc.type);

  const frontendMissingDocuments = requiredDocuments.filter(
    (requiredType) => !uploadedTypes.includes(requiredType)
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <GraduationCap
                      size={25}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Application Details
                    </p>

                    <h1 className="text-2xl font-bold text-slate-900">
                      {application.applicationNumber}
                    </h1>
                  </div>
                </div>

                <p className="text-slate-500">
                  Review your admission application details.
                </p>
              </div>

              <div>
                <span
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                    application.status
                  )}`}
                >
                  {application.status?.replaceAll("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Error notification */}
          {error && (
            <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Submission success notification */}
          {submissionSuccess && (
            <div className="mx-6 mt-6 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle size={18} className="mt-0.5 shrink-0" />
                <p>{submissionSuccess}</p>
              </div>
            </div>
          )}

          {/* Missing document validation */}
          {isDraft && missingDocuments.length > 0 && (
            <div className="mx-6 mt-6 rounded-xl border border-red-300 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" />

                <div>
                  <h3 className="font-semibold text-red-800">
                    Missing Required Documents
                  </h3>

                  <p className="mt-1 text-sm text-red-700">
                    Please upload the following documents before submitting your
                    application:
                  </p>

                  <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-red-700">
                    {missingDocuments.map((document) => (
                      <li key={document}>{getDocumentLabel(document)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

### Part 2/3 — Course information, entrance details, dates, and document upload

```jsx
          {/* Course Information */}
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-5">
              <BookOpen className="text-blue-600" size={20} />
              Course Information
            </h2>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="text-xl font-semibold text-slate-900">
                {course?.name || "Course information unavailable"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-slate-500">Course Code</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {course?.courseCode || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Degree</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {course?.degree || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {course?.department || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {course?.durationYears
                      ? `${course.durationYears} Years`
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Tuition Fee</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {course?.tuitionFee != null
                      ? `₹${Number(course.tuitionFee).toLocaleString("en-IN")}`
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Academic Year</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {application.academicYear || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Entrance Details */}
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mt-8 mb-5">
              <FileText className="text-blue-600" size={20} />
              Entrance Examination Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Entrance Exam</p>
                <p className="font-semibold text-slate-900 mt-2">
                  {application.entranceExam || "Not provided"}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Entrance Rank</p>
                <p className="font-semibold text-slate-900 mt-2">
                  {application.entranceRank ?? "Not provided"}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Entrance Score</p>
                <p className="font-semibold text-slate-900 mt-2">
                  {application.entranceScore ?? "Not provided"}
                </p>
              </div>
            </div>

            {/* Application Dates */}
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mt-8 mb-5">
              <Calendar className="text-blue-600" size={20} />
              Application Dates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Created On</p>
                <p className="font-medium text-slate-900 mt-2">
                  {formatDate(application.createdAt)}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">Submitted On</p>
                <p className="font-medium text-slate-900 mt-2">
                  {formatDate(application.submittedAt)}
                </p>
              </div>
            </div>

            {/* Documents */}
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mt-8 mb-5">
              <FileText className="text-blue-600" size={20} />
              Documents
            </h2>

            {/* Document Upload */}
            {isDraft && (
              <form
                onSubmit={handleUploadDocument}
                className="mb-6 border border-blue-200 bg-blue-50/50 rounded-xl p-5 sm:p-6"
              >
                <h3 className="font-semibold text-slate-900 mb-4">
                  Upload Application Documents
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Document Type */}
                  <div>
                    <label
                      htmlFor="document-type"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Document Type
                    </label>

                    <select
                      id="document-type"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select document type</option>

                      {documentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File */}
                  <div>
                    <label
                      htmlFor="document-file"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Select File
                    </label>

                    <input
                      id="document-file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white file:mr-3 file:border-0 file:rounded-md file:bg-blue-100 file:text-blue-700 file:px-3 file:py-2 file:font-medium"
                    />
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                    <File size={16} className="text-blue-600" />
                    <span>{selectedFile.name}</span>

                    <span className="text-slate-400">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-3">
                  Allowed formats: PDF, JPG, JPEG, PNG. Maximum size: 5 MB.
                </p>

                {documentError && (
                  <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    <AlertCircle size={16} />
                    {documentError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
                    <CheckCircle size={16} />
                    {uploadSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploadLoading || !selectedFile || !selectedType}
                  className="mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}

                  {uploadLoading ? "Uploading..." : "Upload Document"}
                </button>
              </form>
            )}

            {/* Document messages for non-draft applications */}
            {!isDraft && (documentError || uploadSuccess) && (
              <div
                className={`mb-4 rounded-lg p-3 text-sm ${
                  documentError
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-green-50 border border-green-200 text-green-700"
                }`}
              >
                {documentError || uploadSuccess}
              </div>
            )}

            {/* Uploaded Documents */}
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <FileText className="text-blue-600" size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">
                          {getDocumentLabel(document.type)}
                        </p>

                        <p className="text-sm text-slate-500 truncate">
                          {document.fileName}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Uploaded {formatDate(document.uploadedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Document actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewDocument(document)}
                        disabled={
                          viewDocumentLoading === document.id ||
                          downloadDocumentLoading === document.id
                        }
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                      >
                        {viewDocumentLoading === document.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Eye size={16} />
                        )}
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadDocument(document)}
                        disabled={
                          downloadDocumentLoading === document.id ||
                          viewDocumentLoading === document.id
                        }
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {downloadDocumentLoading === document.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                        Download
                      </button>

                      {isDraft && (
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(document.id)}
                          disabled={deleteDocumentLoading === document.id}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleteDocumentLoading === document.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500">
                No documents uploaded yet.
              </div>
            )}

            {/* Required documents checklist */}
            {isDraft && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900">
                  Required Document Checklist
                </h3>

                <div className="mt-3 space-y-2">
                  {requiredDocuments.map((type) => {
                    const uploaded = uploadedTypes.includes(type);

                    return (
                      <div
                        key={type}
                        className="flex items-center gap-3 text-sm"
                      >
                        {uploaded ? (
                          <CheckCircle
                            size={18}
                            className="text-green-600 shrink-0"
                          />
                        ) : (
                          <AlertCircle
                            size={18}
                            className="text-amber-500 shrink-0"
                          />
                        )}

                        <span
                          className={
                            uploaded ? "text-green-700" : "text-slate-600"
                          }
                        >
                          {getDocumentLabel(type)}
                        </span>

                        <span
                          className={`ml-auto text-xs font-medium ${
                            uploaded
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}
                        >
                          {uploaded ? "Uploaded" : "Missing"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
                        {/* Application Progress */}
            <ApplicationProgress status={application.status} />

            {/* Status History */}
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mt-8 mb-5">
              <Clock className="text-blue-600" size={20} />
              Application Status History
            </h2>

            {application.statusHistory?.length > 0 ? (
              <div className="space-y-4">
                {application.statusHistory.map((history, index) => (
                  <div
                    key={history.id || index}
                    className="flex gap-4 border border-slate-200 rounded-xl p-4"
                  >
                    <div className="mt-1">
                      <CheckCircle className="text-blue-600" size={20} />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {history.newStatus?.replaceAll("_", " ")}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {formatDate(history.changedAt)}
                      </p>

                      {history.remarks && (
                        <p className="text-sm text-slate-600 mt-2">
                          {history.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No status history available.</p>
            )}

            {/* Application Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-6 border-t border-slate-200">
              {isDraft && (
                <>
                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={actionLoading || frontendMissingDocuments.length > 0}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {actionLoading ? "Submitting..." : "Submit Application"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteApplication}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                    Delete Draft
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Submission checklist warning */}
            {isDraft && frontendMissingDocuments.length > 0 && (
              <div className="mt-5 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />

                <p>
                  You must upload all required documents before the application
                  can be submitted. The Submit Application button will be
                  enabled once all required documents are uploaded.
                </p>
              </div>
            )}

            {!isDraft && (
              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-800 text-sm">
                Your application has been submitted. Editing and deleting are
                no longer available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;