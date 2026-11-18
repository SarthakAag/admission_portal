
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import {
  Eye,
  EyeOff,
  GraduationCap,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser(formData);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* ================= LEFT BRAND PANEL ================= */}
      <section className="hidden lg:flex lg:w-[48%] xl:w-1/2 min-h-screen relative overflow-hidden bg-[#101a43] text-white flex-col justify-between p-10 xl:p-16">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#172554] to-blue-950" />

        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute top-[40%] right-[10%] w-72 h-72 rounded-full bg-cyan-400/10 blur-[80px]" />

        {/* Decorative circles */}
        <div className="absolute top-24 right-20 w-40 h-40 rounded-full border border-white/10" />
        <div className="absolute top-32 right-28 w-24 h-24 rounded-full border border-white/10" />

        {/* Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-blue-900/30">
              <GraduationCap className="text-indigo-950" size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                CampusConnect
              </h1>
              <p className="text-xs text-indigo-200 tracking-wide">
                STUDENT ADMISSION PORTAL
              </p>
            </div>
          </div>
        </div>

        {/* Main branding content */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-indigo-100 mb-6">
            <Sparkles size={15} className="text-cyan-300" />
            Your next chapter begins here
          </div>

          <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-[1.15] tracking-tight">
            Turn your ambitions into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              achievements.
            </span>
          </h2>

          <p className="mt-6 text-base xl:text-lg text-indigo-100/80 leading-8 max-w-lg">
            One place to manage your admission journey. Discover courses,
            submit applications, and stay informed every step of the way.
          </p>

          {/* Features */}
          <div className="mt-9 space-y-4">
            {[
              "Track your application in real time",
              "Manage admission documents securely",
              "Stay updated with notifications",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-400/15 flex items-center justify-center">
                  <CheckCircle2 size={15} className="text-emerald-300" />
                </div>
                <span className="text-sm text-indigo-100/90">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-indigo-300/70">
          <span>© 2026 CampusConnect</span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} />
            Secure platform
          </span>
        </div>
      </section>

      {/* ================= RIGHT LOGIN PANEL ================= */}
      <section className="flex-1 min-h-screen flex items-center justify-center px-5 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-16 bg-white relative">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="text-white" size={25} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                CampusConnect
              </h1>
              <p className="text-[10px] text-slate-500 tracking-widest font-semibold">
                STUDENT ADMISSION PORTAL
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 sm:mb-9">
            <div className="w-12 h-1.5 rounded-full bg-indigo-600 mb-5 hidden lg:block" />

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-500 leading-6">
              Sign in to continue your journey with CampusConnect.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle size={19} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Unable to sign in
                </p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-200/70 hover:bg-indigo-700 hover:shadow-indigo-300/50 active:scale-[0.99] transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={19} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to your account
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">WELCOME TO CAMPUSCONNECT</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Signup */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 text-center">
            <p className="text-sm text-slate-600">
              New to CampusConnect?
            </p>

            <Link
              to="/signup"
              className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              Create your student account
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-7 text-center text-xs text-slate-400 leading-5">
            By signing in, you agree to our{" "}
            <span className="text-slate-600 font-medium">Terms of Service</span>{" "}
            and{" "}
            <span className="text-slate-600 font-medium">Privacy Policy</span>.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Your information is protected and secure.
          </div>
        </div>
      </section>
    </div>
  );
}
