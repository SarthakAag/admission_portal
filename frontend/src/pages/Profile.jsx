
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  MapPin,
  GraduationCap,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../services/auth.service";

const initialForm = {
  fullName: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  tenthBoard: "",
  tenthYear: "",
  tenthPercentage: "",
  twelfthBoard: "",
  twelfthYear: "",
  twelfthStream: "",
  twelfthPercentage: "",
};

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  min,
  max,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className={`${inputClass} cursor-pointer`}
      >
        <option value="">Select {label.toLowerCase()}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionCard({ icon: Icon, title, description, badge, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3 border-b border-slate-100 p-5 sm:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">{title}</h2>

            {badge && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {badge}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
          <Loader2 className="animate-spin text-indigo-600" size={24} />
        </div>
        <h2 className="mt-4 font-semibold text-slate-800">
          Loading your profile
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Please wait while we fetch your details.
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await getStudentProfile();

        const user = result.profile;
        const profile = user?.profile || {};

        setFormData({
          fullName: user?.fullName || "",
          phone: user?.phone || "",
          dateOfBirth: profile.dateOfBirth
            ? String(profile.dateOfBirth).slice(0, 10)
            : "",
          gender: profile.gender || "",
          nationality: profile.nationality || "",
          address: profile.address || "",
          city: profile.city || "",
          state: profile.state || "",
          postalCode: profile.postalCode || "",
          tenthBoard: profile.tenthBoard || "",
          tenthYear: profile.tenthYear || "",
          tenthPercentage: profile.tenthPercentage ?? "",
          twelfthBoard: profile.twelfthBoard || "",
          twelfthYear: profile.twelfthYear || "",
          twelfthStream: profile.twelfthStream || "",
          twelfthPercentage: profile.twelfthPercentage ?? "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const completionFields = [
    formData.fullName,
    formData.phone,
    formData.dateOfBirth,
    formData.gender,
    formData.nationality,
    formData.address,
    formData.city,
    formData.state,
    formData.postalCode,
    formData.tenthBoard,
    formData.tenthYear,
    formData.tenthPercentage,
    formData.twelfthBoard,
    formData.twelfthYear,
    formData.twelfthStream,
    formData.twelfthPercentage,
  ];

  const completedCount = completionFields.filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;

  const completion = Math.round(
    (completedCount / completionFields.length) * 100
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const result = await updateStudentProfile(formData);
      setMessage(result.message || "Profile saved successfully!");
    } catch (err) {
      const backendErrors = err.response?.data?.errors;

      if (backendErrors?.length) {
        setError(backendErrors.map((item) => item.message).join(", "));
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to save profile. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Top navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Dashboard</span>
          </button>

          <ChevronRight size={16} className="mx-2 text-slate-300" />

          <span className="text-sm font-semibold text-slate-800">
            Student Profile
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        {/* Page heading */}
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            <Sparkles size={14} />
            Student Portal
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Your Student Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your personal and academic details in one place. Keep your
            information accurate to make your admission process smoother.
          </p>
        </div>

        {/* Profile completion */}
        <div className="mb-7 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#172554] via-indigo-900 to-indigo-700 p-5 text-white shadow-lg sm:p-7">
            <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-indigo-400/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-sky-400/10 blur-2xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-200">
                  <UserRound size={17} />
                  <span className="text-sm font-medium">Profile completion</span>
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {completion}%
                  </span>
                  <span className="text-sm text-indigo-200">completed</span>
                </div>

                <p className="mt-2 text-sm text-indigo-100/80">
                  {completion === 100
                    ? "Excellent! Your profile is fully completed."
                    : "Complete your details to strengthen your admission profile."}
                </p>
              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm sm:h-24 sm:w-24">
                <div className="text-center">
                  <ShieldCheck size={28} className="mx-auto text-white" />
                  <span className="mt-1 block text-[10px] font-semibold text-indigo-100">
                    PROFILE
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-6">
              <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700 ease-out"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-indigo-100/80">
                <span>
                  {completedCount} of {completionFields.length} fields completed
                </span>
                <span>{completion}%</span>
              </div>
            </div>
          </div>

          {/* Completion summary */}
          <div className="flex flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:min-w-[230px] lg:flex-col lg:items-start lg:justify-center">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Fields remaining
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {completionFields.length - completedCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                to complete your profile
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 lg:mt-2">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* Status messages */}
        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Success</p>
              <p className="mt-0.5">{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-0.5 break-words">{error}</p>
            </div>
          </div>
        )}

        {/* Profile form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal information */}
          <SectionCard
            icon={UserRound}
            title="Personal Information"
            description="Your basic identity and contact information."
            badge="Section 01"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <InputField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
              />

              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />

              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={["Male", "Female", "Other", "Prefer not to say"]}
              />

              <InputField
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="e.g. Indian"
              />
            </div>
          </SectionCard>

          {/* Address */}
          <SectionCard
            icon={MapPin}
            title="Address Information"
            description="Your current residential address."
            badge="Section 02"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <div className="sm:col-span-2 xl:col-span-3">
                <InputField
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                />
              </div>

              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />

              <InputField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />

              <InputField
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal / PIN code"
              />
            </div>
          </SectionCard>

          {/* Class 10 */}
          <SectionCard
            icon={GraduationCap}
            title="Class 10 Academic Details"
            description="Your secondary school qualification details."
            badge="Section 03"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <InputField
                label="Board"
                name="tenthBoard"
                value={formData.tenthBoard}
                onChange={handleChange}
                placeholder="e.g. CBSE, ICSE, State Board"
              />

              <InputField
                label="Passing Year"
                name="tenthYear"
                type="number"
                value={formData.tenthYear}
                onChange={handleChange}
                placeholder="e.g. 2022"
                min="1900"
                max="2100"
              />

              <InputField
                label="Percentage"
                name="tenthPercentage"
                type="number"
                value={formData.tenthPercentage}
                onChange={handleChange}
                placeholder="e.g. 92.5"
                min="0"
                max="100"
              />
            </div>
          </SectionCard>

          {/* Class 12 */}
          <SectionCard
            icon={GraduationCap}
            title="Class 12 Academic Details"
            description="Your higher secondary education details."
            badge="Section 04"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <InputField
                label="Board"
                name="twelfthBoard"
                value={formData.twelfthBoard}
                onChange={handleChange}
                placeholder="e.g. CBSE, ISC, State Board"
              />

              <InputField
                label="Passing Year"
                name="twelfthYear"
                type="number"
                value={formData.twelfthYear}
                onChange={handleChange}
                placeholder="e.g. 2024"
                min="1900"
                max="2100"
              />

              <InputField
                label="Stream"
                name="twelfthStream"
                value={formData.twelfthStream}
                onChange={handleChange}
                placeholder="e.g. Science, Commerce, Arts"
              />

              <InputField
                label="Percentage"
                name="twelfthPercentage"
                type="number"
                value={formData.twelfthPercentage}
                onChange={handleChange}
                placeholder="e.g. 95.2"
                min="0"
                max="100"
              />
            </div>
          </SectionCard>

          {/* Action buttons */}
          <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-2">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving profile...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          Your profile information is used for your college admission application.
        </p>
      </main>
    </div>
  );
}
