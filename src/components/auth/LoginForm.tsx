import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }
    
    // For demo purposes (in a real app, this would be an API call)
    setTimeout(() => {
      const success = login(username, password, role);
      
      if (success) {
        navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');
      } else {
        setError('Invalid username or password');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center rounded-md transition-all ${
              role === 'student'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 text-center rounded-md transition-all ${
              role === 'teacher'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setRole('teacher')}
          >
            Teacher
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={role === 'student' ? "student1" : "teacher1"}
          fullWidth
          required
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Use 'password' for demo"
          fullWidth
          required
        />
        
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            className="mt-4"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;