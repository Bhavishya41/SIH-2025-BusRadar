import React from 'react';
import { MapPin, Clock, Bell, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const BusTracker = () => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center pt-10 overflow-hidden">
      {/* Custom Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url("/src/assets/background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)'
        }}
      ></div>

      {/* City Skyline Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/30 to-transparent">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path 
            d="M0,200 L0,120 L50,120 L50,80 L100,80 L100,60 L150,60 L150,100 L200,100 L200,40 L250,40 L250,90 L300,90 L300,70 L350,70 L350,110 L400,110 L400,50 L450,50 L450,130 L500,130 L500,20 L550,20 L550,140 L600,140 L600,30 L650,30 L650,100 L700,100 L700,80 L750,80 L750,120 L800,120 L800,60 L850,60 L850,90 L900,90 L900,110 L950,110 L950,70 L1000,70 L1000,100 L1050,100 L1050,130 L1100,130 L1100,85 L1150,85 L1150,120 L1200,120 L1200,200 Z" 
            fill="rgba(0,0,0,0.2)"
          />
        </svg>
      </div>

      
      {/* <header className="relative z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-white font-bold text-xl">BusTracker</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-white/80">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Login</a>
          </div>
          
           <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 flex items-center space-x-2">
            <span>Start Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </nav>
      </header> */}
      
      {/* Main Content */}
      <main className="relative z-10 px-6 pt-16 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Live Bus Tracking • Real-time GPS</span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Never miss your bus again
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get precise real-time locations, accurate ETAs, and instant notifications 
              for route changes. Your smartest commuting companion.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">

              <Link to="/findbuses" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-3 group">
                <span>Start Tracking</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              {/* <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-3">
                <Play className="w-5 h-5" />
                <span>Learn more</span>
              </button> */}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Live GPS Tracking */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live GPS Tracking</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Real-time bus locations with 99.9% accuracy
                </p>
              </div>
            </div>

            {/* Smart ETAs */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Smart ETAs</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  AI-powered arrival predictions within 30 seconds
                </p>
              </div>
            </div>

            {/* Smart Alerts */}
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2">
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Smart Alerts</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Custom notifications for delays and route changes
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>
	  


    </div>
  );
};

export default BusTracker;