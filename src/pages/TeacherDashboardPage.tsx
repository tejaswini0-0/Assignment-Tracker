import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import TeacherDashboard from '../components/teacher/TeacherDashboard';

const TeacherDashboardPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (currentUser?.role !== 'teacher') {
    return <Navigate to="/student-dashboard" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TeacherDashboard />
    </div>
  );
};

export default TeacherDashboardPage;