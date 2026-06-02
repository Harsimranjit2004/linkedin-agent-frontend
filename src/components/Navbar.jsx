import { NavLink, useNavigate } from "react-router-dom"
import { auth } from "../api"

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await auth.logout().catch(() => {})
    setUser({ authenticated: false })
    navigate("/")
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-6">

        {/* Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#0077B5"/>
            <text x="7" y="23" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">in</text>
          </svg>
          <span className="font-bold text-gray-900 text-[15px]">LinkedIn Agent</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1 flex-1">
          {[
            { to: "/new",     label: "New Post" },
            { to: "/queue",   label: "Queue"    },
            { to: "/history", label: "History"  },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#e8f3f9] text-[#0077B5]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 ml-auto">
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
          <span className="text-sm text-gray-500 font-medium hidden sm:block">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}