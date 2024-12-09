import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../../firebase/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'

function Edit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState([])

    useEffect(() => {
        const getPost = async () => {
            try {
                const docRef = doc(db, 'items', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setTitle(data.title || '')
                    setContent(data.content || '')
                    const existingTags = data.tags || []
                    setTags(existingTags.map((tag) => tag.replace('#', '')))
                } else {
                    toast.error('게시글을 찾을 수 없습니다.')
                    navigate('/post/list')
                }
            } catch (error) {
                console.error('Error fetching post:', error)
                toast.error('게시글 불러오기에 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        getPost()
    }, [id, navigate])

    const handleAddTag = () => {
        const newTag = tagInput.trim()
        if (newTag) {
            if (tags.includes(newTag)) {
                toast.warning('이미 존재하는 태그입니다.', {
                    position: 'top-right',
                    autoClose: 2000,
                })
                setTagInput('')
                return
            }
            setTags([...tags, newTag])
            setTagInput('')
        }
    }

    const handleTagInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTag()
        }
    }

    const handleTagInputChange = (e) => {
        const value = e.target.value
        if (value.endsWith(' ')) {
            const newTag = value.trim()
            if (newTag) {
                if (tags.includes(newTag)) {
                    toast.warning('이미 존재하는 태그입니다.', {
                        position: 'top-right',
                        autoClose: 2000,
                    })
                } else {
                    setTags([...tags, newTag])
                }
            }
            setTagInput('')
        } else {
            setTagInput(value)
        }
    }

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const docRef = doc(db, 'items', id)
            await updateDoc(docRef, {
                title,
                content,
                tags,
                updatedAt: new Date().toISOString(),
            })

            toast.success('게시글이 수정되었습니다.')
            navigate(`/post/${id}`)
        } catch (error) {
            console.error('Error updating post:', error)
            toast.error('게시글 수정에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">게시글 수정</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        제목
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        태그
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyPress={handleTagInputKeyPress}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="태그를 입력하고 스페이스바 또는 엔터를 누르세요"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                            추가
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                            >
                                #{tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="ml-2 text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        내용
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/post/${id}`)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        취소
                    </button>
                    <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Edit
