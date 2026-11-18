import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  User,
  FileText,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ChevronRight,
  RefreshCw,
  ClipboardCheck,
  Circle,
  Inbox,
} from "lucide-react";

import { getCurrentUser, logoutUser } from "../services/auth.service";
import { getMyApplications } from "../services/application.service";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from "../services/notification.service";

/* =========================================================
   CONSTANTS
========================================================= */

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "Courses", icon: BookOpen, path: "/courses" },
  { label: "Applications", icon: FileText, path: "/applications" },
  { label: "Notifications", icon: Bell },
];

const statusStyles = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-50 text-blue-700",
  DOCUMENTS_PENDING: "bg-amber-50 text-amber-700",
  UNDER_REVIEW: "bg-purple-50 text-purple-700",
  SHORTLISTED: "bg-indigo-50 text-indigo-700",
  INTERVIEW_SCHEDULED: "bg-cyan-50 text-cyan-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
  CONFIRMED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  WAITLISTED: "bg-orange-50 text-orange-700",
};

const statusLabels = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  DOCUMENTS_PENDING: "Documents Pending",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  ACCEPTED: "Accepted",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
  WAITLISTED: "Waitlisted",
};

/* =========================================================
   HELPERS
========================================================= */

function extractApplications(response) {
  const data =
    response?.applications ??
    response?.data?.applications ??
    response?.data ??
    response;

  return Array.isArray(data) ? data : [];
}

function extractNotifications(response) {
  const data =
    response?.notifications ??
    response?.data?.notifications ??
    response?.data ??
    response;

  return Array.isArray(data) ? data : [];
}

function formatDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getApplicationStatus(status) {
  return statusLabels[status] || status || "Unknown";
}

function isApplicationSubmitted(application) {
  return Boolean(application?.status && application.status !== "DRAFT");
}

function getApplicationCourseName(application) {
  return (
    application?.course?.name ||
    application?.course?.courseName ||
    application?.courseName ||
    "Course Application"
  );
}

/* =========================================================
   UI COMPONENTS
========================================================= */

function SectionHeading({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, icon: Icon, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

function StatCard({ icon: Icon, title, value, subtitle, iconBg, iconColor }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 break-words text-2xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${iconBg}`}>
          <Icon size={21} className={iconColor} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-500">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {getApplicationStatus(status)}
    </span>
  );
}

function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 shrink-0 text-red-500" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800">Something went wrong</h3>
          <p className="mt-1 text-sm leading-6 text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-800 hover:text-red-950"
            >
              <RefreshCw size={15} /> Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activeMenu,
  setActiveMenu,
  onLogout,
  mobileOpen,
  setMobileOpen,
  unreadCount,
}) {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    setMobileOpen(false);
    setActiveMenu(item.label);

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-gray-100 px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 shadow-sm">
              <GraduationCap size={23} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              CampusConnect
            </span>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 pt-7">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={19} className="shrink-0" />
                  <span>{item.label}</span>

                  {item.label === "Notifications" && unreadCount > 0 && (
                    <span className="ml-auto min-w-5 rounded-full bg-indigo-600 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
            Preferences
          </p>

          <button
            onClick={() => {
              setActiveMenu("Settings");
              setMobileOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium ${
              activeMenu === "Settings"
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings size={19} />
            Settings
          </button>
        </div>

        {/* Help and logout */}
        <div className="shrink-0 p-4">
          <div className="mb-3 rounded-2xl bg-indigo-50 p-4">
            <div className="flex items-center gap-2 text-indigo-700">
              <BookOpen size={17} />
              <span className="text-sm font-semibold">Need help?</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-600">
              Contact our admissions team if you need assistance with your
              application.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="mt-3 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
            >
              Contact support →
            </button>
          </div>

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   ADMISSION CHECKLIST
========================================================= */

function AdmissionChecklist({ applications, navigate }) {
  const hasApplication = applications.length > 0;
  const latestApplication = applications[0];
  const isSubmitted = hasApplication && isApplicationSubmitted(latestApplication);
  const isDraft = hasApplication && latestApplication.status === "DRAFT";

  const steps = [
    {
      title: "Create your account",
      description: "Your student account has been created successfully.",
      completed: true,
      icon: User,
      actionLabel: "Completed",
    },
    {
      title: "Complete your profile",
      description: "Review and add your personal and academic information.",
      completed: false,
      icon: ClipboardCheck,
      actionLabel: "Review profile",
      action: () => navigate("/profile"),
    },
    {
      title: "Choose your course",
      description: hasApplication
        ? `Selected: ${getApplicationCourseName(latestApplication)}`
        : "Explore available courses and select your preferred program.",
      completed: hasApplication,
      icon: BookOpen,
      actionLabel: hasApplication ? "View application" : "Explore courses",
      action: () =>
        navigate(hasApplication ? `/applications/${latestApplication.id}` : "/courses"),
    },
    {
      title: "Upload required documents",
      description: isSubmitted
        ? "Documents were provided for submission. You can review them in your application."
        : "Upload your required documents in your draft application.",
      completed: isSubmitted,
      icon: FileText,
      actionLabel: hasApplication ? "Manage documents" : "Start application",
      action: () =>
        navigate(
          hasApplication
            ? `/applications/${latestApplication.id}`
            : "/applications/new"
        ),
    },
    {
      title: "Submit your application",
      description: isSubmitted
        ? "Your application has been submitted successfully."
        : "Review your details and submit your application when you're ready.",
      completed: isSubmitted,
      icon: CheckCircle2,
      actionLabel: isSubmitted ? "Submitted" : "Continue",
      action: () =>
        navigate(
          hasApplication
            ? `/applications/${latestApplication.id}`
            : "/applications/new"
        ),
    },
    {
      title: "Track admission updates",
      description: isSubmitted
        ? "Follow your application status and admission notifications."
        : "Once submitted, track your application progress here.",
      completed: false,
      icon: Clock,
      actionLabel: "View applications",
      action: () => navigate("/applications"),
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        title="Admission Checklist"
        description="Follow these steps to complete your admission journey."
      />

      {/* Progress */}
      <div className="mb-6 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Your progress
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {completedSteps} of {steps.length} steps completed
            </p>
          </div>
          <span className="text-sm font-bold text-indigo-700">{progress}%</span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-1">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="flex gap-3 rounded-xl p-3 transition hover:bg-gray-50 sm:p-4"
            >
              <div className="relative flex shrink-0 flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step.completed
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 size={19} />
                  ) : (
                    <Icon size={19} />
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div className="my-1 h-full min-h-5 w-px bg-gray-200" />
                )}
              </div>

              <div className="min-w-0 flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {step.title}
                  </h3>

                  {step.completed && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Complete
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {step.description}
                </p>

                {!step.completed && step.action && (
                  <button
                    onClick={step.action}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                  >
                    {step.actionLabel}
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   DASHBOARD HOME
========================================================= */

function DashboardHome({ user, applications, applicationsLoading, applicationsError, retryApplications, navigate }) {
  const firstName =
    user?.fullName?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    "Student";

  const totalApplications = applications.length;
  const drafts = applications.filter((app) => app.status === "DRAFT").length;
  const submitted = applications.filter((app) => app.status === "SUBMITTED").length;
  const underReview = applications.filter(
    (app) => app.status === "UNDER_REVIEW"
  ).length;
  const shortlisted = applications.filter(
    (app) => app.status === "SHORTLISTED"
  ).length;
  const accepted = applications.filter(
    (app) => ["ACCEPTED", "CONFIRMED"].includes(app.status)
  ).length;
  const rejected = applications.filter((app) => app.status === "REJECTED").length;

  const latestApplication = applications[0];

  const quickActions = [
    {
      title: "My Profile",
      description: "Update your personal and academic details.",
      icon: User,
      action: () => navigate("/profile"),
    },
    {
      title: "Explore Courses",
      description: "Find the program that fits your goals.",
      icon: BookOpen,
      action: () => navigate("/courses"),
    },
    {
      title: "Applications",
      description: "View, edit and track your applications.",
      icon: FileText,
      action: () => navigate("/applications"),
    },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-700 to-violet-800 p-6 text-white shadow-sm sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-bold tracking-[0.15em] text-indigo-200">
            STUDENT PORTAL
          </p>

          <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Welcome back, {firstName}!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Manage your admission journey, explore courses, and stay up to date
            with your application progress.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton
              icon={ArrowRight}
              onClick={() =>
                navigate(
                  latestApplication
                    ? `/applications/${latestApplication.id}`
                    : "/applications/new"
                )
              }
            >
              {latestApplication ? "Continue application" : "Start application"}
            </PrimaryButton>

            <button
              onClick={() => navigate("/courses")}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Explore courses
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileText}
          title="Total Applications"
          value={applicationsLoading ? "—" : totalApplications}
          subtitle={applicationsLoading ? "Loading..." : `${drafts} draft(s)`}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          icon={Clock}
          title="Under Review"
          value={applicationsLoading ? "—" : underReview}
          subtitle="Applications being reviewed"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />

        <StatCard
          icon={CheckCircle2}
          title="Shortlisted"
          value={applicationsLoading ? "—" : shortlisted}
          subtitle="Applications shortlisted"
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />

        <StatCard
          icon={GraduationCap}
          title="Offers"
          value={applicationsLoading ? "—" : accepted}
          subtitle={`${rejected} rejected`}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </section>

      {/* Applications error */}
      {applicationsError && (
        <ErrorState message={applicationsError} onRetry={retryApplications} />
      )}

      {/* Latest application */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          title="Latest Application"
          description="Your most recent admission application."
          action={
            <button
              onClick={() => navigate("/applications")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              View all <ArrowRight size={16} />
            </button>
          }
        />

        {applicationsLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading your application...
          </div>
        ) : latestApplication ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words font-semibold text-gray-900">
                  {getApplicationCourseName(latestApplication)}
                </h3>
                <p className="mt-1 break-words text-sm text-gray-500">
                  Application No: {latestApplication.applicationNumber || "N/A"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Academic Year: {latestApplication.academicYear || "N/A"}
                </p>
              </div>

              <StatusBadge status={latestApplication.status} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <PrimaryButton
                icon={ArrowRight}
                onClick={() => navigate(`/applications/${latestApplication.id}`)}
              >
                View application
              </PrimaryButton>

              <SecondaryButton onClick={() => navigate("/applications")}>
                All applications
              </SecondaryButton>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
              <GraduationCap size={26} className="text-indigo-600" />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">
              Start your admission journey
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              You haven't created an application yet. Explore available courses
              and begin when you're ready.
            </p>
            <div className="mt-5">
              <PrimaryButton
                icon={ArrowRight}
                onClick={() => navigate("/applications/new")}
              >
                Start application
              </PrimaryButton>
            </div>
          </div>
        )}
      </section>

      {/* Checklist and quick actions */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <AdmissionChecklist applications={applications} navigate={navigate} />
        </div>

        <div className="xl:col-span-2">
          <section className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              title="Quick Actions"
              description="Shortcuts to commonly used sections."
            />

            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
                  >
                    <div className="shrink-0 rounded-xl bg-indigo-50 p-3">
                      <Icon size={20} className="text-indigo-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {action.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {action.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                    />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   NOTIFICATION CENTER
========================================================= */

function NotificationCenter({ onUnreadCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getNotifications();
      setNotifications(extractNotifications(response));
      await onUnreadCountChange?.();
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleMarkRead = async (id) => {
    setActionLoading(true);
    setError("");

    try {
      await markNotificationAsRead(id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
      await onUnreadCountChange?.();
    } catch (err) {
      console.error(err);
      setError("Unable to update this notification.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    setError("");

    try {
      await markAllNotificationsAsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true }))
      );
      await onUnreadCountChange?.();
    } catch (err) {
      console.error(err);
      setError("Unable to mark notifications as read.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        title="Notifications"
        description="Admission updates, application reminders and important announcements."
        action={
          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <SecondaryButton
                disabled={actionLoading}
                onClick={handleMarkAllRead}
                icon={CheckCircle2}
              >
                Mark all read
              </SecondaryButton>
  )}

            <SecondaryButton
              disabled={loading || actionLoading}
              onClick={loadNotifications}
              icon={RefreshCw}
            >
              Refresh
            </SecondaryButton>
          </div>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingState message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <Inbox size={25} className="text-indigo-600" />
          </div>
          <h3 className="mt-4 font-semibold text-gray-900">
            You're all caught up
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            No notifications yet. We'll let you know when there's an update.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-xl border p-4 transition sm:p-5 ${
                notification.isRead
                  ? "border-gray-200 bg-white"
                  : "border-indigo-100 bg-indigo-50/60"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`shrink-0 rounded-full p-2 ${
                    notification.isRead
                      ? "bg-gray-100 text-gray-500"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {notification.isRead ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Bell size={18} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="break-words text-sm font-semibold text-gray-900">
                      {notification.title || "Notification"}
                    </h3>

                    {!notification.isRead && (
                      <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                        Unread
                      </span>
                    )}
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {notification.message || "You have a new update."}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    {formatDate(notification.createdAt)}
                  </p>

                  {!notification.isRead && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleMarkRead(notification.id)}
                      className="mt-3 text-sm font-semibold text-indigo-700 hover:text-indigo-900 disabled:opacity-50"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   OTHER SECTIONS
========================================================= */

function SettingsSection() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mx-auto max-w-lg py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
          <Settings size={25} className="text-indigo-600" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-gray-900">
          Settings
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Account preferences and security settings will be available here.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  const [unreadCount, setUnreadCount] = useState(0);

  /* Load current user */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      setLoadingUser(false);
      return;
    }

    const loadUser = async () => {
      try {
        const result = await getCurrentUser();
        setUser(result?.user ?? result?.data?.user ?? result?.data ?? result);
      } catch (error) {
        console.error("Failed to load user:", error);
        logoutUser();
        navigate("/login", { replace: true });
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [navigate]);

  /* Load applications */
  const loadApplications = async () => {
    setApplicationsLoading(true);
    setApplicationsError("");

    try {
      const response = await getMyApplications();
      const list = extractApplications(response);

      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );

      setApplications(list);
    } catch (error) {
      console.error("Failed to load applications:", error);
      setApplicationsError(
        "We couldn't load your applications. Check your connection and try again."
      );
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadApplications();
    } else {
      setApplicationsLoading(false);
    }
  }, []);

  /* Load unread notification count */
  const refreshUnreadCount = async () => {
    try {
      const response = await getUnreadCount();

      const count =
        response?.unreadCount ??
        response?.data?.unreadCount ??
        response?.count ??
        response?.data?.count ??
        0;

      setUnreadCount(Number(count) || 0);
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      refreshUnreadCount();
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  const handleMenuSelect = (label) => {
    setActiveMenu(label);
    setMobileOpen(false);
  };

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading CampusConnect...
          </p>
        </div>
      </div>
    );
  }

  const userName = user?.fullName || user?.name || "Student";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={handleMenuSelect}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        unreadCount={unreadCount}
      />

      <main className="min-h-screen lg:ml-[280px]">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Student Portal</p>
              <h1 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {activeMenu}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <button
              onClick={() => handleMenuSelect("Notifications")}
              className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Open notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-3 sm:gap-3 sm:pl-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 sm:h-10 sm:w-10">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div className="hidden min-w-0 sm:block">
                <p className="max-w-[160px] truncate text-sm font-semibold text-gray-900">
                  {userName}
                </p>
                <p className="text-xs text-gray-500">Student Account</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {activeMenu === "Dashboard" && (
            <DashboardHome
              user={user}
              applications={applications}
              applicationsLoading={applicationsLoading}
              applicationsError={applicationsError}
              retryApplications={loadApplications}
              navigate={navigate}
            />
          )}

          {activeMenu === "Notifications" && (
            <NotificationCenter onUnreadCountChange={refreshUnreadCount} />
          )}

          {activeMenu === "Settings" && <SettingsSection />}

          <footer className="border-t border-gray-200 pt-5 text-center text-xs text-gray-400">
            CampusConnect Student Portal © 2026
          </footer>
        </div>
      </main>
    </div>
  );
}