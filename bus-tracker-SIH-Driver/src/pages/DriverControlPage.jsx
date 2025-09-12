// src/components/DriverControlPage.js

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

const DriverControlPage = () => {
  const [busId, setBusId] = useState('');
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  // Connect socket lazily when journey starts
  const ensureSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, { autoConnect: true });
      socketRef.current.on('connect', () => setConnected(true));
      socketRef.current.on('disconnect', () => setConnected(false));
      socketRef.current.on('connect_error', (e) => setError('Socket connection failed'));
    }
    return socketRef.current;
  };

  const emitLocation = (latitude, longitude) => {
    const socket = ensureSocket();
    socket.emit('send-location', { busId: busId.trim(), latitude, longitude });
    setLastLocation({ latitude, longitude, at: new Date().toISOString() });
  };

  const pollLocationOnce = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        emitLocation(latitude, longitude);
      },
      (err) => setError('Geolocation error: ' + err.message),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleStartJourney = () => {
    setError('');
    if (!busId.trim()) {
      setError('Please enter a Bus ID');
      return;
    }
    setIsJourneyStarted(true);
    ensureSocket();
    // Send immediate location then every 5s
    pollLocationOnce();
    intervalRef.current = setInterval(() => {
      setSending(true);
      pollLocationOnce();
      setTimeout(() => setSending(false), 400); // short visual pulse
    }, 5000);
  };

  const handleEndJourney = () => {
    setIsJourneyStarted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.emit('end_journey', { busId });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSending(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-bg text-gray-100 font-sans">
      <div className="w-full max-w-sm p-10 bg-dark-container rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Driver Control Panel</h1>
        <p className="text-sm mb-6 text-gray-400">{connected ? 'Socket connected' : 'Socket disconnected'} {sending && isJourneyStarted && <span className="ml-2 text-brand-orange">• updating</span>}</p>
        
        <div className="mb-6">
          <input
            type="text"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            placeholder="Enter Bus ID"
            className="w-full p-4 bg-dark-bg border border-dark-border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isJourneyStarted}
          />
          {error && <p className="mt-2 text-sm text-red-400 text-left">{error}</p>}
          {lastLocation && (
            <p className="mt-3 text-xs text-left text-gray-500">Last: {lastLocation.latitude.toFixed(5)}, {lastLocation.longitude.toFixed(5)} @ {new Date(lastLocation.at).toLocaleTimeString()}</p>
          )}
        </div>

        <div className="flex justify-center">
          {!isJourneyStarted ? (
            <button
              onClick={handleStartJourney}
              className="w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-brand-pink to-brand-orange shadow-lg shadow-brand-orange/30 transition-transform duration-200 hover:scale-105"
            >
              Start Journey
            </button>
          ) : (
            <button
              onClick={handleEndJourney}
              className="w-full py-3 px-4 rounded-lg font-bold text-white bg-brand-blue shadow-lg shadow-brand-blue/30 transition-transform duration-200 hover:scale-105"
            >
              End Journey
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverControlPage;