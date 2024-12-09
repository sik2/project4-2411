import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from './firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import List from './pages/post/List'
import Detail from './pages/post/Detail'
import Create from './pages/post/Create'
import Edit from './pages/post/Edit'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
    const [init, setInit] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // Firebase 인증 상태 변경 감지
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // 사용자가 로그인한 경우
                setIsAuthenticated(true)
                // 로컬 스토리지에 인증 상태 저장
                localStorage.setItem('isAuthenticated', 'true')
            } else {
                // 사용자가 로그아웃한 경우
                setIsAuthenticated(false)
                // 로컬 스토리지에서 인증 상태 제거
                localStorage.removeItem('isAuthenticated')
            }
            setInit(true)
        })

        // 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe()
    }, [])

    // 초기 로딩 상태
    if (!init) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/post/list" element={<List />} />
                <Route path="/post/:id" element={<Detail />} />
                <Route path="/post/write" element={<Create />} />
                <Route path="/post/edit/:id" element={<Edit />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        </Layout>
    )
}

export default App
