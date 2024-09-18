import React, { useState, useEffect } from 'react';
import { GitPullRequest } from 'lucide-react';
import fetchWithAuth from './fetchWithAuth';

const PullRequestList = ({ setView, setSelectedPR, repoId }) => {
  const [prs, setPRs] = useState([]);
  const [error, setError] = useState('');

  const fetchPullRequests = async () => {
    try {
      const data = await fetchWithAuth(`/pullrequests?repo_id=${repoId}`);
      setPRs(data);
    } catch (error) {
      setError('Failed to fetch pull requests');
    }
  };

  useEffect(() => {
    fetchPullRequests();
  }, [repoId]);
  return (
    <div className="p-4">
      <h1 className="text-xl font-medium mb-4 text-white">Pull Requests</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="space-y-3">
        {prs.map(pr => (
          <div
            key={pr.id}
            className="bg-white p-3 rounded-md shadow-sm border border-gray-200 flex items-center hover:bg-gray-50 transition ease-in-out duration-200"
          >
            <GitPullRequest className="mr-3 text-green-500 w-5 h-5" />
            <div className="flex-1">
              <h2 className="text-base font-semibold">{pr.title}</h2>
              <p className="text-sm text-gray-500">{pr.repository_name} - {pr.status}</p>
            </div>
            <button 
              onClick={() => { setSelectedPR(pr); setView('pr-detail'); }} 
              className="ml-auto text-sm text-blue-500 hover:text-blue-600 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PullRequestList;
