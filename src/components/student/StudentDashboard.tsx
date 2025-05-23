import React, { useState } from 'react';
import { Assignment } from '../../types';
import { mockAssignments } from '../../utils/mockData';
import AssignmentCard from './AssignmentCard';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<string>('all');
  
  // In a real app, these would be filtered by the current user
  const assignments = mockAssignments;
  
  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const getAssignmentCount = (status: string) => {
    if (status === 'all') return assignments.length;
    return assignments.filter(a => a.status === status).length;
  };

  const renderFilterButton = (value: string, label: string, icon: JSX.Element) => (
    <button
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        filter === value
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={() => setFilter(value)}
    >
      {icon}
      <span className="ml-2">{label}</span>
      <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
        {getAssignmentCount(value)}
      </span>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome, {currentUser?.name}!
          </h2>
          <p className="mt-1 text-gray-500">
            Here's an overview of your assignments.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            </div>
            <div className="p-4 space-y-2">
              {renderFilterButton('all', 'All Assignments', <BookOpen className="h-4 w-4" />)}
              {renderFilterButton('active', 'Active', <Clock className="h-4 w-4" />)}
              {renderFilterButton('submitted', 'Submitted', <CheckCircle className="h-4 w-4" />)}
              {renderFilterButton('past-due', 'Past Due', <AlertTriangle className="h-4 w-4" />)}
              {renderFilterButton('graded', 'Graded', <CheckCircle className="h-4 w-4" />)}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No assignments found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;