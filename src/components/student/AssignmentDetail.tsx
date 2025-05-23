import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { mockAssignments, mockSubmissions } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import { CalendarDays, Clock, File, Upload, Check, AlertTriangle } from 'lucide-react';

const AssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [localAssignmentStatus, setLocalAssignmentStatus] = useState<string | null>(null);
  
  if (!currentUser || currentUser.role !== 'student') {
    return <Navigate to="/" />;
  }
  
  const assignment = mockAssignments.find((a) => a.id === id);
  const submission = mockSubmissions.find(
    (s) => s.assignmentId === id && s.studentId === currentUser.id
  );
  
  if (!assignment) {
    return <Navigate to="/student-dashboard" />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setSubmitError('Only PDF files are accepted');
        setFile(null);
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setSubmitError('File size exceeds 5MB limit');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setSubmitError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setSubmitError('Please select a file to upload');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setLocalAssignmentStatus('submitted');
      // In a real app, we would send the file to the server here
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const isPastDue = new Date(assignment.dueDate) < new Date();
  const currentStatus = localAssignmentStatus || assignment.status;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {assignment.title}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              isPastDue && currentStatus !== 'submitted' && currentStatus !== 'graded'
                ? 'bg-red-100 text-red-800'
                : currentStatus === 'submitted'
                ? 'bg-amber-100 text-amber-800'
                : currentStatus === 'graded'
                ? 'bg-teal-100 text-teal-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {isPastDue && currentStatus !== 'submitted' && currentStatus !== 'graded' 
                ? 'Past Due' 
                : currentStatus.replace('-', ' ')}
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {assignment.courseName}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700">{assignment.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <CalendarDays className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Due Date</span>
              </div>
              <p className="text-gray-900">{formatDate(assignment.dueDate)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Due Time</span>
              </div>
              <p className="text-gray-900">{formatTime(assignment.dueDate)}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-base font-medium text-gray-900 mb-2">Points</h4>
            <div className="flex items-center">
              <File className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-gray-900">{assignment.maxPoints} points possible</span>
            </div>
          </div>

          {submission || submitSuccess ? (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-500" />
                Submission Details
              </h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Submitted on</p>
                  <p className="text-gray-900">
                    {submission ? formatDate(submission.submittedAt) : formatDate(new Date().toISOString())} at {submission ? formatTime(submission.submittedAt) : formatTime(new Date().toISOString())}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">File</p>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 flex items-center mt-1"
                  >
                    <File className="h-4 w-4 mr-1" />
                    View your submission
                  </a>
                </div>
                
                {submission?.status === 'graded' && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {submission.grade} / {assignment.maxPoints}
                    </p>
                    
                    <p className="text-sm text-gray-500 mt-4">Feedback</p>
                    <p className="text-gray-900 mt-1">
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {isPastDue ? (
                <div className="bg-red-50 p-6 rounded-lg mb-6 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-base font-medium text-red-800">This assignment is past due</h4>
                    <p className="text-sm text-red-700 mt-1">
                      The deadline for this assignment has passed. Contact your instructor if you need to submit late.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Submit Assignment</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload PDF file
                    </label>
                    
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    
                    {file && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <File className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{file.name}</span>
                      </div>
                    )}
                    
                    {submitError && (
                      <p className="mt-2 text-sm text-red-600">{submitError}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={!file || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;