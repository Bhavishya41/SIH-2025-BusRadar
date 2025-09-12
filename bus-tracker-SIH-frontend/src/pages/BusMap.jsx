import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

export default function BusMap() {
  const { busId } = useParams();
  const [busLocation, setBusLocation] = useState([20.5937, 78.9629]);
  const [busDetails, setBusDetails] = useState({
    stops: ['Stop A', 'Stop B', 'Stop C'],
    driverName: 'John Doe',
    lastStop: 'Stop B',
    eta: '5 mins',
  });

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.emit('join-bus', busId);

    socket.on('bus-location', (location) => {
      setBusLocation([location.lat, location.lng]);
    });

    return () => socket.disconnect();
  }, [busId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-extrabold text-center mb-8">Live Location - Bus ID: {busId}</h1>

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Bus Details</h2>
        <p><span className="font-semibold">Bus ID:</span> {busId}</p>
        <p><span className="font-semibold">Stops:</span> {busDetails.stops.join(', ')}</p>
        <p><span className="font-semibold">Driver Name:</span> {busDetails.driverName}</p>
        <p><span className="font-semibold">Last Stop:</span> {busDetails.lastStop}</p>
        <p><span className="font-semibold">ETA:</span> {busDetails.eta}</p>
      </div>

      <MapContainer center={busLocation} zoom={13} className="h-[600px] w-full rounded-2xl shadow-lg">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={busLocation}></Marker>
      </MapContainer>
    </div>
  );
}
