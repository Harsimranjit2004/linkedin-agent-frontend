import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { auth } from "./api"
import Navbar from "./components/Navbar"
import NewPost from "./pages/NewPost"
import Preview from "./pages/Preview"
import Queue from "./pages/Queue"
import History from "./pages/History"

function AppShell() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const location              = useLocation()

  useEffect(() => {
    auth.getMe()
      .then(setUser)
      .catch(() => setUser({ authenticated: false }))
      .finally(() => setLoading(false))
  }, [location.search])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4f2ee]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0077B5] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user?.authenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4f2ee]">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 w-full max-w-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#0077B5"/>
              <text x="7" y="23" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">in</text>
            </svg>
            <span className="text-xl font-bold text-gray-900">LinkedIn Agent</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">Generate and publish LinkedIn content with AI.</p>
          <a
            href={auth.loginUrl}
            className="inline-block w-full py-2.5 bg-[#0077B5] hover:bg-[#005f91] text-white font-semibold rounded-full transition-colors"
          >
            Connect LinkedIn
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      <Navbar user={user} setUser={setUser} />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/"                    element={<Navigate to="/new" replace />} />
          <Route path="/new"                 element={<NewPost />} />
          <Route path="/preview/:postId"     element={<Preview user={user} />} />
          <Route path="/queue"               element={<Queue />} />
          <Route path="/history"             element={<History />} />
          <Route path="*"                    element={<Navigate to="/new" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}