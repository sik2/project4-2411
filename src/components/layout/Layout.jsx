import Nav from './Nav'
import Footer from './Footer'

function Layout({ children }) {
    return (
        <>
            <Nav />
            <div>{children}</div>
            <Footer />
        </>
    )
}

export default Layout
