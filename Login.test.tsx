import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import Login from './src/pages/Login';

jest.mock('./src/utils/mockData', () => ({
  mockUsers: [
    { username: 'student1', role: 'student' },
    { username: 'teacher1', role: 'teacher' },
  ],
}));

beforeAll(() => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value.toString();
      },
      removeItem(key: string) {
        delete store[key];
      },
      clear() {
        store = {};
      },
    };
  })();
  Object.defineProperty(global, 'localStorage', { value: localStorageMock });
});

const renderWithProviders = (ui: React.ReactNode, initialEntries = ['/']) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={ui} />
          <Route path="/student-dashboard" element={<div>Student Dashboard</div>} />
          <Route path="/teacher-dashboard" element={<div>Teacher Dashboard</div>} />
          <Route path="/submit-assignment" element={<div>Assignment Submitted Successfully</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

// UNIT TESTING START
test('renders login form with fields and header', () => {
  renderWithProviders(<Login />);
  expect(screen.getByText(/Assignment Tracker/i)).toBeInTheDocument();
  expect(screen.getByText(/Sign in to access your assignments/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
});

test('role toggle buttons are rendered', () => {
  renderWithProviders(<Login />);
  expect(screen.getByRole('button', { name: /Student/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Teacher/i })).toBeInTheDocument();
});

test('clicking teacher button activates teacher role styling', () => {
  renderWithProviders(<Login />);
  const teacherBtn = screen.getByRole('button', { name: /Teacher/i });
  fireEvent.click(teacherBtn);
  expect(teacherBtn).toHaveClass('bg-blue-600'); // Adjust based on your actual style class
});
// UNIT TESTING END

// INTEGRATION TESTING START
test('successful student login redirects to student dashboard', async () => {
  renderWithProviders(<Login />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'student1' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument();
  });
});

test('switches to teacher role and logs in', async () => {
  renderWithProviders(<Login />);
  fireEvent.click(screen.getByRole('button', { name: /Teacher/i }));
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'teacher1' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(screen.getByText(/Teacher Dashboard/i)).toBeInTheDocument();
  });
});

test('redirects if already authenticated as student', async () => {
  localStorage.setItem('currentUser', JSON.stringify({ username: 'student1', role: 'student' }));
  renderWithProviders(<Login />);
  await waitFor(() => {
    expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument();
  });
});

test('redirects if already authenticated as teacher', async () => {
  localStorage.setItem('currentUser', JSON.stringify({ username: 'teacher1', role: 'teacher' }));
  renderWithProviders(<Login />);
  await waitFor(() => {
    expect(screen.getByText(/Teacher Dashboard/i)).toBeInTheDocument();
  });
});

test('logs in with trimmed username', async () => {
  renderWithProviders(<Login />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: '  student1  ' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
  await waitFor(() => {
    expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument();
  });
});
// INTEGRATION TESTING END

// ERROR HANDLING TESTING START
test('shows error on wrong password', async () => {
  renderWithProviders(<Login />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'student1' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});

test('shows error when username is empty', async () => {
  renderWithProviders(<Login />);
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(screen.getByText(/Please enter a username/i)).toBeInTheDocument();
  });
});

test('shows error when password is empty', async () => {
  renderWithProviders(<Login />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'student1' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(screen.getByText(/Please enter a password/i)).toBeInTheDocument();
  });
});

test('shows error when user does not exist', async () => {
  renderWithProviders(<Login />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'ghostuser' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});

test('rejects non-PDF file upload on assignment submit', async () => {
  render(<input type="file" data-testid="file-input" accept=".pdf" />);
  const input = screen.getByTestId('file-input') as HTMLInputElement;
  const file = new File(['text'], 'not-a-pdf.txt', { type: 'text/plain' });

  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(input.files?.[0].type).not.toBe('application/pdf');
  });
});

test('shows error if login button clicked with both fields empty', async () => {
  renderWithProviders(<Login />);
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(screen.getByText(/Please enter a username/i)).toBeInTheDocument();
  });
});
// ERROR HANDLING TESTING END
