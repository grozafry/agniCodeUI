import React, { useState } from 'react';
import API_BASE_URL from './config';

// Header Component
const Header = () => (
  <header className="bg-gray-900 py-4">
    <div className="text-center text-white text-2xl font-bold">AgniAI</div>
  </header>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 py-4">
    <div className="text-center text-gray-400">© 2024 AgniAI. All rights reserved.</div>
  </footer>
);

// Login Component
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
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-105">
          <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-600">Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <button 
              className="text-indigo-400 hover:text-indigo-300 underline focus:outline-none transition duration-200"
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

// Signup Component
const Signup = ({ setAuthView }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
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
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-105">
          <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-600">Sign Up</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <button 
              className="text-indigo-400 hover:text-indigo-300 underline focus:outline-none transition duration-200"
              onClick={() => setAuthView('login')}
            >
              Log in
            </button>
          </p>
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
