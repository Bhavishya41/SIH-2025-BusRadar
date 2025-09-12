import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BusMap from './pages/BusMap'
import FindBuses from './pages/FindBuses'
import Header from './components/Header'

const App = () => {
	return (
		<>
			<Header />
		<BrowserRouter>
			{/* <header className="border-b bg-white">
				<div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
					<Link to="/" className="text-lg font-semibold text-gray-900">Bus Tracker</Link>
					<nav className="flex items-center gap-3 text-sm">
						<Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
						<Link to="/signup" className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg">Signup</Link>
					</nav>
				</div>
			</header> */}
			
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path='/busmap' element={<BusMap />} />
				<Route path='/findbuses' element={<FindBuses />} />

			</Routes>
		</BrowserRouter>
		</>
	)
}

export default App