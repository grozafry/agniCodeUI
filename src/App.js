import React, { useState, useEffect } from 'react';
import Auth from './Login';
import { Dashboard } from './AddRepository';
import PullRequestList from './PullRequestList';
import fetchWithAuth from './fetchWithAuth';
import Footer from './Footer';
import Metrics from './Metrics';

const DynamicBackground = () => (
  <div className="fixed inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMTAiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzIwMjAyMDIwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-10"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-30 animate-pulse"></div>
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
);

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
    <div className="min-h-screen flex flex-col text-gray-100 relative overflow-hidden">
      <DynamicBackground />
      <div className="flex flex-col flex-grow relative z-10">
        <nav className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => setView('dashboard')}
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition duration-300"
                  >
                    AgniAI Code Review
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setView('dashboard')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >
                  Repositories
                </button>
                <button 
                  onClick={() => {setSelectedRepoId(null); setView('prs')}}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >
                  Pull Requests
                </button>
                <button
                onClick={() => setView('metrics')}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >
                  Metrics
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

        <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
              {view === 'dashboard' && (
                <Dashboard setView={setView} setSelectedRepoId={setSelectedRepoId} />
              )}
              {view === 'prs' && (
                <PullRequestList setView={setView} setSelectedPR={setSelectedPR} repoId={selectedRepoId} />
              )}
              {view === 'metrics' && (
                <Metrics />
              )}
            
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;