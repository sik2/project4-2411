import { useState, useEffect } from 'react'
import { db } from '../../firebase/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import ReactLoading from 'react-loading'

function List() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [allTags, setAllTags] = useState([])
    const [selectedTag, setSelectedTag] = useState(null)
    const navigate = useNavigate()

    const getItems = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'items'))
            const itemsList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setItems(itemsList)

            const tags = itemsList.reduce((acc, item) => {
                if (item.tags && Array.isArray(item.tags)) {
                    return [...acc, ...item.tags]
                }
                return acc
            }, [])
            const uniqueTags = [...new Set(tags)]
            setAllTags(uniqueTags)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getItems()
    }, [])

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResults(null)
            return
        }

        const searchTermLower = searchTerm.toLowerCase()
        const results = items.filter((item) => {
            const titleMatch = item.title?.toLowerCase().includes(searchTermLower)
            const contentMatch = item.content?.toLowerCase().includes(searchTermLower)
            const tagMatch = item.tags?.some((tag) => tag.toLowerCase().includes(searchTermLower))
            const commentMatch = item.comments?.some((comment) =>
                comment.content?.toLowerCase().includes(searchTermLower),
            )

            return titleMatch || contentMatch || tagMatch || commentMatch
        })

        setSearchResults(results)
    }

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const filteredItems =
        searchResults !== null
            ? searchResults.filter((item) => !selectedTag || (item.tags && item.tags.includes(selectedTag)))
            : selectedTag
            ? items.filter((item) => item.tags && item.tags.includes(selectedTag))
            : items

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <ReactLoading type="spin" color="#4F46E5" height={50} width={50} className="mx-auto mb-4" />
                    <p className="text-gray-600">로딩중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-120px)]">
            {/* 상단 제목과 글쓰기 버튼 */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">게시글 목록</h1>
                <button
                    onClick={() => navigate('/post/write')}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                    New
                </button>
            </div>

            {/* 태그 필터 */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-2 rounded-full border ${
                        selectedTag === null
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    All
                </button>
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-4 py-2 rounded-full border ${
                            selectedTag === tag
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {/* 검색바 */}
            <div className="mb-8">
                <div className="flex">
                    <input
                        type="text"
                        placeholder="제목, 내용, 태그, 댓글로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-gray-800 text-white rounded-r hover:bg-gray-700"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* 검색 결과 메시지 수정 */}
            {searchResults !== null && searchResults.length === 0 && (
                <div className="text-center text-gray-500 my-8">검색 결과가 없습니다.</div>
            )}

            {/* 그리드 레이아웃 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
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
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {item.tags?.map((tag, index) => (
                                        <span key={index} className="text-xs text-indigo-600">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
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
