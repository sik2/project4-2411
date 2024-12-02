import { addDoc, collection } from 'firebase/firestore'
import { useState } from 'react'
import { db } from '../../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Create() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const docRef = await addDoc(collection(db, 'items'), {
                title: title,
                content: content,
                tags: tags.split(',').map((tag) => tag.trim()),
            })
            console.log('item written with ID: ', docRef.id)
            toast.success('게시글이 성공적으로 작성되었습니다.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            })
            navigate('/post/list')
        } catch (err) {
            console.error(err)
            toast.error('게시글 작성에 실패했습니다.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            })
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
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="태그를 입력하세요 (쉼표로 구분)"
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
