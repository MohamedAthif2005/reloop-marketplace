import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const productPlaceholder = "https://via.placeholder.com/640x360?text=Product+Image"

function ViewProduct() {
    const [product, setProduct] = useState(null)
    const [message, setMessage] = useState("")
    const [senderMessage, setSenderMessage] = useState("")
    const [isSeller,setIsSeller] = useState(false)
    const token = localStorage.getItem("token")
    const { id } = useParams()  
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/viewproduct/${id}`,{
                    headers:{"Authorization":`Bearer ${token}`}
                })
                setProduct(response.data.product)
                setIsSeller(response.data.isSeller)
            } catch (err) {
                console.log(err)
                setMessage("Failed to load product")
            }
        }
        fetchProduct()
    }, [id, token, navigate])

    if (!product) {
        return <p>Loading...</p>
    }

    const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const imageSrc = product.image || (product.images && product.images.length ? `${backendBase}${product.images[0]}` : productPlaceholder)

    return (
        <div className="product-detail-page">
            <div className="product-detail-card">
                <img
                    src={imageSrc}
                    alt={product.title}
                    className="product-detail-image"
                />
                <div className="product-detail-body">
                    <h1>{product.title}</h1>
                    <p className="product-detail-description">{product.description}</p>
                    <div className="product-detail-meta">
                        <span>Price: ₹ {product.price}</span>
                        <span>Category: {product.category}</span>
                        <span>Condition: {product.condition}</span>
                        <span>Location: {product.location}</span>
                        {!isSeller && <span>Status: {product.status}</span>}
                    </div>

                    {!isSeller && (
                        <div className="product-message-box">
                            {message && <div className="page-message">{message}</div>}
                            <textarea
                                className="product-message-input"
                                placeholder="Message to seller"
                                rows={5}
                                value={senderMessage}
                                onChange={(e) => setSenderMessage(e.target.value)}
                            />
                            <button
                                type="button"
                                className="cta-button"
                                onClick={async () => {
                                    if (!senderMessage.trim()) {
                                        setMessage("Please enter a message before sending.")
                                        return
                                    }

                                    try {
                                        const response = await axios.post(
                                            "http://localhost:5000/messages/",
                                            { productId: product._id, message: senderMessage },
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${token}`
                                                }
                                            }
                                        )
                                        setMessage(response.data.message)
                                        setSenderMessage("")
                                    } catch (err) {
                                        setMessage(err.response?.data?.message || "Failed to send message")
                                    }
                                }}
                            >
                                Send Message
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViewProduct