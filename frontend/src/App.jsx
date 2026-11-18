
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationDetails from "./pages/ApplicationDetails";
import MyApplications from "./pages/MyApplications";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Student pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/courses" element={<Courses />} />

      {/* Application pages */}
      <Route path="/applications/new" element={<ApplicationForm />} />
      <Route path="/applications/:id" element={<ApplicationDetails />} />
      <Route path="/applications" element={<MyApplications />} />

      {/* Forgot password */}
      <Route
        path="/forgot-password"
        element={<Navigate to="/login" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
