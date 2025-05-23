import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import AssignmentDetailPage from './pages/AssignmentDetailPage';
import GradingPage from './pages/GradingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
          <Route path="/assignment/:id" element={<AssignmentDetailPage />} />
          <Route path="/teacher/submission/:id" element={<GradingPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;