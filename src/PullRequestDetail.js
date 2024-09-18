import React, { useState, useEffect } from 'react';
import fetchWithAuth from './fetchWithAuth';
// Utility function for making authenticated API calls

const PullRequestDetail = ({ pr }) => {
  const [aiComments, setAiComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch AI review comments for the pull request when the component mounts
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
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4 text-white">Pull Request: {pr.title}</h1>

      {loading && <p className="text-blue-500 mb-3">Loading...</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-3">
        <h2 className="text-base font-medium mb-1">Description</h2>
        <p className="text-sm text-gray-600">{pr.description || 'No description provided.'}</p>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-3">
        <h2 className="text-base font-medium mb-1">Status</h2>
        <p className="text-sm text-gray-600">{pr.status}</p>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
        <h2 className="text-base font-medium mb-2">AI Review Comments</h2>
        {aiComments.length === 0 ? (
          <p className="text-sm text-gray-600">No AI review comments available.</p>
        ) : (
          aiComments.map((comment) => (
            <div key={comment.created_at} className="mb-3 border-b pb-2">
              <h3 className="text-sm font-semibold mb-1">{comment.file_name}</h3>
              <p className="text-xs text-gray-500 mb-1">Line: {comment.line_number}</p>
              <p className="text-sm text-gray-700 mb-1">{comment.content}</p>
              <p className="text-xs text-gray-400">Created at: {new Date(comment.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PullRequestDetail;
