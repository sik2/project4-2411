import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { signOut } from 'firebase/auth'

function Nav() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await signOut(auth)
            navigate('/login')
        } catch (error) {
            console.error('로그아웃 실패:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <nav className="bg-white shadow-sm w-full">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-900 relative">
                            <div className="absolute bottom-0 right-0 w-8 h-4 bg-yellow-400"></div>
                        </div>
                        <span className="text-blue-900 font-bold text-xl">TECH BLOCKS</span>
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/post/list">
                        <button className="bg-gray-800 text-white px-4 py-2 rounded">List</button>
                    </Link>
                    {/* 로그인 상태 판별 */}
                    {auth.currentUser ? (
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </button>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="bg-gray-800 text-white px-4 py-2 rounded">Login</button>
                            </Link>
                            <Link to="/register">
                                <button className="bg-gray-800 text-white px-4 py-2 rounded">Register</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Nav
