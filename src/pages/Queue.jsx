import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { posts } from "../api"

const POST_TYPE_ICONS = { text: "📝", carousel: "🎠", image: "🖼️" }

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return "just now"
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function truncate(str, n = 120) {
  if (!str) return ""
  return str.length > n ? str.slice(0, n) + "…" : str
}

export default function Queue() {
  const navigate        = useNavigate()
  const [drafts,   setDrafts]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [error,    setError]    = useState("")

  useEffect(() => {
    posts.list("draft")
      .then(setDrafts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    setDeleting(id)
    try {
      await posts.delete(id)
      setDrafts(d => d.filter(p => p.id !== id))
    } catch (e) {
      setError(e.message)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0077B5] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue</h1>
          <p className="text-gray-500 text-sm mt-1">
            {drafts.length} draft{drafts.length !== 1 ? "s" : ""} waiting to post
          </p>
        </div>
        <button
          onClick={() => navigate("/new")}
          className="px-4 py-2 bg-[#0077B5] hover:bg-[#005f91] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          + New Post
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {drafts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <p className="text-4xl mb-4">📭</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No drafts yet</h3>
          <p className="text-gray-400 text-sm mb-6">Generate a post and it will appear here before publishing.</p>
          <button
            onClick={() => navigate("/new")}
            className="px-5 py-2.5 bg-[#0077B5] hover:bg-[#005f91] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map(post => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                  {POST_TYPE_ICONS[post.post_type] || "📝"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {post.post_type} post
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400 capitalize">{post.tone}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                  </div>
                  {post.title && (
                    <p className="text-sm font-medium text-gray-700 mb-1">{post.title}</p>
                  )}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {truncate(post.content)}
                  </p>
                  {post.post_type === "carousel" && post.slides?.length > 0 && (
                    <p className="text-xs text-[#0077B5] mt-1">
                      {post.slides.length} slides
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/preview/${post.id}`)}
                    className="px-3 py-1.5 text-sm font-medium text-[#0077B5] border border-[#0077B5] rounded-lg hover:bg-[#e8f3f9] transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="px-3 py-1.5 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    {deleting === post.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}