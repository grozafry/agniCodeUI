// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { format } from 'date-fns';

// // Dummy data
// const generateDummyData = () => {
//   const startDate = new Date('2023-01-01');
//   const data = [];
//   for (let i = 0; i < 12; i++) {
//     const date = new Date(startDate);
//     date.setMonth(startDate.getMonth() + i);
//     data.push({
//       date: format(date, 'MMM yyyy'),
//       count: Math.floor(Math.random() * 500) + 100,
//     });
//   }
//   return data;
// };

// const Metrics = () => {
//   const [data, setData] = useState(generateDummyData());
//   const [dateRange, setDateRange] = useState({
//     from: '2023-01-01',
//     to: '2023-12-31',
//   });

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setDateRange(prev => ({ ...prev, [name]: value }));
//   };

//   const applyDateFilter = () => {
//     // In a real scenario, you would fetch data from an API here
//     // For now, we'll just regenerate dummy data
//     setData(generateDummyData());
//   };

//   return (
//     <div className="w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white p-6 rounded-lg shadow-lg">
//       <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold mb-4 sm:mb-0">AI Code Review Metrics</h2>
//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
//           <input
//             type="date"
//             name="from"
//             value={dateRange.from}
//             onChange={handleDateChange}
//             className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
//           />
//           <input
//             type="date"
//             name="to"
//             value={dateRange.to}
//             onChange={handleDateChange}
//             className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
//           />
//           <button
//             onClick={applyDateFilter}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
//           >
//             Apply Filter
//           </button>
//         </div>
//       </div>
//       <div className="h-[400px] mt-4">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//             <XAxis dataKey="date" stroke="#888" />
//             <YAxis stroke="#888" />
//             <Tooltip
//               contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px', padding: '10px' }}
//               itemStyle={{ color: '#fff' }}
//             />
//             <Line
//               type="monotone"
//               dataKey="count"
//               stroke="#8884d8"
//               strokeWidth={2}
//               dot={{ r: 4 }}
//               activeDot={{ r: 8 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Metrics;

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import fetchWithAuth from './fetchWithAuth';

const MetricsChart = () => {
  const [data, setData] = useState([]);


  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get today's date
  const today = new Date();

  // Get one month before today
  const oneMonthBefore = new Date(today);
  oneMonthBefore.setMonth(today.getMonth() - 1);

  // Get one month after today
  const oneMonthAfter = new Date(today);
  oneMonthAfter.setMonth(today.getMonth() + 1);

  const [dateRange, setDateRange] = useState({
    from: formatDate(oneMonthBefore),
    to: formatDate(oneMonthAfter),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`/api/metrics?from=${dateRange.from}&to=${dateRange.to}`);
      
      setData(response.map(item => ({
        ...item,
        date: format(parseISO(item.date), 'MMM yyyy')
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const applyDateFilter = () => {
    fetchData();
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
//   if (data.length === 0) {
//     return (
//       <div className="w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white p-6 rounded-lg shadow-lg flex items-center justify-center h-[400px]">
//         <p className="text-2xl font-bold">No data available</p>
//       </div>
//     );
//   }


  return (
    <div className="w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">AI Code Review Metrics</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="date"
            name="from"
            value={dateRange.from}
            onChange={handleDateChange}
            className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
          />
          <input
            type="date"
            name="to"
            value={dateRange.to}
            onChange={handleDateChange}
            className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
          />
          <button
            onClick={applyDateFilter}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Apply Filter
          </button>
        </div>
      </div>
      <div className="h-[400px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px', padding: '10px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;