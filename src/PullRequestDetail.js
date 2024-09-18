import React, { useState, useEffect } from 'react';
import fetchWithAuth from './fetchWithAuth';

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
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4 text-gray-100">Pull Request: {pr.title}</h1>

      {loading && <p className="text-blue-400 mb-3">Loading...</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="bg-gray-800 p-3 rounded-lg shadow-md mb-3">
        <h2 className="text-base font-medium text-gray-100 mb-1">Description</h2>
        <p className="text-sm text-gray-400">{pr.description || 'No description provided.'}</p>
      </div>

      <div className="bg-gray-800 p-3 rounded-lg shadow-md mb-3">
        <h2 className="text-base font-medium text-gray-100 mb-1">Status</h2>
        <p className="text-sm text-gray-400">{pr.status}</p>
      </div>

      <div className="bg-gray-800 p-3 rounded-lg shadow-md">
        <h2 className="text-base font-medium text-gray-100 mb-2">AI Review Comments</h2>
        {aiComments.length === 0 ? (
          <p className="text-sm text-gray-400">No AI review comments available.</p>
        ) : (
          aiComments.map((comment) => (
            <div key={comment.created_at} className="mb-3 border-b border-gray-700 pb-2">
              <h3 className="text-sm font-semibold text-gray-200 mb-1">{comment.file_name}</h3>
              <p className="text-xs text-gray-500 mb-1">Line: {comment.line_number}</p>
              <p className="text-sm text-gray-300 mb-1">{comment.content}</p>
              <p className="text-xs text-gray-500">Created at: {new Date(comment.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PullRequestDetail;
