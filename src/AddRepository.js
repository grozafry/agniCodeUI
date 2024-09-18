import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import fetchWithAuth from './fetchWithAuth'; // Import the utility function

const AddRepository = ({ onAdd }) => {
  const [error, setError] = useState('');

  const handleInstallGitHubApp = async () => {
    try {
      const response = await fetchWithAuth('github/app_install_url');
      window.location.href = response.url; // Redirect to GitHub App installation URL
    } catch (error) {
      setError('Failed to get GitHub App installation URL');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Add Repositories</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button 
        onClick={handleInstallGitHubApp}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Install GitHub App
      </button>
    </div>
  );
};

const Dashboard = ({ setView, setSelectedRepoId }) => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const [showAddRepo, setShowAddRepo] = useState(false);

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
      fetchRepos(); // Refresh repositories after installation
    } catch (error) {
      setError('Failed to add repositories');
    }
  };

  const handleAddRepo = () => {
    setShowAddRepo(false);
    fetchRepos();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Repositories</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map(repo => (
          <div key={repo.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{repo.name}</h2>
            <p className="text-gray-600">{repo.url}</p>
            <button 
              onClick={() => {
                // console.log('adding repo.id', repo.id);
                setSelectedRepoId(repo.id);
                setView('prs');
              }} 
              className="text-blue-500 hover:underline"
            >
              View PRs
            </button>
          </div>
        ))}
        <div 
          onClick={() => setShowAddRepo(!showAddRepo)} 
          className="bg-gray-100 p-4 rounded shadow flex items-center justify-center cursor-pointer"
        >
          <Camera className="mr-2" />
          <span>{showAddRepo ? 'Cancel' : 'Add Repository'}</span>
        </div>
        {showAddRepo && <AddRepository onAdd={handleAddRepo} />}
      </div>
    </div>
  );
};

export { Dashboard, AddRepository };
