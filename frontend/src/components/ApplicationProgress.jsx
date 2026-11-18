import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Search,
  Award,
} from "lucide-react";

const steps = [
  { label: "Created", icon: FileText },
  { label: "Submitted", icon: CheckCircle2 },
  { label: "Under Review", icon: Search },
  { label: "Shortlisted", icon: Award },
  { label: "Decision", icon: CheckCircle2 },
];

const statusStepMap = {
  DRAFT: 0,
  SUBMITTED: 1,
  DOCUMENTS_PENDING: 2,
  UNDER_REVIEW: 2,
  SHORTLISTED: 3,
  INTERVIEW_SCHEDULED: 3,
  ACCEPTED: 4,
  REJECTED: 4,
  WAITLISTED: 4,
  CONFIRMED: 4,
};

const finalStatuses = ["ACCEPTED", "REJECTED", "CONFIRMED"];

const statusMessages = {
  DRAFT: "Complete your application and upload the required documents.",
  SUBMITTED: "Your application has been submitted successfully.",
  DOCUMENTS_PENDING: "Additional documents may be required.",
  UNDER_REVIEW: "Your application is currently being reviewed.",
  SHORTLISTED: "Congratulations! You have been shortlisted.",
  INTERVIEW_SCHEDULED: "Your interview has been scheduled.",
  ACCEPTED: "Congratulations! You have been accepted.",
  REJECTED: "Unfortunately, your application was not accepted.",
  WAITLISTED: "You are currently on the waiting list.",
  CONFIRMED: "Your admission has been confirmed.",
};

export default function ApplicationProgress({ status }) {
  const currentStep = statusStepMap[status] ?? 0;
  const isFinal = finalStatuses.includes(status);
  const isWaitlisted = status === "WAITLISTED";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-8">
      <h3 className="text-lg font-semibold text-slate-900">
        Application Progress
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Track your admission application journey.
      </p>

      {/* Progress tracker */}
      <div className="relative mt-8">
        {/* Progress line */}
        <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const completed = index < currentStep;
            const active = index === currentStep;

            return (
              <div
                key={step.label}
                className="flex flex-col items-center w-1/5 z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    completed
                      ? "bg-green-500 border-green-500 text-white"
                      : active
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>

                <p
                  className={`text-[10px] sm:text-xs text-center mt-3 font-medium ${
                    completed || active
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>

                {active && (
                  <span className="text-[10px] sm:text-xs text-blue-600 mt-1 font-medium">
                    {isFinal ? "Completed" : "Current"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current status information */}
      <div
        className={`mt-8 p-4 rounded-xl border ${
          status === "ACCEPTED" || status === "CONFIRMED"
            ? "bg-green-50 border-green-200"
            : status === "REJECTED"
            ? "bg-red-50 border-red-200"
            : isWaitlisted
            ? "bg-amber-50 border-amber-200"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <Clock
            size={18}
            className={`mt-0.5 ${
              status === "REJECTED"
                ? "text-red-600"
                : isWaitlisted
                ? "text-amber-600"
                : "text-blue-600"
            }`}
          />

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Current Status: {status?.replaceAll("_", " ")}
            </p>

            <p className="text-sm text-slate-600 mt-1">
              {statusMessages[status] ||
                "Your application status has been updated."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}