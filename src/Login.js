import React, { useState } from 'react';
import API_BASE_URL from './config';

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
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Login to Reveu.AI</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
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
  );
};

const Signup = ({ setAuthView, setParentView }) => {
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
      const data = await response.json();
      if (response.status === 201) {
        setAuthView('login');
      } else {
        // const data = await response.json();
        setError(data.message || `Signup failed: ${response.statusText}`);
      }
    } catch (error) {
      setError('Error creating account');
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Sign Up for Reveu.AI</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          required
        />
        <input
          type="text"
          placeholder="Organization Name"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          required
        />
        <select
          value={organizationType}
          onChange={(e) => setOrganizationType(e.target.value)}
          className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          required
        >
          <option value="">Select Organization Size</option>
          <option value="1-5">1-5 members</option>
          <option value="6-10">6-10 members</option>
          <option value="11-50">11-50 members</option>
          <option value="51-100">51-100 members</option>
          <option value="100+">100+ members</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 bg-gray-800 bg-opacity-50 rounded-md border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          required
        />
        <button 
          type="submit"
          className="w-full p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-md hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 transform hover:scale-105"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Already have an account?{' '}
        <button 
          className="text-purple-400 hover:text-purple-300 underline focus:outline-none transition duration-200"
          onClick={() => setAuthView('login')}
        >
          Log in
        </button>
      </p>
    </div>
  );
};

const Auth = ({ setToken, setParentView, authView, setAuthView }) => {
  return (
    <div className="flex-grow flex items-center justify-center  relative overflow-hidden">
      {/* Dynamic background elements */}

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {authView === 'login' ? (
          <Login setToken={setToken} setParentView={setParentView} setAuthView={setAuthView} />
        ) : (
          <Signup setAuthView={setAuthView} setParentView={setParentView} />
        )}
      </div>
    </div>
  );
};

export default Auth;