import { db, auth } from '../firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading'

function Home() {
    const [items, setItems] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [loading, setLoading] = useState(true)

    const getItems = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'items'))
            const itemsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setItems(itemsList)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getItems()
    }, [])

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ReactLoading type="spin" color="#000" />
            </div>
        )

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-4 py-2 rounded-lg ${
                            selectedCategory === 'All'
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setSelectedCategory('Popular')}
                        className={`px-4 py-2 rounded-lg ${
                            selectedCategory === 'Popular'
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        Popular
                    </button>
                </div>
                {auth.currentUser && (
                    <Link to="/post/write">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                            글쓰기
                        </button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden h-[280px] flex flex-col"
                    >
                        <Link to={`/post/${item.id}`}>
                            <div className="relative pb-[56.25%] bg-gray-200">
                                <div className="absolute inset-0"></div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                                        username01
                                    </span>
                                </div>
                                <h3 className="font-semibold mb-2 text-sm line-clamp-2 flex-1">{item.title}</h3>
                                <div className="text-sm text-gray-500">{item.date}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
