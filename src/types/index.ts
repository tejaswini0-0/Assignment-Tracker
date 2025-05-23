export interface User {
  id: string;
  username: string;
  role: 'student' | 'teacher';
  name: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: 'upcoming' | 'active' | 'past-due' | 'submitted' | 'graded';
  maxPoints: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacher: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl: string;
  status: 'submitted' | 'under-review' | 'graded';
  feedback?: string;
  grade?: number;
}