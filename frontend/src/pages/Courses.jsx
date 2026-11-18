
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  IndianRupee,
  Search,
  Users,
  X,
  SlidersHorizontal,
  LoaderCircle,
} from "lucide-react";
import api from "../services/api";

const Courses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/courses");
        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("COURSES FETCH ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Dynamic filters
  const degrees = useMemo(() => {
    return [...new Set(courses.map((course) => course.degree))].sort();
  }, [courses]);

  const departments = useMemo(() => {
    return [...new Set(courses.map((course) => course.department))].sort();
  }, [courses]);

  // Search and filter
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        course.name.toLowerCase().includes(searchText) ||
        course.courseCode.toLowerCase().includes(searchText) ||
        course.department.toLowerCase().includes(searchText);

      const matchesDegree =
        degreeFilter === "ALL" || course.degree === degreeFilter;

      const matchesDepartment =
        departmentFilter === "ALL" ||
        course.department === departmentFilter;

      return matchesSearch && matchesDegree && matchesDepartment;
    });
  }, [courses, search, degreeFilter, departmentFilter]);

  // Format tuition fees
  const formatFee = (fee) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(fee || 0);
  };

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setDegreeFilter("ALL");
    setDepartmentFilter("ALL");
  };

  // Apply Now handler
  const handleApplyNow = () => {
    console.log("========== APPLY NOW DEBUG ==========");
    console.log("Apply Now button clicked");
    console.log("Selected Course:", selectedCourse);
    console.log("Current URL:", window.location.href);
    console.log("Stored Token:", localStorage.getItem("token"));
    console.log("Target Route:", "/applications/new");
    console.log("==================================");

    setSelectedCourse(null);
    navigate("/applications/new");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Admission Portal
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            My Profile
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-indigo-50">
              <BookOpen size={15} />
              Explore Programs
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Find the course that
              <span className="block text-indigo-200">
                shapes your future.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
              Explore our programs, compare course details, and find the right
              academic path for your goals.
            </p>

            <div className="mt-7 flex flex-wrap gap-6 text-sm text-indigo-100">
              <div className="flex items-center gap-2">
                <BookOpen size={17} />
                {courses.length} programs available
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap size={17} />
                Multiple degree options
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search course, code, or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Degree filter */}
            <select
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="ALL">All Degrees</option>

              {degrees.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>

            {/* Department filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="ALL">All Departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <SlidersHorizontal size={16} />
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredCourses.length}
              </span>{" "}
              of {courses.length} courses
            </div>

            {(search ||
              degreeFilter !== "ALL" ||
              departmentFilter !== "ALL") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Course List */}
        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <LoaderCircle
                className="animate-spin text-indigo-600"
                size={32}
              />
              <p className="text-sm">Loading courses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No courses found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                formatFee={formatFee}
                onView={() => setSelectedCourse(course)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          formatFee={formatFee}
          onClose={() => setSelectedCourse(null)}
          onApply={handleApplyNow}
        />
      )}
    </div>
  );
};

// Course Card
const CourseCard = ({ course, formatFee, onView }) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            {course.degree}
          </span>

          <span className="text-xs font-medium text-slate-400">
            {course.courseCode}
          </span>
        </div>

        <h3 className="mt-4 min-h-14 text-lg font-bold leading-6 text-slate-900 group-hover:text-indigo-700">
          {course.name}
        </h3>

        <p className="mt-2 text-sm text-slate-500">{course.department}</p>

        <p className="mt-3 line-clamp-3 min-h-[60px] text-sm leading-6 text-slate-600">
          {course.description ||
            "Explore this program and its academic opportunities."}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoItem icon={<Clock size={16} />} label="Duration">
            {course.durationYears} Years
          </InfoItem>

          <InfoItem icon={<Users size={16} />} label="Available Seats">
            {course.seatsAvailable}
          </InfoItem>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Tuition Fee</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatFee(course.tuitionFee)}
            </p>
          </div>

          <button
            type="button"
            onClick={onView}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Details
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Small information component
const InfoItem = ({ icon, label, children }) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-1.5 text-sm font-semibold text-slate-800">
        {children}
      </p>
    </div>
  );
};

// Course Details Modal
const CourseModal = ({ course, formatFee, onClose, onApply }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="relative bg-gradient-to-br from-indigo-700 to-violet-700 p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-xl bg-white/15 p-2 text-white transition hover:bg-white/25"
          >
            <X size={20} />
          </button>

          <span className="inline-flex rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-indigo-50">
            {course.degree}
          </span>

          <h2 className="mt-4 pr-10 text-2xl font-bold leading-8 text-white sm:text-3xl">
            {course.name}
          </h2>

          <p className="mt-3 text-sm text-indigo-100">
            {course.department} · {course.courseCode}
          </p>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            About the course
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            {course.description || "Course description not available."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <DetailBox
              icon={<Clock size={19} />}
              label="Duration"
              value={`${course.durationYears} Years`}
            />

            <DetailBox
              icon={<Users size={19} />}
              label="Available Seats"
              value={course.seatsAvailable}
            />

            <DetailBox
              icon={<IndianRupee size={19} />}
              label="Tuition Fee"
              value={formatFee(course.tuitionFee)}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* FIX: type="button" prevents accidental form submission */}
            <button
              type="button"
              onClick={onApply}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Apply Now
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail box
const DetailBox = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-indigo-600">{icon}</div>

      <p className="mt-3 text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default Courses;
