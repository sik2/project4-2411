function Nav() {
    return (
        <nav className="bg-white p-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-900 relative">
                        <div className="absolute bottom-0 right-0 w-8 h-4 bg-yellow-400"></div>
                    </div>
                    <span className="text-blue-900 font-bold text-xl">TECH BLOCKS</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m0 0v2m0-2h2m-2 0H10m8-6a4 4 0 01-4 4H6a4 4 0 01-4-4V7a4 4 0 014-4h8a4 4 0 014 4v4z"
                            />
                        </svg>
                    </button>
                    <button className="p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded">Login</button>
                </div>
            </div>
        </nav>
    )
}

export default Nav
