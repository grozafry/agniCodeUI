import React, { useState, useEffect } from 'react';
import { GitPullRequest, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'; // Added ExternalLink icon
import fetchWithAuth from './fetchWithAuth';

const PullRequestList = ({ setView, setSelectedPR, repoId }) => {
  const [prs, setPRs] = useState([]);
  const [expandedPR, setExpandedPR] = useState(null);
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

  const togglePRDetails = (prId) => {
    setExpandedPR(expandedPR === prId ? null : prId);
  };

  return (
    <div className="p-6 bg-gray-900">
      <h1 className="text-2xl font-medium mb-6 text-gray-100">Pull Requests</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {prs.map(pr => (
          <div key={pr.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div
              className="p-4 flex items-center cursor-pointer hover:bg-gray-700 transition-colors duration-300 group"
              onClick={() => togglePRDetails(pr.id)}
            >
              <GitPullRequest className="mr-3 text-emerald-400 w-5 h-5" />
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-100 flex items-center">
                  {pr.title}
                  <a
                    href={pr.url} // GitHub PR link from the backend
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 inline-block" />
                    <span className="ml-1">Go to PR</span>
                  </a>
                </h2>
                <p className="text-sm text-gray-400">
                  {pr.repository_name} - {pr.status}
                </p>
              </div>
              {expandedPR === pr.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
            {expandedPR === pr.id && <PullRequestDetail pr={pr} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const PullRequestDetail = ({ pr }) => {
  const [aiComments, setAiComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAiComments = async () => {
      try {
        const data = await fetchWithAuth(`/ai_comments/${pr.id}`);
        setAiComments(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch AI review comments');
        setLoading(false);
      }
    };

    fetchAiComments();
  }, [pr.id]);

  return (
    <div className="p-4 border-t border-gray-700">
      {loading && <p className="text-blue-400 mb-3">Loading...</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <h3 className="text-sm font-medium text-gray-400 mb-2">AI Review Comments</h3>
      {aiComments.length === 0 ? (
        <p className="text-sm text-gray-400">No AI review comments available.</p>
      ) : (
        <div className="space-y-4">
          {aiComments.map((comment) => (
            <div key={comment.created_at} className="bg-gray-700 rounded-lg max-w-2xl p-4 shadow-sm ml-auto">
              <div className="flex items-center justify-between mb-2 group">
                <span className="text-sm font-semibold text-gray-300 flex items-center">
                  {comment.file_name}
                  <a
                    href={comment.url} // Comment link from backend
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 inline-block" />
                    <span className="ml-1">Go to Comment</span>
                  </a>
                </span>
                <span className="text-xs text-gray-400">Line: {comment.line_number}</span>
              </div>
              <p className="text-sm text-gray-200 mb-2">{comment.content}</p>
              <p className="text-xs text-gray-400">Created at: {new Date(comment.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export default PullRequestList;