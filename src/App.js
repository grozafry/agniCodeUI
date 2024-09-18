import React, { useState, useEffect } from 'react';
import Auth from './Login';
import { Dashboard, AddRepository } from './AddRepository';
import PullRequestList from './PullRequestList';
import PullRequestDetail from './PullRequestDetail';
import fetchWithAuth from './fetchWithAuth';

const App = () => {
  const [view, setView] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [selectedPR, setSelectedPR] = useState(null);
  const [selectedRepoId, setSelectedRepoId] = useState(null);

  useEffect(() => {
    if (token) {
      setView('dashboard');
    }
  }, [token]);

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
      setView('dashboard');
    } catch (error) {
      console.error('Failed to add repositories:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetchWithAuth('auth/logout', { method: 'POST' });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setView('login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (view === 'login') {
    return <Auth setToken={setToken} setView={setView} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <nav className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={() => setView('dashboard')}
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-600 hover:from-indigo-500 hover:to-pink-700 transition duration-300"
                >
                  AgniAI Code Reviewer
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setView('dashboard')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
              >
                Dashboard
              </button>
              <button 
                onClick={() => {setSelectedRepoId(null); setView('prs')}}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
              >
                Pull Requests
              </button>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-red-500 focus:outline-none focus:text-red-500 transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-700 rounded-lg h-96 overflow-auto">
            {view === 'dashboard' && (
              <Dashboard setView={setView} setSelectedRepoId={setSelectedRepoId} />
            )}
            {view === 'prs' && (
              <PullRequestList setView={setView} setSelectedPR={setSelectedPR} repoId={selectedRepoId} />
            )}
            {view === 'pr-detail' && selectedPR && (
              <PullRequestDetail pr={selectedPR} setView={setView} />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © 2023 AgniAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;