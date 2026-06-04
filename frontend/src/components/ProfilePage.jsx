import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { cities } from "../data/cities"

function ProfilePage() {
    useDocumentTitle("Reloop | Profile")
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState("")
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", city: "" })
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }

        axios
            .get("https://reloop-backend.onrender.com/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setUser(response.data)
                setFormData({
                    name: response.data.name || "",
                    email: response.data.email || "",
                    phone: response.data.phone || "",
                    city: response.data.city || "",
                })
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    navigate("/login")
                } else {
                    setError("Unable to load profile")
                }
            })
    }, [navigate])

    if (error) {
        return (
            <div className="container profile-page">
                <section className="hero register-hero">
                    <div className="register-card profile-card">
                        <h1 className="section-title">Profile</h1>
                        <div className="profile-message">{error}</div>
                    </div>
                </section>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container profile-page">
                <section className="hero register-hero">
                    <div className="register-card profile-card">
                        <h1 className="section-title">Profile</h1>
                        <div className="profile-message">Loading...</div>
                    </div>
                </section>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/login")
            return
        }

        try {
            const response = await axios.patch(
                "https://reloop-backend.onrender.com/user/profile",
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    city: formData.city,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setUser(response.data)
            setFormData({
                name: response.data.name || "",
                email: response.data.email || "",
                phone: response.data.phone || "",
                city: response.data.city || "",
            })
            setMessage("Edited Successfully")
        } catch (err) {
            setMessage(err.response?.data?.message || "Unable to update profile")
        }

        setTimeout(() => {
            setMessage("")
        }, 3000)
    }

    return (
        <div className="container profile-page">
            <section className="hero register-hero">
                <div className="register-card profile-card">
                    <h1 className="section-title">My Profile</h1>
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="profile-field">
                            <label className="form-label">Full Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profile-field">
                            <label className="form-label">Email</label>
                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                            />
                        </div>
                        <div className="profile-field">
                            <label className="form-label">Phone</label>
                            <input
                                className="form-input"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="profile-field">
                            <label className="form-label">City</label>
                            <select
                                className="form-input"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            >
                                <option value="">Select city</option>
                                {Object.values(cities).map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="profile-field">
                            <label className="form-label">Account Status</label>
                            <span className="form-input profile-status">
                                {user.account_status || "Active"}
                            </span>
                        </div>
                        <div className="profile-field">
                            <label className="form-label">Ratings</label>
                            <span>{user.ratings ?? "N/A"}</span>
                        </div>
                        <div className="profile-field">
                            <label className="form-label">Reports</label>
                            <span>{user.reports ?? "N/A"}</span>
                        </div>
                        <div className="profile-field">
                            <label className="form-label">Member Since</label>
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="profile-actions">
                            <button type="submit" className="cta-button">
                                Submit
                            </button>&emsp;
                            <button type="button" className="cta-button secondary-button" onClick={()=>navigate("/passchange")}>
                                Change Password
                            </button>
                        </div>
                        <p>{message}</p>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default ProfilePage