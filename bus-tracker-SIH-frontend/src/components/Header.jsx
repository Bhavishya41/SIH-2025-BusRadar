import React from 'react';

const Header = () => (
	<header className="fixed top-0 left-0 w-full z-999  px-6 py-4">
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
				{/* <a href="#" className="hover:text-white transition-colors">Login</a> */}
			</div>
			{/* <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 flex items-center space-x-2">
				<span>Start Tracking</span>
				<ArrowRight className="w-4 h-4" />
			</button> */}
		</nav>
	</header>
);

export default Header;
