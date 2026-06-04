import React, {useState, useEffect} from "react"
import axios from "axios"   
import { useNavigate, useParams } from "react-router-dom"
import { cities } from "../data/cities"

function EditProduct() {
    const [formData, setFormData] = useState({ title: "", description: "", price: "", category: "", condition: "", location: "" })
    const [message, setMessage] = useState("")
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const { id } = useParams()
    useEffect(() => {

        if (!token) {
            navigate("/login")
            return
        }
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${id}`,{headers: {Authorization: `Bearer ${token}`}})
                setFormData(response.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchProduct()
    }, [token, id, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.put(
            `http://localhost:5000/products/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        setMessage(response.data.message)
        setTimeout(() => {
            navigate("/dashboard")
        }, 2000)
    }
    return (
        <div>
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="condition">Condition:</label>
                    <select
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                    >
                        <option value="">Select a condition</option>
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Used">Used</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="location">Location:</label>
                    <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    >
                        <option value="">Select a location</option>
                        {Object.entries(cities).map(([key, value]) => (
                            <option key={key} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Update Product</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}

export default EditProduct