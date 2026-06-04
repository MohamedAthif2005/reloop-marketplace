import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"

function PassChange() {
    useDocumentTitle("Reloop | Change Password")

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [message, setMessage] = useState("")

    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        try {
            const response = await axios.patch("https://reloop-backend.onrender.com/user/passchange",
                    {
                        oldpass: oldPassword,
                        newpass: newPassword
                    },
                    {
                        headers: {
                            Authorization:`Bearer ${token}`
                        }
                    }
                )
            setMessage(response.data.message)
            setOldPassword("")
            setNewPassword("")

        }
        catch (err) {
            setMessage(err.response?.data?.message|| "Something went wrong" )
        }
    }
    return (
        <div className="pass-container">
            <form
                className="pass-form"
                onSubmit={handleSubmit}
            >
                <h2 className="section-title">
                    Change Password
                </h2>
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) =>
                        setOldPassword(
                            e.target.value
                        )
                    }
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                />
                <button type="submit">Change Password
                </button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}

export default PassChange