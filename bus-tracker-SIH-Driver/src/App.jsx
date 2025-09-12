import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/adminDashboard'
import DriverControlPage from './pages/DriverControlPage'
import Login from './pages/Login'
import Header from './components/Header'

const App = () => {
	return (
		<>
		<BrowserRouter>
			<Header />
			
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/startJourney" element={<DriverControlPage />} />
				<Route path="/adminDashboard" element={<AdminDashboard />} />
			</Routes>
		</BrowserRouter>
		</>
	)
}

export default App