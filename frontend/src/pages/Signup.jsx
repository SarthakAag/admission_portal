
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/auth.service";
import {
  Eye,
  EyeOff,
  GraduationCap,
  ArrowRight,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Lock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await signupUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      setSuccess(response.message || "Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        "Unable to create account. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 pl-11 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  const inputWrapper = "relative";

  const inputIconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400";

  return (
    <div className="min-h-screen bg-[#f3f6fc] p-3 sm:p-6 lg:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-7xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 sm:min-h-[calc(100vh-48px)] sm:rounded-3xl lg:min-h-[calc(100vh-80px)]">

        {/* Left Branding Panel */}
        <aside className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#101c47] via-[#202d66] to-[#3735a6] p-10 text-white lg:flex xl:p-14">

          {/* Background decoration */}
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute right-10 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full border border-white/5" />
          <div className="absolute right-20 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full border border-white/5" />

          {/* Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-sm">
                <GraduationCap size={26} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">EduPortal</h1>
                <p className="text-xs text-indigo-200">
                  College Admission System
                </p>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="relative z-10 my-12 max-w-lg">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-100">
              <Sparkles size={14} />
              Your journey starts today
            </div>

            <h2 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
              Build your future.
              <span className="mt-2 block text-indigo-300">
                Start with us.
              </span>
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-indigo-100/80 xl:text-base">
              One account. A simpler admission journey. Stay organized and take
              your first step toward the education you deserve.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Simple online registration",
                "Track your application progress",
                "Stay updated with notifications",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <CheckCircle2 size={15} />
                  </div>
                  <span className="text-sm text-indigo-100">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs text-indigo-200/70">
              <ShieldCheck size={15} />
              Secure student registration
            </div>
            <p className="mt-4 text-xs text-indigo-300/50">
              © 2026 EduPortal. All rights reserved.
            </p>
          </div>
        </aside>

        {/* Right Signup Panel */}
        <main className="flex w-full items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:w-[55%] lg:px-12 xl:px-16">
          <div className="w-full max-w-md">

            {/* Mobile Branding */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">EduPortal</h1>
                <p className="text-xs text-slate-500">
                  College Admission System
                </p>
              </div>
            </div>

            {/* Heading */}
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
                Student registration
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in your details below to begin your admission journey.
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle2 size={18} className="shrink-0" />
                <div>
                  <p className="font-semibold">{success}</p>
                  <p className="mt-1 text-xs">
                    Redirecting you to sign in...
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>
                <div className={inputWrapper}>
                  <User size={18} className={inputIconClass} />
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputClass}
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <div className={inputWrapper}>
                  <Mail size={18} className={inputIconClass} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone number
                </label>
                <div className={inputWrapper}>
                  <Phone size={18} className={inputIconClass} />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={inputClass}
                    autoComplete="tel"
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className={inputIconClass} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`${inputClass} pr-12`}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={72}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size={18} className={inputIconClass} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`${inputClass} pr-12`}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password match feedback */}
              {form.confirmPassword.length > 0 && (
                <div
                  className={`flex items-center gap-2 text-xs ${
                    form.password === form.confirmPassword
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  {form.password === form.confirmPassword ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <Lock size={15} />
                  )}
                  {form.password === form.confirmPassword
                    ? "Passwords match"
                    : "Passwords must match"}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Sign in */}
            <div className="mt-7 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={15} />
              Your account details are protected.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
