import React from 'react';
import { Link } from 'react-router-dom';
import { Assignment } from '../../types';
import { CalendarDays, Clock, File } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const { id, title, courseName, dueDate, status, maxPoints } = assignment;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStyle = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-indigo-100 text-indigo-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'past-due':
        return 'bg-red-100 text-red-800';
      case 'submitted':
        return 'bg-amber-100 text-amber-800';
      case 'graded':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link
      to={`/assignment/${id}`}
      className="block w-full transition-all duration-200 hover:shadow-md"
    >
      <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle()}`}>
              {status.replace('-', ' ')}
            </span>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">{courseName}</div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
              <span>{formatDate(dueDate)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>{formatTime(dueDate)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <File className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-600">Max Points: {maxPoints}</span>
          </div>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {status === 'submitted' || status === 'graded' ? 'View Submission' : 'Submit Assignment'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AssignmentCard;