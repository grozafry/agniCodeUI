import React, { useState, useEffect } from 'react';
import fetchWithAuth from './fetchWithAuth';

const Metrics = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [repositories, setRepositories] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const repos = await fetchWithAuth('/repositories');
        setRepositories(repos.repositories);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchRepositories();
  }, []);

  const handleRepoSelection = (repoId) => {
    setSelectedRepos((prevSelected) =>
      prevSelected.includes(repoId)
        ? prevSelected.filter((id) => id !== repoId)
        : [...prevSelected, repoId]
    );
  };

  const fetchMetrics = async () => {
    if (selectedRepos.length === 0) {
      setError('Please select at least one repository.');
      return;
    }

    setError('');
    try {
      const severityResponse = await fetchWithAuth(
        `/metrics/severity?year=${year}&repos=${selectedRepos.join(',')}`
      );
      setSeverityData(severityResponse);

      const categoryResponse = await fetchWithAuth(
        `/metrics/category?year=${year}&repos=${selectedRepos.join(',')}`
      );
      setCategoryData(categoryResponse);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const severityColors = {
    Critical: 'bg-red-600 text-white',
    High: 'bg-red-400 text-white',
    Medium: 'bg-red-200 text-black',
    Low: 'bg-green-200 text-black',
    Informational: 'bg-blue-500 text-white',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        {/* Dashboard Title */}
        {/* <h2 className="text-2xl font-bold">Metrics Dashboard</h2> */}

        {/* Year Selection */}
        <div className="flex items-center space-x-2">
            <label className="text-gray-400">Select Year:</label>
            <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 p-2 rounded"
            >
            {[...Array(5)].map((_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
                </option>
            ))}
            </select>
        </div>

        {/* Repository Selection */}
        <div className="flex items-center space-x-2">
            <label className="text-gray-400">Select Repositories:</label>
            {repositories.length === 0 ? (
            <p>No repositories available.</p>
            ) : (
            repositories.map((repo) => (
                <div key={repo.id} className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id={`repo-${repo.id}`}
                    onChange={() => handleRepoSelection(repo.id)}
                />
                <label htmlFor={`repo-${repo.id}`}>{repo.name}</label>
                </div>
            ))
            )}
        </div>

        {/* Fetch Metrics Button */}
        <button
            onClick={fetchMetrics}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
            Fetch Metrics
        </button>
        </div>


      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Severity Metrics Table */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Severity Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="w-1/6 border border-gray-600 p-2">Month</th>
                <th className="w-1/6 border border-gray-600 p-2">Critical</th>
                <th className="w-1/6 border border-gray-600 p-2">High</th>
                <th className="w-1/6 border border-gray-600 p-2">Medium</th>
                <th className="w-1/6 border border-gray-600 p-2">Low</th>
                <th className="w-1/6 border border-gray-600 p-2">Informational</th>
              </tr>
            </thead>
            <tbody>
              {severityData.map((row, index) => (
                <tr key={index} className="bg-gray-800">
                  <td className="w-1/6 border border-gray-600 p-2">{row.month}</td>
                  <td className={`w-1/6 border border-gray-600 p-2 ${severityColors.Critical}`}>{row.Critical}</td>
                  <td className={`w-1/6 border border-gray-600 p-2 ${severityColors.High}`}>{row.High}</td>
                  <td className={`w-1/6 border border-gray-600 p-2 ${severityColors.Medium}`}>{row.Medium}</td>
                  <td className={`w-1/6 border border-gray-600 p-2 ${severityColors.Low}`}>{row.Low}</td>
                  <td className={`w-1/6 border border-gray-600 p-2 ${severityColors.Informational}`}>{row.Informational}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Metrics Table */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Category Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="w-1/8 border border-gray-600 p-2">Month</th>
                <th className="w-1/8 border border-gray-600 p-2">Accessibility</th>
                <th className="w-1/8 border border-gray-600 p-2">Code Style</th>
                <th className="w-1/8 border border-gray-600 p-2">Compatibility</th>
                <th className="w-1/8 border border-gray-600 p-2">Functionality</th>
                <th className="w-1/8 border border-gray-600 p-2">Internationalization</th>
                <th className="w-1/8 border border-gray-600 p-2">Maintainability</th>
                <th className="w-1/8 border border-gray-600 p-2">Performance</th>
                <th className="w-1/8 border border-gray-600 p-2">Regulatory Compliance</th>
                <th className="w-1/8 border border-gray-600 p-2">Scalability</th>
                <th className="w-1/8 border border-gray-600 p-2">Security</th>
                <th className="w-1/8 border border-gray-600 p-2">Testing</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((row, index) => (
                <tr key={index} className="bg-gray-800">
                  <td className="w-1/8 border border-gray-600 p-2">{row.month}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row.Accessibility}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row['Code Style']}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row.Compatibility}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row.Functionality}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row['Internationalization and Localization']}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row.Maintainability}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row.Performance}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row['Regulatory Compliance']}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row.Scalability}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row.Security}</td>
                  <td className="w-1/8 border border-gray-600 p-2">{row.Testing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
