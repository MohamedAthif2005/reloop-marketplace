import React from "react"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import { cities } from "../data/cities"
import axios from "axios"

function RegisterPage() {
    const navigate = useNavigate()
    const [formData,setFormData] = useState({name:"",email:"",phone:"",password:"",city:""})
    const [message,setMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async(e) =>
    {
        e.preventDefault()
        try
        {
            const response = await axios.post("http://localhost:5000/api/auth/register",formData)
            setMessage(response.data.message)
            setFormData({name:"",email:"",phone:"",password:"",city:""})
            navigate("/login")
        }
        catch(err)
        {
            setMessage(err.response?.data?.message||"Something went wrong")
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
                    <h2 className="section-title">Register</h2>
                    <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
                        <input type="text" name="hidden-username" autoComplete="username" style={{ display: "none" }} />
                        <input type="password" name="hidden-password" autoComplete="new-password" style={{ display: "none" }} />

                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-input" type="text" id="name" name="name" placeholder="Enter your name" autoComplete="off" value={formData.name} onChange={(e) => { handleChange(e); setMessage("") }}/>

                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-input" type="email" id="email" name="email" placeholder="Enter your email"  autoComplete="off" value={formData.email} onChange={(e) => { handleChange(e); setMessage("") }}/>

                        <label className="form-label" htmlFor="phone">Phone</label>
                        <input className="form-input" type="tel" id="phone" name="phone" placeholder="Enter your phone number"  autoComplete="off" value={formData.phone} onChange={(e) => { handleChange(e); setMessage("") }} maxLength="10"/>

                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-input" type="password" id="password" name="password" placeholder="Choose a password"  autoComplete="off" value={formData.password} onChange={(e) => { handleChange(e); setMessage("") }}/>

                        <label className="form-label" htmlFor="city">City</label>
                        <select className="form-input" id="city" name="city" value={formData.city} onChange={(e) => { handleChange(e); setMessage("") }}>
                            <option value="">Select a city</option>
                            {Object.entries(cities).map(([key, value]) => (
                                <option key={key} value={value}>{value}</option>
                            ))}
                        </select>

                        <button type="submit" className="cta-button">Create Account</button>
                    </form><br></br>
                    <p>{message}</p>
                </div>
            </section>

            <footer className="footer">
                <p className="footer-text">
                    © 2026 Reloop. All rights reserved.
                </p>
            </footer>
        </div>
    )
}

export default RegisterPage
