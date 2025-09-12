import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findRoutes, getActiveBuses } from './../api/api'; // Adjust path if needed

export default function FindBuses() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFindBuses = async () => {
    setError('');
    try {
      const routeData = await findRoutes(from, to);
      const routeId = routeData.routes[0]._id;

      const busesData = await getActiveBuses(routeId);
      setBuses(busesData.buses);

    } catch (err) {
      setError(err.message);
      setBuses([]);
    }
  };

  const handleTrackBus = (busId) => {
    navigate(`/busmap/${busId}`);
  };

  // ... JSX remains the same
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-10 pt-20">
      {/* ... */}
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Find Buses</h2>
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder="From"
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            required
          />
          <input
            type="text"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="To"
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            required
          />
        </div>
        <button
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-semibold py-3 rounded-lg transition"
          onClick={handleFindBuses}
        >
          Find Buses
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {buses.length > 0 && (
        <div className="max-w-3xl mx-auto mt-12 grid gap-6">
          {buses.map((bus) => (
            <div
              key={bus.busId}
              className="p-6 bg-gray-800 rounded-2xl shadow-lg flex justify-between items-center hover:bg-gray-700 transition"
            >
              <span className="text-2xl font-medium">{bus.driverName} - Bus ID: {bus.busId}</span>
              <button
                className="bg-blue-600 hover:bg-blue-700 m-3 text-white px-5 py-2 rounded-lg transition"
                onClick={() => handleTrackBus(bus.busId)}
              >
                Track Live
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}