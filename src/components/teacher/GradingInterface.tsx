import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { mockSubmissions, mockAssignments } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import { File, Clock, User, BookOpen, CheckCircle } from 'lucide-react';

const GradingInterface: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.role !== 'teacher') {
    return <Navigate to="/" />;
  }
  
  const submission = mockSubmissions.find((s) => s.id === id);
  
  if (!submission) {
    return <Navigate to="/teacher-dashboard" />;
  }
  
  const assignment = mockAssignments.find((a) => a.id === submission.assignmentId);
  
  if (!assignment) {
    return <Navigate to="/teacher-dashboard" />;
  }
  
  const [grade, setGrade] = useState<number>(submission.grade || 0);
  const [feedback, setFeedback] = useState<string>(submission.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // In a real app, we would send the grade and feedback to the server here
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Grade Submission
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Review and provide feedback on this submission.
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-gray-500" />
                Assignment Details
              </h4>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h5 className="font-medium text-gray-900">{assignment.title}</h5>
                <p className="text-sm text-gray-500 mt-1">{assignment.courseName}</p>
                <p className="text-sm text-gray-700 mt-3">{assignment.description}</p>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Due Date:</span>{' '}
                    {formatDate(assignment.dueDate)} at {formatTime(assignment.dueDate)}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Max Points:</span> {assignment.maxPoints}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                Student Information
              </h4>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium text-gray-900">{submission.studentName}</p>
                
                <div className="mt-4 text-sm">
                  <p className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    Submitted on {formatDate(submission.submittedAt)} at {formatTime(submission.submittedAt)}
                  </p>
                  
                  <p className="flex items-center mt-2 text-gray-600">
                    <File className="h-4 w-4 mr-2 text-gray-500" />
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Download Submission
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-base font-medium text-gray-900 mb-6">
              Grading
            </h4>
            
            {success ? (
              <div className="bg-green-50 p-4 rounded-md flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-800">Grade submitted successfully</h4>
                  <p className="text-sm text-green-700 mt-1">
                    The student will be notified of their grade and feedback.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                      Grade (out of {assignment.maxPoints})
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        min="0"
                        max={assignment.maxPoints}
                        id="grade"
                        name="grade"
                        value={grade}
                        onChange={(e) => setGrade(Number(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                      Feedback
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="feedback"
                        name="feedback"
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Provide detailed feedback to the student"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Grade'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingInterface;