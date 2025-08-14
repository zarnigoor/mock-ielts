import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import TestPage from './pages/TestPage';
import Results from './pages/Results';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          {/* Header */}
          <header className="header">
            <div className="header-container">
              <Link to="/" className="logo">
                IELTS Mock Exam
              </Link>
              
              <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/test">Test</Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/results" element={<Results />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="footer">
            <p>&copy; 2025 IELTS Mock Exam Platform</p>
            <p className="text-sm mt-2 opacity-60">
              <Link 
                to="/admin/login" 
                className="text-sm opacity-60"
                style={{
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Admin Panel
              </Link>
            </p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
