import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../services/course.service";
import { createApplication } from "../services/application.service";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Loader2,
} from "lucide-react";

const ApplicationForm = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    courseId: "",
    academicYear: "2027-2028",
    entranceExam: "",
    entranceRank: "",
    entranceScore: "",
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.courses || response.data || []);
      } catch (err) {
        setError("Unable to load courses. Please try again.");
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const selectedCourse = courses.find(
    (course) => course.id === formData.courseId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.courseId) {
      setError("Please select a course.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        courseId: formData.courseId,
        academicYear: formData.academicYear,
        entranceExam: formData.entranceExam || null,
        entranceRank: formData.entranceRank
          ? Number(formData.entranceRank)
          : null,
        entranceScore: formData.entranceScore
          ? Number(formData.entranceScore)
          : null,
      };

      const response = await createApplication(payload);

      const application = response.application || response.data || response;

      navigate(`/applications/${application.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-3 text-slate-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <GraduationCap className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Application for Admission
                </h1>
                <p className="text-slate-500 text-sm">
                  Start your journey with us
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <div className="h-2 flex-1 rounded-full bg-blue-600" />
              <div className="h-2 flex-1 rounded-full bg-slate-200" />
              <div className="h-2 flex-1 rounded-full bg-slate-200" />
            </div>

            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span className="text-blue-600 font-medium">Course Selection</span>
              <span>Academic Details</span>
              <span>Review</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
                {error}
              </div>
            )}

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                Choose Your Course
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <button
                    type="button"
                    key={course.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        courseId: course.id,
                      }))
                    }
                    className={`text-left border rounded-xl p-5 transition-all ${
                      formData.courseId === course.id
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {course.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {course.courseCode} · {course.degree}
                        </p>
                      </div>

                      {formData.courseId === course.id && (
                        <CheckCircle className="text-blue-600 shrink-0" size={20} />
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mt-3">
                      {course.department}
                    </p>

                    <div className="flex justify-between text-sm mt-4 pt-3 border-t border-slate-100">
                      <span className="text-slate-500">
                        {course.durationYears} years
                      </span>
                      <span className="font-medium text-slate-900">
                        ₹{Number(course.tuitionFee).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Academic & Entrance Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Academic Year *
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="2027-2028">2027–2028</option>
                    <option value="2028-2029">2028–2029</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Entrance Exam
                  </label>
                  <input
                    type="text"
                    name="entranceExam"
                    value={formData.entranceExam}
                    onChange={handleChange}
                    placeholder="e.g. JEE Main, CAT, CUET"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Entrance Rank
                  </label>
                  <input
                    type="number"
                    name="entranceRank"
                    value={formData.entranceRank}
                    onChange={handleChange}
                    placeholder="Enter your rank"
                    min="1"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Entrance Score
                  </label>
                  <input
                    type="number"
                    name="entranceScore"
                    value={formData.entranceScore}
                    onChange={handleChange}
                    placeholder="Enter your score"
                    min="0"
                    step="0.01"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {selectedCourse && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                <h3 className="font-semibold text-blue-900">
                  Selected Course
                </h3>
                <p className="text-blue-800 mt-1">{selectedCourse.name}</p>
                <p className="text-sm text-blue-700 mt-2">
                  Duration: {selectedCourse.durationYears} years | Tuition Fee: ₹
                  {Number(selectedCourse.tuitionFee).toLocaleString("en-IN")}
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || !formData.courseId}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Application...
                  </>
                ) : (
                  <>
                    Create Application Draft
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;