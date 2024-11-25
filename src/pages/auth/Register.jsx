import { useState } from 'react'
import { auth } from '../../firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordCheck: '',
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.passwordCheck) {
            setError('비밀번호가 일치하지 않습니다.')
            return
        }
        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            navigate('/login')
        } catch (error) {
            setError('회원가입에 실패했습니다.')
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
                <h1 className="text-2xl font-bold text-center mb-8">Membership</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                        />
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
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password Check</label>
                        <input
                            type="password"
                            name="passwordCheck"
                            value={formData.passwordCheck}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password again"
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors mt-8"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register
