import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { cities } from "../data/cities"

function AddProduct() {
    const [formData, setFormData] = useState({ title: "", description: "", price: "", category: "", condition: "", location: "" })
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState("")
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [token, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('price', formData.price)
            data.append('category', formData.category)
            data.append('condition', formData.condition)
            data.append('location', formData.location)
            if (selectedFile) data.append('image', selectedFile)

            const response = await axios.post(
                "http://localhost:5000/products/addproduct",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                        // Let browser set Content-Type with boundary for multipart
                    }
                }
            )

            setMessage(response.data.message)
            console.log(formData)
            setFormData({
                title: "",
                description: "",
                price: "",
                category: "",
                condition: "",
                location: ""
            })
            setSelectedFile(null)
            setPreviewUrl("")
            navigate("/dashboard")

        } catch (err) {

            console.log(err)

            setMessage(
                err.response?.data?.message ||
                "Failed to add product"
            )
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setSelectedFile(null)
            setPreviewUrl("")
        }
    }

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])
    return (
        <div className="auth-main">
            <div className="auth-content">
                <div id="add-product-card" className="register-card">
                    <h1 className="section-title">Add Product</h1>
                    <form onSubmit={handleSubmit} className="register-form">
                        <label>Title:</label>
                        <input className="form-input" type="text" name="title" value={formData.title} onChange={handleChange} />
                        <br />

                        <label>Description:</label>
                        <textarea className="form-input" name="description" value={formData.description} onChange={handleChange} />
                        <br />

                        <label>Price:</label>
                        <input className="form-input" type="number" name="price" value={formData.price} onChange={handleChange} />
                        <br />

                        <label>Category:</label>
                        <select className="form-input" name="category" value={formData.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home & Garden">Home & Garden</option>
                            <option value="Furnitures">Furnitures</option>
                            <option value="Others">Others</option>
                        </select>
                        <br />

                        <label>Condition:</label>
                        <select className="form-input" name="condition" value={formData.condition} onChange={handleChange}>
                            <option value="">Select Condition</option>
                            <option value="New">New</option>
                            <option value="Like New">Like New</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                        <br />

                        <label>Location:</label>
                        <select className="form-input" name="location" value={formData.location} onChange={handleChange}>
                            <option value="">Select City</option>
                            {Object.entries(cities).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        <br />

                        <label>Image:</label>
                        <input className="form-input" type="file" accept="image/*" onChange={handleFileChange} />
                        {previewUrl && <img src={previewUrl} alt="preview" className="image-preview" />}

                        <button className="cta-button" type="submit">Add Product</button>
                    </form>

                    {message && <p className="page-message">{message}</p>}
                </div>
            </div>
        </div>
    )
}

export default AddProduct