import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { content, posts } from "../api"

// ── LinkedIn post mock ──────────────────────────────────────────────────────

function LinkedInMock({ post, user }) {
  const [slide, setSlide] = useState(0)

  const name    = user?.name    || "Harsimranjit Singh"
  const picture = user?.picture || null
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-[540px]">
      {/* Post header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          {picture ? (
            <img src={picture} alt={name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#0077B5] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initials}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">Junior Software Developer at Legion Automations</p>
            <p className="text-xs text-gray-400 mt-0.5">Just now · 🌐</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600 text-xl leading-none">···</button>
        </div>

        {/* Post body */}
        <div className="mt-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Carousel preview */}
      {post.post_type === "carousel" && post.slides?.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="bg-gray-900 relative" style={{ aspectRatio: "1/1" }}>
            {/* Slide */}
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              {post.slides[slide]?.type === "cover" && (
                <>
                  <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#0077B5]" />
                  <p className="text-[#0077B5] text-sm font-bold mb-4 ml-4">
                    {slide + 1} / {post.slides.length}
                  </p>
                  <h2 className="text-white text-3xl font-bold leading-tight ml-4">
                    {post.slides[slide].headline}
                  </h2>
                  <div className="w-24 h-0.5 bg-[#0077B5] my-4 ml-4" />
                  <p className="text-gray-400 text-base ml-4">{post.slides[slide].subtitle}</p>
                  <p className="text-[#0077B5] text-sm font-bold mt-auto ml-4">{name}</p>
                </>
              )}
              {post.slides[slide]?.type === "content" && (
                <>
                  <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#0077B5]" />
                  <p className="text-[#0077B5] text-xs font-bold mb-3 ml-4">
                    {String(slide).padStart(2, "0")} / {post.slides.length}
                  </p>
                  <h3 className="text-white text-2xl font-bold leading-tight mb-4 ml-4">
                    {post.slides[slide].headline}
                  </h3>
                  <div className="w-full h-px bg-gray-700 mb-4 ml-4" style={{ width: "calc(100% - 2rem)" }} />
                  {post.slides[slide].bullets?.length > 0 ? (
                    <ul className="space-y-2 ml-4">
                      {post.slides[slide].bullets.map((b, i) => (
                        <li key={i} className="text-gray-300 text-sm flex gap-2">
                          <span className="text-[#0077B5] flex-shrink-0">•</span>{b}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300 text-sm ml-4">{post.slides[slide].body}</p>
                  )}
                  <p className="text-[#0077B5] text-xs font-bold mt-auto ml-4">{name}</p>
                </>
              )}
              {post.slides[slide]?.type === "cta" && (
                <>
                  <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#0077B5]" />
                  <p className="text-[#0077B5] text-sm font-bold uppercase tracking-wider mb-4 ml-4">Takeaway</p>
                  <h3 className="text-white text-2xl font-bold leading-tight mb-6 ml-4">
                    {post.slides[slide].cta_text}
                  </h3>
                  <p className="text-gray-400 text-sm ml-4">Follow for more developer content →</p>
                  <p className="text-[#0077B5] text-sm font-bold mt-auto ml-4">{name}</p>
                </>
              )}
            </div>
          </div>
          {/* Slide nav */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => setSlide(s => Math.max(0, s - 1))}
              disabled={slide === 0}
              className="text-sm text-gray-500 disabled:opacity-30 hover:text-gray-800 font-medium"
            >
              ← Prev
            </button>
            <div className="flex gap-1.5">
              {post.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === slide ? "bg-[#0077B5]" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setSlide(s => Math.min(post.slides.length - 1, s + 1))}
              disabled={slide === post.slides.length - 1}
              className="text-sm text-gray-500 disabled:opacity-30 hover:text-gray-800 font-medium"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Image preview */}
      {post.post_type === "image" && post.image_url && (
        <div className="border-t border-gray-100">
          <img src={`http://localhost:8000/images/${post.image_url.split("/").pop()}`} alt="Generated" className="w-full" />
        </div>
      )}

      {/* Reactions bar */}
      <div className="px-4 py-1 border-t border-gray-100">
        <div className="flex items-center justify-between py-1">
          {["👍 Like", "💬 Comment", "🔁 Repost", "📤 Send"].map(action => (
            <button key={action} className="flex items-center gap-1.5 text-gray-500 text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors flex-1 justify-center">
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Edit panel ──────────────────────────────────────────────────────────────

function EditPanel({ post, onSave }) {
  const [editContent, setEditContent] = useState(post.content || "")
  const [editSlides,  setEditSlides]  = useState(post.slides  || [])
  const [saving, setSaving]           = useState(false)
  const [saved,  setSaved]            = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({ content: editContent, slides: editSlides.length ? editSlides : undefined })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Edit content</p>

      <textarea
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
        rows={10}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#0077B5] resize-none transition-colors font-mono leading-relaxed"
      />

      {post.post_type === "carousel" && editSlides.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Slides</p>
          {editSlides.map((slide, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2 font-medium">
                Slide {i + 1} — {slide.type}
              </p>
              <input
                value={slide.headline || slide.cta_text || ""}
                onChange={e => {
                  const updated = [...editSlides]
                  if (slide.type === "cta") updated[i] = { ...slide, cta_text: e.target.value }
                  else updated[i] = { ...slide, headline: e.target.value }
                  setEditSlides(updated)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[#0077B5] mb-2"
                placeholder="Headline"
              />
              {slide.body !== undefined && (
                <textarea
                  value={slide.body}
                  onChange={e => {
                    const updated = [...editSlides]
                    updated[i] = { ...slide, body: e.target.value }
                    setEditSlides(updated)
                  }}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[#0077B5] resize-none"
                  placeholder="Body text"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {saving ? "Saving…" : "Save edits"}
        </button>
        {saved && <span className="text-green-600 text-sm font-medium">✓ Saved</span>}
      </div>
    </div>
  )
}

// ── Main Preview page ───────────────────────────────────────────────────────

export default function Preview({ user }) {
  const { postId } = useParams()
  const navigate   = useNavigate()

  const [post,        setPost]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [publishing,  setPublishing]  = useState(false)
  const [error,       setError]       = useState("")
  const [success,     setSuccess]     = useState("")
  const [regenLoading, setRegenLoading] = useState(false)

  useEffect(() => {
    content.preview(postId)
      .then(setPost)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [postId])

  async function handleSaveEdit(updates) {
    const updated = await content.edit(postId, updates)
    setPost(p => ({ ...p, ...updated.post }))
  }

  async function handleRegenerate() {
    setRegenLoading(true)
    setError("")
    try {
      const result = await content.regenerate(postId, {})
      setPost(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setRegenLoading(false)
    }
  }

  async function handlePublish() {
    setPublishing(true)
    setError("")
    try {
      await posts.publish(postId)
      setSuccess("🎉 Post published to LinkedIn!")
      setTimeout(() => navigate("/history"), 2000)
    } catch (e) {
      setError(e.message)
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0077B5] rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg font-medium">Post not found.</p>
        <button onClick={() => navigate("/new")} className="mt-4 text-[#0077B5] text-sm hover:underline">
          ← Back to New Post
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate("/new")} className="text-sm text-gray-400 hover:text-gray-600 mb-1 block">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Preview</h1>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={regenLoading}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium rounded-lg transition-colors"
          >
            {regenLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
            ) : "↺"}
            Regenerate
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing || post.status === "published"}
            className="flex items-center gap-2 px-5 py-2 bg-[#057642] hover:bg-[#045e35] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {publishing ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : "🚀"}
            {publishing ? "Publishing…" : post.status === "published" ? "Published" : "Post to LinkedIn"}
          </button>
        </div>
      </div>

      {error   && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — LinkedIn mock */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">LinkedIn preview</p>
          <LinkedInMock post={post} user={user} />
        </div>

        {/* Right — Edit panel */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Edit before posting</p>
          <EditPanel post={post} onSave={handleSaveEdit} />

          {/* Post meta */}
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Post details</p>
            <div className="space-y-2 text-sm">
              {[
                { label: "Type",       value: post.post_type },
                { label: "Tone",       value: post.tone },
                { label: "Hook",       value: post.hook_style },
                { label: "Input",      value: post.input_type },
                { label: "Status",     value: post.status },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gray-700 font-medium capitalize">{value?.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}