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
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
    })

    useEffect(() => {
        const getPost = async () => {
            try {
                const docRef = doc(db, 'items', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setFormData({
                        title: data.title || '',
                        content: data.content || '',
                        tags: data.tags || [],
                    })
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const docRef = doc(db, 'items', id)
            await updateDoc(docRef, {
                title: formData.title,
                content: formData.content,
                tags: formData.tags,
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

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'tags') {
            setFormData({
                ...formData,
                [name]: value.split(',').map((tag) => tag.trim()),
            })
        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
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
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        태그
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags.join(', ')}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="태그를 쉼표로 구분하여 입력하세요"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        내용
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
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
