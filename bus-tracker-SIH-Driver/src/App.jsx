import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Header from './components/Header'

const App = () => {
	return (
		<>
		<BrowserRouter>
			<Header />
			
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />

			</Routes>
		</BrowserRouter>
		</>
	)
}

export default App