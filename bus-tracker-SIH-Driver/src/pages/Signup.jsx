import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
	const navigate = useNavigate()
	const [form, setForm] = useState({ name: '', busId: '', password: '', confirmPassword: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleChange = (e) => {
		setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		if (form.password !== form.confirmPassword) {
			setError('Passwords do not match')
			return
		}
		setLoading(true)
		try {
			// TODO: Replace with real signup API call
			await new Promise(r => setTimeout(r, 900))
			navigate('/login')
		} catch (err) {
			setError('Failed to create account. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-600 p-4">
			<div className="w-full max-w-md bg-white rounded-xl shadow p-6">
				<h1 className="text-2xl font-semibold text-gray-900 mb-1">Create your account</h1>
				<p className="text-gray-500 mb-6">Sign up to get started</p>

				{error && (
					<div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							value={form.name}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="John Doe"
						/>
					</div>
					<div>
						<label htmlFor="busID" className="block text-sm font-medium text-gray-700 mb-1">Bus Id</label>
						<input
							id="busId"
							name="busId"
							type="string"
							required
							value={form.busId}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Bus-101"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							minLength={6}
							value={form.password}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="At least 6 characters"
						/>
					</div>
					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							value={form.confirmPassword}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Repeat your password"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-blue-600 text-white py-2.5 hover:bg-blue-700 disabled:opacity-60"
					>
						{loading ? 'Creating account…' : 'Create account'}
					</button>
				</form>

				<p className="text-sm text-gray-600 mt-6 text-center">
					Already have an account?{' '}
					<Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
				</p>
			</div>
		</div>
	)
}

export default Signup 