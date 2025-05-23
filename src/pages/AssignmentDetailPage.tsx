import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import AssignmentDetail from '../components/student/AssignmentDetail';

const AssignmentDetailPage: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (currentUser?.role !== 'student') {
    return <Navigate to="/teacher-dashboard" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AssignmentDetail />
    </div>
  );
};

export default AssignmentDetailPage;