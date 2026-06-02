import { useEffect, useState } from "react"

const { posts } = await import("../api")

const POST_TYPE_ICONS = { text: "📝", carousel: "🎠", image: "🖼️" }

function formatDate(dateStr) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function truncate(str, n = 140) {
  if (!str) return ""
  return str.length > n ? str.slice(0, n) + "…" : str
}

function StatusBadge({ status }) {
  const styles = {
    published: "bg-green-50 text-green-700 border border-green-200",
    failed:    "bg-red-50 text-red-600 border border-red-200",
    draft:     "bg-blue-50 text-blue-600 border border-blue-200",
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${styles[status] || styles.draft}`}>
      {status}
    </span>
  )
}

export default function History() {
  const [allPosts, setAllPosts] = useState([])
  const [filter,   setFilter]   = useState("all")
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState("")

  useEffect(() => {
    Promise.all([
      posts.list("published"),
      posts.list("failed"),
    ])
      .then(([published, failed]) => setAllPosts([...published, ...failed].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === "all"
    ? allPosts
    : allPosts.filter(p => p.status === filter)

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
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-gray-500 text-sm mt-1">
            {allPosts.filter(p => p.status === "published").length} posts published
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {["all", "published", "failed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-400 text-sm">
            {filter === "all"
              ? "Published posts will appear here."
              : `No ${filter} posts found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(post => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                  {POST_TYPE_ICONS[post.post_type] || "📝"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {post.post_type} post
                    </span>
                    <StatusBadge status={post.status} />
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatDate(post.posted_at || post.created_at)}
                    </span>
                  </div>

                  {post.title && (
                    <p className="text-sm font-medium text-gray-700 mb-1">{post.title}</p>
                  )}

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {truncate(post.content)}
                  </p>

                  {/* Tags row */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {post.tone && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                        {post.tone}
                      </span>
                    )}
                    {post.hook_style && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                        {post.hook_style.replace("_", " ")}
                      </span>
                    )}
                    {post.input_type && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                        {post.input_type}
                      </span>
                    )}
                    {post.post_type === "carousel" && post.slides?.length > 0 && (
                      <span className="text-xs text-[#0077B5] bg-[#e8f3f9] px-2 py-0.5 rounded-full">
                        {post.slides.length} slides
                      </span>
                    )}
                  </div>

                  {/* LinkedIn link */}
                  {post.linkedin_post_id && (
                    <a
                      href={`https://www.linkedin.com/feed/update/${post.linkedin_post_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-[#0077B5] hover:underline"
                    >
                      View on LinkedIn →
                    </a>
                  )}

                  {/* Failed reason */}
                  {post.status === "failed" && post.content?.startsWith("Error") && (
                    <p className="mt-2 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">
                      {post.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}