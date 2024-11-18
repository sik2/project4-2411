import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'

function List() {
    const [searchTerm, setSearchTerm] = useState('')
    const [items, setItems] = useState([])

    const getItems = async () => {
        const querySnapshot = await getDocs(collection(db, 'items'))
        const itemsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        setItems(itemsList)
    }

    useEffect(() => {
        getItems()
    }, [])

    // 더미 데이터
    const posts = Array(8)
        .fill()
        .map((_, index) => ({
            id: index + 1,
            title: 'Title Text',
            author: 'admin01',
            date: '2000.11.05',
        }))

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* 게시글 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((post) => (
                    <div key={post.id}>
                        <Link to={`/post/${post.id}`}>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                                        <span className="text-sm text-gray-600">{post.author}</span>
                                    </div>
                                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{post.title}</h3>
                                    <span className="text-sm text-gray-500">{post.date}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center space-x-1 mt-8">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100">
                    <span className="sr-only">Previous</span>
                    &lt;
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
                    <button
                        key={page}
                        className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100"
                    >
                        {page}
                    </button>
                ))}
                <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100">
                    <span className="sr-only">Next</span>
                    &gt;
                </button>
            </div>
        </div>
    )
}

export default List
