import { Assignment, Course, Submission, User } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'student1',
    role: 'student',
    name: 'Tejaswini M B'
  },
  {
    id: '2',
    username: 'student2',
    role: 'student',
    name: 'Akriti Khetan'
  },
  {
    id: '3',
    username: 'teacher1',
    role: 'teacher',
    name: 'Prof. Rekha J'
  },
  {
    id: '4',
    username: 'teacher2',
    role: 'teacher',
    name: 'Prof. Bindu S M'
  }
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Software Engineering',
    code: 'IS101',
    teacher: 'Prof. Rekha J'
  },
  {
    id: '2',
    name: 'Data Structures and Algorithms',
    code: 'IS201',
    teacher: 'Prof. Bindu S M'
  },
  {
    id: '3',
    name: 'Web Development',
    code: 'IS301',
    teacher: 'Prof. Bhavani K'
  }
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Introduction to Sofware Engineering',
    description: 'Write a 3-page paper explaining basic software engineering concepts and paradigms.',
    courseId: '1',
    courseName: 'Software Engineering',
    dueDate: '2025-07-15T23:59:59',
    status: 'active',
    maxPoints: 100
  },
  {
    id: '2',
    title: 'Algorithm Efficiency Analysis',
    description: 'Analyze the time and space complexity of the provided algorithms.',
    courseId: '2',
    courseName: 'Data Structures and Algorithms',
    dueDate: '2025-07-10T23:59:59',
    status: 'active',
    maxPoints: 100
  },
  {
    id: '3',
    title: 'Responsive Web Design Project',
    description: 'Create a responsive website following the provided design specifications.',
    courseId: '3',
    courseName: 'Web Development',
    dueDate: '2025-07-20T23:59:59',
    status: 'upcoming',
    maxPoints: 100
  },
  {
    id: '4',
    title: 'Software Engineering Fundamentals Quiz',
    description: 'Complete the online quiz covering software engineering fundamentals.',
    courseId: '1',
    courseName: 'Software Engineering',
    dueDate: '2025-06-30T23:59:59',
    status: 'submitted',
    maxPoints: 50
  },
  {
    id: '5',
    title: 'Sorting Algorithms Implementation',
    description: 'Implement three different sorting algorithms and compare their performance.',
    courseId: '2',
    courseName: 'Data Structures and Algorithms',
    dueDate: '2025-06-25T23:59:59',
    status: 'graded',
    maxPoints: 100
  }
];

// Mock Submissions
export const mockSubmissions: Submission[] = [
  {
    id: '1',
    assignmentId: '4',
    studentId: '1',
    studentName: 'Tejaswini M B',
    submittedAt: '2025-06-29T14:30:00',
    fileUrl: '/mockfiles/submission1.pdf',
    status: 'graded',
    feedback: 'Good work! You demonstrated a solid understanding of the concepts.',
    grade: 45
  },
  {
    id: '2',
    assignmentId: '5',
    studentId: '1',
    studentName: 'Tejaswini M B',
    submittedAt: '2025-06-24T16:45:00',
    fileUrl: '/mockfiles/submission2.pdf',
    status: 'graded',
    feedback: 'Excellent implementation and analysis. Your comparison was thorough and insightful.',
    grade: 95
  },
  {
    id: '3',
    assignmentId: '5',
    studentId: '2',
    studentName: 'Akriti Khetan',
    submittedAt: '2025-06-25T09:15:00',
    fileUrl: '/mockfiles/submission3.pdf',
    status: 'graded',
    feedback: 'Good job on the implementation, but your analysis could be more detailed.',
    grade: 85
  }
];