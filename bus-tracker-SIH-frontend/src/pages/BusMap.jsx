import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import { getBusDetails } from '../services/api'; // Adjust path if needed

export default function BusMap() {
  const { busId } = useParams();
  const [busLocation, setBusLocation] = useState(null);
  const [busDetails, setBusDetails] = useState(null);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const data = await getBusDetails(busId);
        setBusDetails(data.bus);
        if (data.bus.location && data.bus.location.coordinates) {
          setBusLocation([data.bus.location.coordinates[1], data.bus.location.coordinates[0]]);
        }
      } catch (error) {
        console.error("Failed to fetch bus details", error);
      }
    };

    fetchBusDetails();

    const socket = io('http://localhost:8000');

    socket.on('recieve-location', (data) => {
      if (data.id === busId) {
        setBusLocation([data.latitude, data.longitude]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [busId]);

  if (!busLocation || !busDetails) {
    return <div className="text-white text-center pt-40">Loading Bus Data...</div>;
  }

  // ... JSX remains the same
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gray-900 text-white p-10">
      {/* ... */}
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/2 w-full bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 md:mb-0">
          <h2 className="text-2xl font-semibold mb-4">Bus Details</h2>
          <p><span className="font-semibold">Bus ID:</span> {busDetails.busId}</p>
          <p><span className="font-semibold">Driver Name:</span> {busDetails.driverName}</p>
          {busDetails.route && (
            <>
              <p><span className="font-semibold">Route:</span> {busDetails.route.name}</p>
              <p><span className="font-semibold">Stops:</span> {busDetails.route.stops.map(stop => stop.name).join(', ')}</p>
            </>
          )}
        </div>
        <div className="md:w-1/2 w-full">
          <MapContainer center={busLocation} zoom={15} className="h-[500px] w-[500px] rounded-2xl shadow-lg">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={busLocation}></Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}