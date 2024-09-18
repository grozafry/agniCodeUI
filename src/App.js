import React, { useState, useEffect } from 'react';
import Login from './Login'; // Adjust the path as necessary
import { Dashboard, AddRepository } from './AddRepository'; // Import from the new file
import PullRequestList from './PullRequestList';
import PullRequestDetail from './PullRequestDetail';
import fetchWithAuth from './fetchWithAuth'; // Import the fetchWithAuth utility

// API base URL
const API_BASE_URL = 'http://43.204.130.30:7000/';

const App = () => {
  const [view, setView] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [selectedPR, setSelectedPR] = useState(null);
  const [selectedRepoId, setSelectedRepoId] = useState(null);

  // Automatically set view to dashboard if token is present
  useEffect(() => {
    if (token) {
      setView('dashboard');
    }
  }, [token]);

  // Handle GitHub app callback after installation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const installationId = urlParams.get('installation_id');
    const setupAction = urlParams.get('setup_action');

    if (installationId && setupAction === 'install') {
      handleGitHubAppCallback(installationId);
    }
  }, []);

  const handleGitHubAppCallback = async (installationId) => {
    try {
      await fetchWithAuth(`github/afterAuthCode?installation_id=${installationId}&setup_action=install`);
      setView('dashboard'); // Refresh the dashboard after adding repositories
    } catch (error) {
      console.error('Failed to add repositories:', error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Call the logout API
      await fetchWithAuth('auth/logout', { method: 'POST' });

      // Clear tokens from local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Update state
      setToken(null);
      setView('login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // If the user is not logged in, show the Login component
  if (view === 'login') {
    return <Login setToken={setToken} setView={setView} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black ">
      <nav className="bg-gradient-to-r from-gray-800 to-gray-700 shadow mb-4">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-600">
              <button onClick={() => setView('dashboard')}>AgniAI - Code Reviewer</button>
            </div>
            <div className="flex space-x-6">
              <button
                onClick={() => setView('dashboard')}
                className="text-gray-300 hover:text-white transition ease-in-out duration-300 transform hover:scale-105"
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('prs')}
                className="text-gray-300 hover:text-white transition ease-in-out duration-300 transform hover:scale-105"
              >
                Pull Requests
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-500 transition ease-in-out duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard / PR List / PR Detail views */}
      
      {view === 'dashboard' && <Dashboard setView={setView} setSelectedRepoId={setSelectedRepoId} />}
      {view === 'prs' && <PullRequestList setView={setView} setSelectedPR={setSelectedPR} repoId={selectedRepoId} />}
      {view === 'pr-detail' && selectedPR && <PullRequestDetail pr={selectedPR} setView={setView} />}
    </div>
  );
};

export default App;
