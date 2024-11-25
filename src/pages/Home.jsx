import { db } from '../firebase/firebase'
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
                <div className="text-center">
                    <ReactLoading type="spin" color="#4F46E5" height={50} width={50} className="mx-auto mb-4" />
                    <p className="text-gray-600">로딩중...</p>
                </div>
            </div>
        )

    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-120px)]">
            {/* 카테고리 필터 */}
            <div className="flex space-x-4 mb-6">
                <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100">All</button>
                <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100">New</button>
                <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100">Hot</button>
            </div>

            {/* 검색바 */}
            <div className="mb-8">
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-6 py-2 bg-gray-800 text-white rounded-r hover:bg-gray-700">Search</button>
                </div>
            </div>

            {/* 4 * 3 그리드 레이아웃 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden h-[280px] flex flex-col"
                    >
                        <Link to={`/post/${item.id}`}>
                            {/* 이미지 영역 - 16:9 비율 유지 */}
                            <div className="relative pb-[56.25%] bg-gray-200">
                                <div className="absolute inset-0"></div>
                            </div>
                            {/* 컨텐츠 영역 */}

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
