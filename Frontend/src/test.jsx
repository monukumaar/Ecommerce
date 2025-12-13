import React, { useEffect, useState } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

const App = () => {
  const [data, setData] = useState([]);
  const [graphType, setGraphType] = useState('line');

  useEffect(() => {
  const types = ['line', 'bar', 'pie'];

  const interval = setInterval(() => {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const newPoint = {
      type: randomType,
      name: new Date().toLocaleTimeString(),
      value: Math.floor(Math.random() * 100),
    };

    console.log('📨 Simulated:', newPoint);

    // Simulate WebSocket message
    setGraphType(newPoint.type);
    setData((prev) => [...prev, { name: newPoint.name, value: newPoint.value }].slice(-10));
  }, 2000); // every 2 seconds

  return () => clearInterval(interval);
}, []);


  // useEffect(() => {
  //   const ws = new WebSocket('wss://your-websocket-url'); // Replace with your actual WebSocket

  //   ws.onopen = () => console.log('✅ WebSocket connected');

  //   ws.onmessage = (event) => {
  //     try {
  //       const incoming = JSON.parse(event.data);
  //       console.log('📥 Incoming:', incoming);

  //       if (incoming.type) {
  //         setGraphType(incoming.type); // Update chart type dynamically
  //       }

  //       const { name, value } = incoming;
  //       if (name && value !== undefined) {
  //         setData((prev) => [...prev, { name, value }].slice(-10));
  //       }
  //     } catch (err) {
  //       console.error('❌ Invalid message:', err);
  //     }
  //   };

  //   ws.onerror = (err) => console.error('⚠️ WebSocket error:', err);
  //   ws.onclose = () => console.log('🔌 WebSocket closed');

  //   return () => ws.close();
  // }, []);

  const renderChart = () => {
    if (graphType === 'bar') {
      return (
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      );
    }

    if (graphType === 'pie') {
      return (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }

    // Default to Line Chart
    return (
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </LineChart>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Real-Time Graph (Auto-Type from API)</h2>
      <p>📈 Current Graph Type: <strong>{graphType.toUpperCase()}</strong></p>
      {data.length === 0 ? <p>Waiting for data...</p> : renderChart()}
    </div>
  );
};

export default App;
