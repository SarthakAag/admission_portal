
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../services/application.service";
import {
  ArrowLeft,
  FileText,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Eye,
  GraduationCap,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getMyApplications();
        setApplications(
          response.applications || response.data || response || []
        );
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Unable to load your applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
      SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
      DOCUMENTS_PENDING: "bg-orange-50 text-orange-700 border-orange-200",
      UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
      SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
      INTERVIEW_SCHEDULED: "bg-indigo-50 text-indigo-700 border-indigo-200",
      ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      CONFIRMED: "bg-green-50 text-green-700 border-green-200",
      REJECTED: "bg-red-50 text-red-700 border-red-200",
      WAITLISTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };

    return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTED":
      case "CONFIRMED":
        return <CheckCircle size={14} />;
      case "REJECTED":
        return <AlertCircle size={14} />;
      case "DRAFT":
        return <FileText size={14} />;
      case "SHORTLISTED":
        return <GraduationCap size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const getStatusLabel = (status) => {
    return status?.replaceAll("_", " ") || "UNKNOWN";
  };

  const formatDate = (date) => {
    if (!date) return "Not yet submitted";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FileText,
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      label: "Drafts",
      value: applications.filter((a) => a.status === "DRAFT").length,
      icon: FileText,
      iconStyle: "bg-gray-100 text-gray-600",
    },
    {
      label: "In Progress",
      value: applications.filter((a) =>
        [
          "SUBMITTED",
          "DOCUMENTS_PENDING",
          "UNDER_REVIEW",
          "SHORTLISTED",
          "INTERVIEW_SCHEDULED",
          "WAITLISTED",
        ].includes(a.status)
      ).length,
      icon: Clock,
      iconStyle: "bg-amber-100 text-amber-600",
    },
    {
      label: "Accepted",
      value: applications.filter((a) =>
        ["ACCEPTED", "CONFIRMED"].includes(a.status)
      ).length,
      icon: CheckCircle,
      iconStyle: "bg-emerald-100 text-emerald-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={28} />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Loading your applications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[76px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition shrink-0"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  My Applications
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  Manage and track your admission journey
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/applications/new")}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition shadow-sm shadow-blue-200 shrink-0"
            >
              <Plus size={17} />
              <span className="hidden sm:inline">New Application</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
        {/* Page heading */}
        <div className="mb-7 sm:mb-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 mb-2">
            Admission Portal
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Application Overview
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl">
            View your applications, check their progress, and keep track of
            important admission updates.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mb-7 sm:mb-9">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {item.label}
                  </p>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.iconStyle}`}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm flex-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* Applications container */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                All Applications
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {applications.length} application
                {applications.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <FileText size={15} />
              Admission records
            </div>
          </div>

          {/* Empty state */}
          {!error && applications.length === 0 ? (
            <div className="px-5 py-14 sm:py-20 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-5">
                <GraduationCap size={32} />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Your journey starts here
              </h3>

              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                You haven't created any applications yet. Explore available courses
                and take the first step toward your future.
              </p>

              <button
                onClick={() => navigate("/courses")}
                className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
              >
                Explore Courses
                <ChevronRight size={17} />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="p-4 sm:p-6 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    {/* Course information */}
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <BookOpen size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                          {application.course?.name ||
                            application.course?.courseName ||
                            "Course"}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-500 mt-1 break-words">
                          Application No:{" "}
                          <span className="font-medium text-slate-700">
                            {application.applicationNumber || "N/A"}
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs sm:text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {formatDate(application.createdAt)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <GraduationCap size={14} />
                            {application.academicYear || "Academic year N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and button */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 lg:pl-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-[11px] sm:text-xs font-semibold whitespace-nowrap ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        {getStatusLabel(application.status)}
                      </span>

                      <button
                        onClick={() =>
                          navigate(`/applications/${application.id}`)
                        }
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition shrink-0"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Bottom helper */}
        {applications.length > 0 && (
          <div className="mt-5 flex items-start gap-2 px-1 text-xs sm:text-sm text-slate-500">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <p>
              Keep your application documents updated. You can view your application
              details to check submission status and progress.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyApplications;
