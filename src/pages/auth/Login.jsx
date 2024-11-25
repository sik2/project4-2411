import { useState } from 'react'
import { auth } from '../../firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password)
            navigate('/')
        } catch (error) {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.')
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="w-full max-w-md p-6">
                <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your id"
                        />
                        {error && <p className="text-red-500 text-xs mt-1">*not provided id</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                        {error && <p className="text-red-500 text-xs mt-1">*not provided password</p>}
                    </div>
                    <div className="text-center text-sm text-gray-500">
                        <span>아이디가 없으신가요? | 비밀번호를 잊으셨나요?</span>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
