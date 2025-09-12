import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
	<header className="fixed top-0 left-0 w-full z-999  px-6 py-4">
		<nav className="max-w-7xl mx-auto flex items-center justify-between">
			<div className="flex items-center space-x-2">
				<div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
					<div className="w-4 h-4 bg-white rounded-full"></div>
				</div>
				<Link to="/" className="text-white font-bold text-xl">BusTracker</Link>
			</div>
			<div className="hidden md:flex items-center space-x-8 text-white/80">
				<Link to="/login" className="hover:text-white transition-colors">Login</Link>
			</div>
			
		</nav>
	</header>
);

export default Header;
