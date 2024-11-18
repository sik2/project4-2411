import Nav from './Nav'
import Footer from './Footer'

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Nav />
            <div>{children}</div>
            <Footer />
        </div>
    )
}

export default Layout
