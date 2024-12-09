import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db, auth } from '../../firebase/firebase'
import { doc, getDoc, collection, getDocs, deleteDoc, query, where, addDoc, serverTimestamp } from 'firebase/firestore'
import ReactLoading from 'react-loading'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Detail() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    // 댓글 목록 새로고침 함수
    const refreshComments = async () => {
        const commentsQuery = query(collection(db, 'comments'), where('postId', '==', id))
        const commentsSnapshot = await getDocs(commentsQuery)
        const commentsList = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        setComments(commentsList)
    }

    // 댓글 등록 함수
    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if (!auth.currentUser) {
            toast.error('댓글을 작성하려면 로그인이 필요합니다.')
            return
        }
        if (!newComment.trim()) {
            toast.error('댓글 내용을 입력해주세요.')
            return
        }

        try {
            await addDoc(collection(db, 'comments'), {
                postId: id,
                content: newComment,
                author: auth.currentUser.email,
                createdAt: serverTimestamp(),
            })
            setNewComment('')
            toast.success('댓글이 등록되었습니다.')
            await refreshComments()
        } catch (error) {
            console.error('댓글 등록 실패:', error)
            toast.error('댓글 등록에 실패했습니다.')
        }
    }

    // 댓글 삭제 함수
    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) {
            return
        }

        try {
            await deleteDoc(doc(db, 'comments', commentId))
            toast.success('댓글이 삭제되었습니다.')
            await refreshComments()
        } catch (error) {
            console.error('댓글 삭제 실패:', error)
            toast.error('댓글 삭제에 실패했습니다.')
        }
    }

    useEffect(() => {
        const getPost = async () => {
            try {
                // 게시글 정보 가져오기
                const postDoc = await getDoc(doc(db, 'items', id))
                if (!postDoc.exists()) {
                    setError('게시글을 찾을 수 없습니다.')
                    return
                }
                setPost({ id: postDoc.id, ...postDoc.data() })

                // 댓글 정보 가져오기
                const commentsQuery = query(collection(db, 'comments'), where('postId', '==', id))
                const commentsSnapshot = await getDocs(commentsQuery)
                const commentsList = commentsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setComments(commentsList)
            } catch (err) {
                setError('데이터를 불러오는데 실패했습니다.')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        getPost()
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm('게시글을 삭제하시겠습니까?')) {
            return
        }

        try {
            setLoading(true)
            await deleteDoc(doc(db, 'items', id))
            toast.success('게시글이 삭제되었습니다.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            })
            navigate('/')
        } catch (error) {
            console.error('삭제 중 오류 발생:', error)
            toast.error('게시글 삭제에 실패했습니다.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            })
        } finally {
            setLoading(false)
        }
    }
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">{post.title}</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                        >
                            {/* TODO 해시태그 */}
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-8 h-[400px] overflow-y-auto">
                <div className="prose max-w-none">{post.content}</div>
            </div>

            <div className="flex justify-end gap-4 mb-8">
                <Link to="/post/list" className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600">
                    목록
                </Link>
                <Link to={`/post/edit/${id}`} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                    수정
                </Link>
                <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    삭제
                </button>
            </div>

            <div className="bg-white rounded-lg p-6 h-[300px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">댓글 ({comments.length})</h2>
                </div>

                {/* 댓글 입력 폼 */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            등록
                        </button>
                    </div>
                </form>

                {/* 댓글 목록 */}
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-b pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{comment.author}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {comment.createdAt?.toDate().toLocaleDateString()}
                                    </span>
                                    {auth.currentUser?.email === comment.author && (
                                        <button
                                            onClick={() => handleCommentDelete(comment.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Detail
