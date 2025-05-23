import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { BookOpen } from 'lucide-react';

const Login: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to={currentUser?.role === 'student' ? '/student-dashboard' : '/teacher-dashboard'} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Assignment Tracker</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your assignments
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;