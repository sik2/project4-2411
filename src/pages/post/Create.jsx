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

    const handleAddTag = () => {
        const newTag = tagInput.trim()
        if (newTag) {
            // 중복 태그 체크
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
            // 스페이스바가 입력되면 태그 추가
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
            const docRef = await addDoc(collection(db, 'items'), {
                title: title,
                content: content,
                tags: tags,
                createdAt: new Date().toISOString(),
            })
            console.log('item written with ID: ', docRef.id)
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
                        placeholder="제목을 입력하세요"
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
                            onChange={(e) => setTagInput(e.target.value)}
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
                    {/* 태그 목록 */}
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
                        placeholder="내용을 입력하세요"
                        required
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        onClick={() => window.history.back()}
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
