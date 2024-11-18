import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import List from './pages/post/List'
import Detail from './pages/post/Detail'
function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/posts" element={<List />} />
                <Route path="/post/:id" element={<Detail />} />
                <Route path="*" element={<NotFound />} /> {/* 404 페이지 추가 */}
            </Routes>
        </Layout>
    )
}

export default App
