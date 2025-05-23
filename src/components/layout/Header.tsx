import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-semibold text-xl">Assignment Tracker</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center">
              <div className="ml-3 relative flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{currentUser?.name}</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full capitalize">
                      {currentUser?.role}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 transition-colors flex items-center text-sm"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;