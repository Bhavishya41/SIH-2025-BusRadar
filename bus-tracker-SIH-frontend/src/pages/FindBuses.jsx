import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FindBuses() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  const handleFindBuses = () => {
    setBuses([
      { id: 'bus1', name: 'Bus 101' },
      { id: 'bus2', name: 'Bus 202' },
    ]);
  };

  const handleTrackBus = (busId) => {
    navigate(`/map/${busId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-10 pt-20">
      <h1 className="text-5xl font-extrabold text-center mb-12">Real-Time Public Transport Tracking</h1>

      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <input
          type="text"
          placeholder="From"
          className="w-full mb-4 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="text"
          placeholder="To"
          className="w-full mb-6 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-semibold py-3 rounded-lg transition"
          onClick={handleFindBuses}
        >
          Find Buses
        </button>
      </div>

      {buses.length > 0 && (
        <div className="max-w-3xl mx-auto mt-12 grid gap-6">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="p-6 bg-gray-800 rounded-2xl shadow-lg flex justify-between items-center hover:bg-gray-700 transition"
            >
              <span className="text-2xl font-medium">{bus.name}</span>
              <button
                className="bg-blue-600 hover:bg-blue-700 m-3 text-white px-5 py-2 rounded-lg transition"
                onClick={() => handleTrackBus(bus.id)}
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
