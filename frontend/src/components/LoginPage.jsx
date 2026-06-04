import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function LoginPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ identifier: "", password: "" })
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setMessage("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", formData)
            setMessage("Login successful")
            localStorage.setItem("token",response.data.token)
            localStorage.setItem("userId", response.data.user._id)
            localStorage.setItem("name", response.data.user.name)
            setFormData({ identifier: "", password: "" })
            navigate("/allproducts")
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className="container">
            <header className="header">
                <div className="logo">RELOOP</div>
                <nav className="nav">
                    <a className="nav-link" href="/">Home</a>
                    <a className="nav-link" href="/register">Register</a>
                    <a className="nav-link" href="/login">Login</a>
                </nav>
            </header>

            <section className="hero register-hero">
                <div className="register-card">
                    <h2 className="section-title">Login</h2>
                    <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
                        <input type="text" name="hidden-username" autoComplete="username" style={{ display: "none" }} />
                        <input type="password" name="hidden-password" autoComplete="current-password" style={{ display: "none" }} />

                        <label className="form-label" htmlFor="identifier">Name or Email</label>
                        <input
                            className="form-input"
                            type="text"
                            id="identifier"
                            name="identifier"
                            placeholder="Enter your name or email"
                            autoComplete="off"
                            value={formData.identifier}
                            onChange={handleChange}
                        />

                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            autoComplete="off"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <button type="submit" className="cta-button">Login</button>
                    </form>
                    <br />
                    <p>{message}</p>
                </div>
            </section>

            <footer className="footer">
                <p className="footer-text">© 2026 Reloop. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default LoginPage