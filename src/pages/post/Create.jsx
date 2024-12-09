import { addDoc, collection } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { db, auth } from '../../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Create() {
    const navigate = useNavigate()
    const [tagInput, setTagInput] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
    })

    // 로그인 체크
    useEffect(() => {
        if (!auth.currentUser) {
            toast.error('로그인이 필요한 서비스입니다.')
            navigate('/login')
        }
    }, [navigate])

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

        if (!auth.currentUser) {
            toast.error('로그인이 필요한 서비스입니다.')
            navigate('/login')
            return
        }

        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('제목과 내용을 입력해주세요.')
            return
        }

        try {
            const docRef = await addDoc(collection(db, 'items'), {
                title: formData.title.trim(),
                content: formData.content.trim(),
                tags: formData.tags,
                createdAt: new Date().toISOString(),
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
            })
            toast.success('게시글이 성공적으로 작성되었습니다.')
            navigate('/post/list')
        } catch (err) {
            console.error(err)
            toast.error('게시글 작성에 실패했습니다.')
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">새 게시글 작성</h1>

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
                        onClick={() => navigate('/post/list')}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        취소
                    </button>
                    <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        등록
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Create
