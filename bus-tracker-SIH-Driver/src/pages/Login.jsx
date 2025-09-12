import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
	const navigate = useNavigate()
	// Using busId input as driverId (rename label later if needed)
	const [form, setForm] = useState({ driverId: '', password: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleChange = (e) => {
		setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			if(form.driverId === "harshad mehta" && form.password === "harsh123"){
				navigate('/adminDashboard')
			}
			// Decide backend base URL (env or fallback)
			const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
			const response = await fetch(`${baseUrl}/api/tracking/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ driverId: form.driverId.trim(), password: form.password })
			})
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.error || 'Login failed')
			}
			// Persist token & user
			localStorage.setItem('authToken', data.token)
			localStorage.setItem('authUser', JSON.stringify(data.user))
			localStorage.setItem('authRole', data.role)
			navigate('/startJourney')
		} catch (err) {
			setError(err.message || 'Failed to login. Please try again.')
			console.log(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-600 p-4">
			<div className="w-full max-w-md bg-white rounded-xl shadow p-6">
				<h1 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h1>
				<p className="text-gray-500 mb-6">Login to your account</p>

				{error && (
					<div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="driverId" className="block text-sm font-medium text-gray-700 mb-1">Driver Id</label>
						<input
							id="driverId"
							name="driverId"
							type="string"
							required
							value={form.driverId}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="D-1005"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							value={form.password}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-blue-600 text-white py-2.5 hover:bg-blue-700 disabled:opacity-60"
					>
						{loading ? 'Signing in…' : 'Sign in'}
					</button>
				</form>
			</div>
		</div>
	)
}

export default Login 