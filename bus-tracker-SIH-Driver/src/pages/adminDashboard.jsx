import React, { useState, useEffect } from 'react';
import { MapPin, Bus, User, Plus, Trash2, Edit, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]); // Drivers endpoint not yet implemented server-side (placeholder)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const authToken = localStorage.getItem('authToken');

  const apiFetch = async (path, options = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
    let data;
    try { data = await res.json(); } catch { data = null; }
    if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
    return data;
  };

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const [routesRes, busesRes, driversRes] = await Promise.all([
        apiFetch('/api/routes'),
        apiFetch('/api/buses'),
        apiFetch('/api/tracking/drivers').catch(() => ({ drivers: [] }))
      ]);
      setRoutes(routesRes.routes.map(r => ({
        _id: r._id,
        routeId: r.routeId,
        name: r.name,
        stops: r.stops?.map(s => s.name) || [],
        status: 'active'
      })));
      setBuses(busesRes.buses.map(b => ({
        _id: b._id,
        busId: b.busId,
        routeId: b.route?._id,
        routeName: b.route?.name,
        status: b.status,
        driver: b.driverName || '—'
      })));
      setDrivers(driversRes.drivers.map(d => ({
        _id: d._id,
        driverId: d.driverId,
        name: d.name,
        busId: d.busId, // raw ObjectId; could populate later
        status: 'active'
      })));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Route Management
  const [newRoute, setNewRoute] = useState({ name: '', stops: [] });
  const [editingRoute, setEditingRoute] = useState(null);
  const [newStop, setNewStop] = useState('');

  const addStopToRoute = () => {
    if (newStop.trim()) {
      if (editingRoute) {
        setRoutes(routes.map(route => 
          route.id === editingRoute 
            ? { ...route, stops: [...route.stops, newStop.trim()] }
            : route
        ));
      } else {
        setNewRoute({ ...newRoute, stops: [...newRoute.stops, newStop.trim()] });
      }
      setNewStop('');
    }
  };

  const removeStopFromRoute = (routeId, stopIndex) => {
    setRoutes(routes.map(route => 
      route.id === routeId 
        ? { ...route, stops: route.stops.filter((_, index) => index !== stopIndex) }
        : route
    ));
  };

  const saveRoute = async () => {
    if (!newRoute.name || newRoute.stops.length < 2) return;
    try {
      setLoading(true); setError('');
      if (editingRoute) {
        // No backend PUT implemented yet (placeholder optimistic update)
        setRoutes(routes.map(r => r._id === editingRoute ? { ...r, name: newRoute.name, stops: newRoute.stops } : r));
        setEditingRoute(null);
      } else {
        // Need stop IDs: create stops first then create route
        // Sequentially create stops (could batch later)
        const createdStopIds = [];
        for (const stopName of newRoute.stops) {
          const stopRes = await apiFetch('/api/routes/stops', { method: 'POST', body: JSON.stringify({ name: stopName, coordinates: [0,0] }) });
          createdStopIds.push(stopRes.stop._id);
        }
        const routeRes = await apiFetch('/api/routes', { method: 'POST', body: JSON.stringify({ routeId: `R-${Date.now()}`, name: newRoute.name, stops: createdStopIds }) });
        setRoutes(prev => [...prev, { _id: routeRes.route._id, routeId: routeRes.route.routeId, name: routeRes.route.name, stops: routeRes.route.stops.map(s=>s.name), status: 'active' }]);
      }
      setNewRoute({ name: '', stops: [] });
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const editRoute = (route) => {
    setEditingRoute(route._id);
    setNewRoute({ name: route.name, stops: [...route.stops] });
  };

  const deleteRoute = (routeId) => {
    // Backend delete not implemented yet; optimistic removal
    setRoutes(routes.filter(route => route._id !== routeId));
  };

  const toggleRouteStatus = (routeId) => {
    setRoutes(routes.map(route => 
      route._id === routeId 
        ? { ...route, status: route.status === 'active' ? 'inactive' : 'active' }
        : route
    ));
  };

  // Bus Management
  const [newBus, setNewBus] = useState({ busId: '', routeId: '', driver: '' });
  const [editingBus, setEditingBus] = useState(null);

  const saveBus = () => {
    if (editingBus) {
      setBuses(buses.map(bus => 
        bus.id === editingBus 
          ? { ...bus, busId: newBus.busId, routeId: parseInt(newBus.routeId), driver: newBus.driver }
          : bus
      ));
      setEditingBus(null);
    } else {
      const bus = {
        id: Date.now(),
        busId: newBus.busId,
        routeId: parseInt(newBus.routeId),
        status: 'active',
        driver: newBus.driver
      };
      setBuses([...buses, bus]);
    }
    setNewBus({ busId: '', routeId: '', driver: '' });
  };

  const editBus = (bus) => {
    setEditingBus(bus.id);
    setNewBus({ busId: bus.busId, routeId: bus.routeId.toString(), driver: bus.driver });
  };

  const deleteBus = (busId) => {
    setBuses(buses.filter(bus => bus.id !== busId));
  };

  const toggleBusStatus = (busId) => {
    setBuses(buses.map(bus => 
      bus.id === busId 
        ? { ...bus, status: bus.status === 'active' ? 'inactive' : 'active' }
        : bus
    ));
  };

  // Driver Management
  const [newDriver, setNewDriver] = useState({ name: '', busId: '', phone: '' });
  const [editingDriver, setEditingDriver] = useState(null);

  const saveDriver = () => {
    if (editingDriver) {
      setDrivers(drivers.map(d => (d._id === editingDriver || d.driverId === editingDriver)
        ? { ...d, name: newDriver.name, busId: newDriver.busId, phone: newDriver.phone }
        : d));
      setEditingDriver(null);
    } else {
      const tempId = `temp-${Date.now()}`;
      const driver = {
        _id: tempId,
        driverId: newDriver.driverId || tempId,
        name: newDriver.name,
        busId: newDriver.busId,
        phone: newDriver.phone,
        status: 'active'
      };
      setDrivers([...drivers, driver]);
    }
    setNewDriver({ name: '', busId: '', phone: '' });
  };

  const editDriver = (driver) => {
    setEditingDriver(driver._id || driver.driverId);
    setNewDriver({ name: driver.name, busId: driver.busId, phone: driver.phone });
  };

  const deleteDriver = (driverId) => {
    setDrivers(drivers.filter(d => (d._id || d.driverId) !== driverId));
  };

  const toggleDriverStatus = (driverId) => {
    setDrivers(drivers.map(d => (d._id === driverId || d.driverId === driverId)
      ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' }
      : d));
  };

  const getRouteName = (routeId) => {
    const route = routes.find(r => r._id === routeId);
    return route ? route.name : 'Unknown Route';
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 pt-10">Admin Dashboard</h1>
          <p className="text-white/70">Manage routes, buses, and drivers</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-md rounded-lg p-1">
          {[
            { id: 'routes', label: 'Routes', icon: MapPin },
            { id: 'buses', label: 'Buses', icon: Bus },
            { id: 'drivers', label: 'Drivers', icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

  {/* Global status / error */}
  {loading && <div className="text-white mb-4">Loading...</div>}
  {error && <div className="text-red-400 mb-4">{error}</div>}

  {/* Routes Tab */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            {/* Add/Edit Route Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingRoute ? 'Edit Route' : 'Add New Route'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Route Name</label>
                  <input
                    type="text"
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                    className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter route name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Stops</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newStop}
                      onChange={(e) => setNewStop(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addStopToRoute()}
                      className="flex-1 rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Add a stop"
                    />
                    <button
                      onClick={addStopToRoute}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {newRoute.stops.map((stop, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2">
                        <span className="text-white">{stop}</span>
                        <button
                          onClick={() => setNewRoute({ ...newRoute, stops: newRoute.stops.filter((_, i) => i !== index) })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={saveRoute}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingRoute ? 'Update Route' : 'Add Route'}</span>
                  </button>
                  {editingRoute && (
                    <button
                      onClick={() => {
                        setEditingRoute(null);
                        setNewRoute({ name: '', stops: [] });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Routes List */}
            <div className="grid gap-4">
              {routes.map(route => (
                <div key={route._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{route.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          route.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {route.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRouteStatus(route._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          route.status === 'active'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-500 hover:bg-gray-600 text-white'
                        }`}
                        title={`${route.status === 'active' ? 'Deactivate' : 'Activate'} Route`}
                      >
                        {route.status === 'active' ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => editRoute(route)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRoute(route._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-white/80">Stops:</h5>
                    <div className="flex flex-wrap gap-2">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="bg-white/10 rounded-lg px-3 py-1 text-white text-sm">
                          {stop}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buses Tab */}
        {activeTab === 'buses' && (
          <div className="space-y-6">
            {/* Add/Edit Bus Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingBus ? 'Edit Bus' : 'Add New Bus'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Bus ID</label>
                  <input
                    type="text"
                    value={newBus.busId}
                    onChange={(e) => setNewBus({ ...newBus, busId: e.target.value })}
                    className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="BUS-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Route</label>
                  <select
                    value={newBus.routeId}
                    onChange={(e) => setNewBus({ ...newBus, routeId: e.target.value })}
                    className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Route</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.id} className="bg-gray-800">
                        {route.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Driver</label>
                  <input
                    type="text"
                    value={newBus.driver}
                    onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
                    className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Driver Name"
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={saveBus}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBus ? 'Update Bus' : 'Add Bus'}</span>
                </button>
                {editingBus && (
                  <button
                    onClick={() => {
                      setEditingBus(null);
                      setNewBus({ busId: '', routeId: '', driver: '' });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Buses List */}
            <div className="grid gap-4">
              {buses.map(bus => (
                <div key={bus.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{bus.busId}</h4>
                        <p className="text-white/70">Route: {getRouteName(bus.routeId)}</p>
                        <p className="text-white/70">Driver: {bus.driver}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bus.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {bus.status}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleBusStatus(bus.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            bus.status === 'active'
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                          }`}
                          title={`${bus.status === 'active' ? 'Deactivate' : 'Activate'} Bus`}
                        >
                          {bus.status === 'active' ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => editBus(bus)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBus(bus.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            {/* Add/Edit Driver Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingDriver ? 'Edit Driver' : 'Add New Driver'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Driver Name</label>
                  <input
                    type="text"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Bus ID</label>
                  <input
                    type="text"
                    value={newDriver.busId}
                    onChange={(e) => setNewDriver({ ...newDriver, busId: e.target.value })}
                    className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="BUS-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
                  <input
                    type="text"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={saveDriver}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingDriver ? 'Update Driver' : 'Add Driver'}</span>
                </button>
                {editingDriver && (
                  <button
                    onClick={() => {
                      setEditingDriver(null);
                      setNewDriver({ name: '', busId: '', phone: '' });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Drivers List */}
            <div className="grid gap-4">
              {drivers.map(driver => (
                <div key={driver._id || driver.driverId} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{driver.name} <span className="text-white/50 text-xs">({driver.driverId})</span></h4>
                        <p className="text-white/70">Bus: {driver.busId || '—'}</p>
                        <p className="text-white/70">Phone: {driver.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        driver.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {driver.status}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleDriverStatus(driver._id || driver.driverId)}
                          className={`p-2 rounded-lg transition-colors ${
                            driver.status === 'active'
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                          }`}
                          title={`${driver.status === 'active' ? 'Deactivate' : 'Activate'} Driver`}
                        >
                          {driver.status === 'active' ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => editDriver(driver)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDriver(driver._id || driver.driverId)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;