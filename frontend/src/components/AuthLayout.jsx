import React, { useMemo, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

function AuthLayout({ children, title, searchTerm, onSearchChange }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const name = localStorage.getItem("name") || "User"
  const initials = useMemo(() => {
    return name
      .split(" ")
      .filter((token) => token.length)
      .map((token) => token[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }, [name])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="auth-brand">
          <button className="back-button" type="button" onClick={handleBack}>
            ← Back
          </button>
          <div className="logo">RELOOP</div>
        </div>

        {onSearchChange ? (
          <div className="auth-search">
            <input
              className="auth-search-input"
              type="search"
              placeholder="Search products..."
              value={searchTerm || ""}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        ) : null}

        <div className="auth-profile-menu">
          <button className="profile-avatar" type="button" onClick={() => setMenuOpen((prev) => !prev)}>
            {initials}
          </button>
          <div className="profile-details">
            <div className="profile-name">{name}</div>
          </div>
          {menuOpen && (
            <div className="profile-dropdown">
              <NavLink to="/profile" className="dropdown-link" onClick={() => setMenuOpen(false)}>
                My Profile
              </NavLink>
              <NavLink to="/messages" className="dropdown-link" onClick={() => setMenuOpen(false)}>
                Inbox
              </NavLink>
              <NavLink to="/dashboard" className="dropdown-link" onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>
              <button className="dropdown-link logout-button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="auth-main">
        {title ? (
          <div className="auth-title-row">
            <h1 className="auth-page-title">{title}</h1>
          </div>
        ) : null}
        <div className="auth-content">{children}</div>
      </main>
    </div>
  )
}

export default AuthLayout
