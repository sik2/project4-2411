import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} /> {/* 404 페이지 추가 */}
            </Routes>
        </Layout>
    )
}

export default App
