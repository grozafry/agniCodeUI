import React, { useState, useEffect } from 'react';
import API_BASE_URL from './config';
import Footer from './Footer';

const Header = () => (
  <header className="bg-gray-900 py-4">
    {/* <div className="text-center text-white text-2xl font-bold">AgniAI</div> */}
    
                  <button 
                    className="w-full text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition duration-300"
                  >
                    AgniAI Code Review
                  </button>
                
  </header>
);

const Login = ({ setToken, setParentView, setAuthView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        setToken(data.access_token);
        setParentView('dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Dynamic background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMTAiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzIwMjAyMDIwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-30 animate-pulse"></div>
        </div>

        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white bg-opacity-10 rounded-full"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 5}s infinite linear`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-105 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Login to AgniAI</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-md hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 transform hover:scale-105"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <button 
              className="text-purple-400 hover:text-purple-300 underline focus:outline-none transition duration-200"
              onClick={() => setAuthView('signup')}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};


const Signup = ({ setAuthView }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [error, setError] = useState('');

  // Password strength validation function
  const validatePassword = (password) => {
    const minLength = 8;
    let errors = [];

    if (password.length < minLength) {
        errors.push(`at least ${minLength} characters`);
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('one special character');
    }

    if (errors.length > 0) {
        return `Password must contain ${errors.join(', ')}.`;
    }
    
    return null;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, organizationName, organizationType }),
      });
      if (response.status === 201) {
        setAuthView('login');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('Error creating account');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="relative z-10 bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-105 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Sign Up</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Organization Name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <select
                value={organizationType}
                onChange={(e) => setOrganizationType(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              >
                <option value="">Select Organization Size</option>
                <option value="1-5">1-5 members</option>
                <option value="6-10">6-10 members</option>
                <option value="11-50">11-50 members</option>
                <option value="51-100">51-100 members</option>
                <option value="100+">100+ members</option>
              </select>
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-md hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
// Auth Component
const Auth = ({ setToken, setView }) => {
  const [authView, setAuthView] = useState('login');
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black min-h-screen flex flex-col justify-between">
      {authView === 'login' ? (
        <Login setToken={setToken} setParentView={setView} setAuthView={setAuthView} />
      ) : (
        <Signup setAuthView={setAuthView} />
      )}
    </div>
  );
};

export default Auth;
