import Nav from './Nav'
import Footer from './Footer'

function Layout({ children }) {
    return (
        <div className="bg-gray-50">
            <Nav />
            <main className="max-w-md mx-auto mt-16 p-6 h-auto min-h-full">{children}</main>
            <Footer />
        </div>
    )
}

export default Layout
