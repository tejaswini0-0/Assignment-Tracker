import React, { useState } from 'react';
import { mockAssignments, mockSubmissions } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, File, Clock, Search } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'assignments' | 'submissions'>('assignments');
  const [searchTerm, setSearchTerm] = useState('');
  
  // In a real app, these would be filtered by the teacher's courses
  const assignments = mockAssignments;
  const submissions = mockSubmissions;
  
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSubmissions = submissions.filter(submission => 
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mockAssignments.find(a => a.id === submission.assignmentId)?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">Needs Grading</span>;
      case 'under-review':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">Under Review</span>;
      case 'graded':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Graded</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome, {currentUser?.name}!
          </h2>
          <p className="mt-1 text-gray-500">
            Manage your assignments and grade student submissions.
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={selectedTab}
            onChange={(e) => setSelectedTab(e.target.value as 'assignments' | 'submissions')}
          >
            <option value="assignments">Assignments</option>
            <option value="submissions">Submissions</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setSelectedTab('assignments')}
                className={`${
                  selectedTab === 'assignments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Assignments
              </button>
              <button
                onClick={() => setSelectedTab('submissions')}
                className={`${
                  selectedTab === 'submissions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Submissions
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder={`Search ${selectedTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-6">
        {selectedTab === 'assignments' ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Course</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{assignment.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{assignment.courseName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(assignment.dueDate)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          assignment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : assignment.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : assignment.status === 'past-due'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.status.replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-sm text-gray-500 text-center">
                      No assignments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Student</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assignment</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Submitted On</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => {
                    const assignment = mockAssignments.find(a => a.id === submission.assignmentId);
                    return (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{submission.studentName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{assignment?.title}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(submission.submittedAt)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getStatusBadge(submission.status)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <a href={`/teacher/submission/${submission.id}`} className="text-blue-600 hover:text-blue-900">
                            {submission.status === 'graded' ? 'View Grade' : 'Grade Submission'}
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-sm text-gray-500 text-center">
                      No submissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;