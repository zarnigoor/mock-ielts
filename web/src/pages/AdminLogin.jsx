import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Oddiy admin autentifikatsiya (haqiqiy proyektda JWT ishlatiladi)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-center" style={{minHeight: 'calc(100vh - 200px)'}}>
      <div className="card" style={{maxWidth: '400px', width: '100%'}}>
        <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>
        
        {error && (
          <div className="error mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="admin"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{width: '100%'}}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue rounded-lg border-blue text-center">
          <p className="text-sm">
            <strong>For testing:</strong><br/>
            Username: admin<br/>
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;