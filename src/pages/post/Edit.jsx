import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db, auth } from '../../firebase/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'

function Edit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [initialLoading, setInitialLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [tagInput, setTagInput] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
    })

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'items', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const postData = docSnap.data()

                    if (postData.userId !== auth.currentUser?.uid) {
                        toast.error('수정 권한이 없습니다.')
                        navigate('/post/list')
                        return
                    }

                    setFormData({
                        title: postData.title,
                        content: postData.content,
                        tags: postData.tags || [],
                    })
                } else {
                    toast.error('게시글을 찾을 수 없습니다.')
                    navigate('/post/list')
                }
            } catch (error) {
                console.error('Error fetching post:', error)
                toast.error('게시글을 불러오는데 실패했습니다.')
                navigate('/post/list')
            } finally {
                setInitialLoading(false)
            }
        }

        if (!auth.currentUser) {
            toast.error('로그인이 필요한 서비스입니다.')
            navigate('/login')
            return
        }

        fetchPost()
    }, [id, navigate])

    // 태그 추가 함수
    const handleAddTag = (e) => {
        e.preventDefault()
        if (!tagInput.trim()) return

        if (formData.tags.includes(tagInput.trim())) {
            toast.error('이미 존재하는 태그입니다.')
            return
        }

        setFormData({
            ...formData,
            tags: [...formData.tags, tagInput.trim()],
        })
        setTagInput('')
    }

    // 태그 삭제 함수
    const handleRemoveTag = (indexToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((_, index) => index !== indexToRemove),
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('제목과 내용을 입력해주세요.')
            return
        }

        try {
            setSubmitLoading(true)
            const docRef = doc(db, 'items', id)
            await updateDoc(docRef, {
                title: formData.title.trim(),
                content: formData.content.trim(),
                tags: formData.tags,
                updatedAt: new Date().toISOString(),
            })

            toast.success('게시글이 수정되었습니다.')
            navigate(`/post/${id}`)
        } catch (error) {
            console.error('Error updating post:', error)
            toast.error('게시글 수정에 실패했습니다.')
            setSubmitLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ReactLoading type="spin" color="#000" />
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
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                                #{tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="태그를 입력하세요"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            태그 추가
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        내용
                    </label>
                    <textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                        disabled={submitLoading}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                        disabled={submitLoading}
                    >
                        {submitLoading ? (
                            <ReactLoading type="spin" height={20} width={20} color="#ffffff" />
                        ) : (
                            '수정하기'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Edit
