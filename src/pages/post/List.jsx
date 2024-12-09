import { useState, useEffect } from 'react'
import { db, auth } from '../../firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import ReactLoading from 'react-loading'

function List() {
    const [searchTerm, setSearchTerm] = useState('')
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

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
                <div className="relative">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                        </svg>
                    </span>
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

export default List
