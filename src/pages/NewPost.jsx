import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { content } from "../api"

const INPUT_TYPES = [
  { value: "topic",   label: "Topic",   placeholder: "e.g. Why every developer should learn Docker" },
  { value: "youtube", label: "YouTube", placeholder: "https://youtube.com/watch?v=..." },
  { value: "article", label: "Article", placeholder: "https://dev.to/some-article" },
  { value: "notes",   label: "Notes",   placeholder: "Paste your raw notes or draft here..." },
]

const POST_TYPES = [
  { value: "text",     label: "Text Post",  desc: "Hook + body + CTA",         icon: "📝" },
  { value: "carousel", label: "Carousel",   desc: "Slide deck PDF",             icon: "🎠" },
  { value: "image",    label: "Image Post", desc: "AI image + caption",         icon: "🖼️" },
]

const TONES = [
  { value: "educational",  label: "Educational"  },
  { value: "casual",       label: "Casual"       },
  { value: "motivational", label: "Motivational" },
  { value: "storytelling", label: "Storytelling" },
]

const HOOKS = [
  { value: "question",       label: "Question"       },
  { value: "bold_stat",      label: "Bold Stat"      },
  { value: "controversial",  label: "Controversial"  },
  { value: "personal_story", label: "Personal Story" },
]

const LENGTHS = [
  { value: "short",  label: "Short",  hint: "~150w" },
  { value: "medium", label: "Medium", hint: "~300w" },
  { value: "long",   label: "Long",   hint: "~500w" },
]

function SegmentControl({ options, value, onChange }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium transition-all ${
            value === opt.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt.label}
          {opt.hint && <span className="text-xs text-gray-400 ml-1">{opt.hint}</span>}
        </button>
      ))}
    </div>
  )
}

export default function NewPost() {
  const navigate = useNavigate()

  const [inputType,    setInputType]    = useState("topic")
  const [inputContent, setInputContent] = useState("")
  const [postType,     setPostType]     = useState("text")
  const [tone,         setTone]         = useState("educational")
  const [hookStyle,    setHookStyle]    = useState("question")
  const [length,       setLength]       = useState("medium")
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState("")

  const currentInput = INPUT_TYPES.find(t => t.value === inputType)

  const loadingHints = {
    youtube: "Extracting transcript…",
    article: "Scraping article…",
    topic:   "Writing your post…",
    notes:   "Writing your post…",
  }

  async function handleGenerate() {
    if (!inputContent.trim()) { setError("Please enter some content."); return }
    setError("")
    setLoading(true)
    try {
      const result = await content.generate({
        input_type:    inputType,
        input_content: inputContent,
        post_type:     postType,
        tone,
        hook_style:    hookStyle,
        length,
      })
      navigate(`/preview/${result.post_id}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Post</h1>
        <p className="text-gray-500 text-sm mt-1">Generate LinkedIn content from any source.</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Step 1 — Input */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">1. Input source</p>

        <div className="flex bg-gray-100 rounded-lg p-1 gap-1 mb-4">
          {INPUT_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => { setInputType(t.value); setInputContent("") }}
              className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium transition-all ${
                inputType === t.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {inputType === "notes" ? (
          <textarea
            rows={5}
            placeholder={currentInput.placeholder}
            value={inputContent}
            onChange={e => setInputContent(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#0077B5] resize-none transition-colors"
          />
        ) : (
          <input
            type={inputType === "topic" ? "text" : "url"}
            placeholder={currentInput.placeholder}
            value={inputContent}
            onChange={e => setInputContent(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#0077B5] transition-colors"
          />
        )}
      </div>

      {/* Step 2 — Post type */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">2. Post type</p>
        <div className="grid grid-cols-3 gap-3">
          {POST_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setPostType(t.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                postType === t.value
                  ? "border-[#0077B5] bg-[#e8f3f9]"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className={`text-sm font-semibold ${postType === t.value ? "text-[#0077B5]" : "text-gray-700"}`}>
                {t.label}
              </span>
              <span className="text-xs text-gray-400 text-center">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3 — Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">3. Content settings</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Tone</label>
            <SegmentControl options={TONES} value={tone} onChange={setTone} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Hook style</label>
            <SegmentControl options={HOOKS} value={hookStyle} onChange={setHookStyle} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Length</label>
            <SegmentControl options={LENGTHS} value={length} onChange={setLength} />
          </div>
        </div>
      </div>

      {/* Generate */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading || !inputContent.trim()}
          className="flex items-center gap-2 px-8 py-3 bg-[#0077B5] hover:bg-[#005f91] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            "Generate Post →"
          )}
        </button>
        {loading && (
          <p className="text-sm text-gray-400">{loadingHints[inputType]}</p>
        )}
      </div>

    </div>
  )
}