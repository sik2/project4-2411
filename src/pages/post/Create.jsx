import { addDoc, collection } from 'firebase/firestore'
import { useState } from 'react'
import { db } from '../../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Create() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState([])
    const navigate = useNavigate()

    // 태그 입력 함수 수정
    const handleTagInput = (e) => {
        const value = e.target.value

        // 스페이스바 입력 시 태그 추가
        if (value.includes(' ')) {
            const newTags = value
                .split(' ')
                .map((tag) => tag.trim())
                .filter((tag) => tag !== '')

            // 중복 제거 및 기존 태그와 합치기
            const uniqueTags = [...new Set([...tags, ...newTags])]
            setTags(uniqueTags)
            setTagInput('')
        } else {
            setTagInput(value)
        }
    }

    // Enter 키 입력 시 태그 추가
    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (tagInput.trim()) {
                if (!tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()])
                }
                setTagInput('')
            }
        }
    }

    // 태그 삭제 함수
    const handleRemoveTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            toast.error('제목과 내용을 입력해주세요.')
            return
        }

        try {
            const docRef = await addDoc(collection(db, 'items'), {
                title: title.trim(),
                content: content.trim(),
                tags: tags,
                createdAt: new Date().toISOString(),
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag, index) => (
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
                    <input
                        type="text"
                        value={tagInput}
                        onChange={handleTagInput}
                        onKeyDown={handleTagInputKeyDown}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="태그 입력 (스페이스바 또는 엔터로 구분)"
                    />
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
