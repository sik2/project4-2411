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
        try {
            const commentsQuery = query(collection(db, 'comments'), where('postId', '==', id))
            const commentsSnapshot = await getDocs(commentsQuery)
            const commentsList = commentsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                // 유효성 검사 추가
                userId: doc.data().userId || null,
                author: doc.data().author || '알 수 없음',
            }))
            setComments(commentsList)
        } catch (error) {
            console.error('댓글 로딩 실패:', error)
            toast.error('댓글을 불러오는데 실패했습니다.')
        }
    }

    // 댓글 등록 함수
    const handleCommentSubmit = async (e) => {
        e.preventDefault()

        // 로그인 체크
        if (!auth.currentUser) {
            toast.error('댓글을 작성하려면 로그인이 필요합니다.')
            navigate('/login')
            return
        }

        if (!newComment.trim()) {
            toast.error('댓글 내용을 입력해주세요.')
            return
        }

        try {
            // author 필드 제거하고 userId만 저장
            const commentData = {
                postId: id,
                content: newComment,
                createdAt: serverTimestamp(),
                userId: auth.currentUser.uid,
            }

            await addDoc(collection(db, 'comments'), commentData)
            setNewComment('')
            toast.success('댓글이 등록되었습니다.')
            await refreshComments()
        } catch (error) {
            console.error('댓글 등록 실패:', error)
            toast.error('댓글 등록에 실패했습니다.')
        }
    }

    // 댓글 삭제 함수
    const handleCommentDelete = async (commentId, commentUserId) => {
        if (!auth.currentUser) {
            toast.error('로그인이 필요합니다.')
            return
        }

        if (auth.currentUser.uid !== commentUserId) {
            toast.error('자신의 댓글만 삭제할 수 있습니다.')
            return
        }

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
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'items', id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() })
                } else {
                    toast.error('게시글을 찾을 수 없습니다.')
                    navigate('/post/list')
                }
            } catch (error) {
                console.error('Error fetching post:', error)
                toast.error('게시글을 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [id, navigate])

    const handleDelete = async () => {
        if (!window.confirm('정말로 삭제하시겠습니까?')) return

        try {
            await deleteDoc(doc(db, 'items', id))
            toast.success('게시글이 삭제되었습니다.')
            navigate('/post/list')
        } catch (error) {
            console.error('Error deleting post:', error)
            toast.error('게시글 삭제에 실패했습니다.')
        }
    }

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ReactLoading type="spin" color="#000" />
            </div>
        )

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg p-6 mb-8">
                <div className="border-b pb-4 mb-4">
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                </div>

                <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-8">
                <div className="prose max-w-none min-h-[200px] whitespace-pre-wrap">{post.content}</div>
            </div>

            <div className="flex justify-end gap-4 mb-8">
                <Link to="/post/list" className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600">
                    목록
                </Link>
                {auth.currentUser?.uid === post.userId && (
                    <>
                        <Link
                            to={`/post/edit/${id}`}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            수정
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            삭제
                        </button>
                    </>
                )}
            </div>

            <div className="bg-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">댓글 ({comments.length})</h2>
                </div>

                {/* 댓글 입력 폼 - 로그인 상태에 따라 다르게 표시 */}
                {auth.currentUser ? (
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
                ) : (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-gray-600">댓글을 작성하려면 로그인이 필요합니다.</p>
                        <Link
                            to="/login"
                            className="text-indigo-600 hover:text-indigo-800 font-medium inline-block mt-2"
                        >
                            로그인하러 가기
                        </Link>
                    </div>
                )}

                {/* 댓글 목록 */}
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-b pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-700">{comment.content}</p>
                                {auth.currentUser?.uid === comment.userId && (
                                    <button
                                        onClick={() => handleCommentDelete(comment.id, comment.userId)}
                                        className="text-red-500 hover:text-red-700 text-sm ml-4"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Detail
