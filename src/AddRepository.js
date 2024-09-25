import React, { useState, useEffect } from 'react';
import { Camera, Plus, GitPullRequest, GitFork } from 'lucide-react';
import fetchWithAuth from './fetchWithAuth';

const AddRepository = ({ onAdd }) => {
  const [error, setError] = useState('');

  const handleInstallGitHubApp = async () => {
    try {
      const response = await fetchWithAuth('github/app_install_url');
      window.location.href = response.url;
    } catch (error) {
      setError('Failed to get GitHub App installation URL');
    }
  };

  return (
    <div className="flex items-center">
      {error && <p className="text-red-500 mr-4">{error}</p>}
      <button 
        onClick={handleInstallGitHubApp}
        className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors duration-300"
      >
        <Plus size={18} className="mr-2" />
        Add Repo from GitHub
      </button>
    </div>
  );
};

const Dashboard = ({ setView, setSelectedRepoId }) => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');

  const fetchRepos = async () => {
    try {
      const data = await fetchWithAuth('repositories');
      setRepos(data.repositories);
    } catch (error) {
      setError('Failed to fetch repositories');
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

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
      fetchRepos();
    } catch (error) {
      setError('Failed to add repositories');
    }
  };

  return (
    <div className="p-6 bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-100">Repositories</h1>
        <AddRepository onAdd={fetchRepos} />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="p-4 bg-opacity-50 rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-medium text-gray-100 flex items-center">
                <GitFork size={18} className="mr-2" />
                {repo.name}
              </h2>
              <span className="text-sm text-emerald-400 flex items-center">
                <GitPullRequest size={16} className="mr-1" />
                {repo.reviewed_prs || 0}
              </span>
            </div>
            <p className="text-gray-400 text-sm truncate">{repo.url}</p>
            <p className="text-gray-400 text-sm mt-2">
              Last reviewed: {repo.last_reviewed}
            </p>
            <button
              onClick={() => {
                setSelectedRepoId(repo.id);
                setView('prs');
              }}
              className="text-blue-400 hover:text-blue-300 mt-2"
            >
              View PRs
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Dashboard, AddRepository };