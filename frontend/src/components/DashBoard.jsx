import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"

const productPlaceholder = "https://via.placeholder.com/320x180?text=Product"

function DashBoard() {
  useDocumentTitle("Reloop | Dashboard")
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState("")

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://reloop-backend.onrender.com/products/deleteproduct/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setMessage(response.data.message)
      setProducts((prev) => prev.filter((product) => product._id !== id))
    } catch (err) {
      setMessage(err.message)
    }
  }

  const handleMarkSold = async (id) => {
    // optimistic UI update; try backend call if available
    setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, status: "Sold" } : p)))
    try {
      await axios.put(
        `https://reloop-backend.onrender.com/products/sold/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (err) {
      setMessage(err.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://reloop-backend.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProducts(response.data.products || [])
      } catch (err) {
        setMessage(err.message)
      }
    }
    fetchData()
  }, [token])

  return (
    <div className="dashboard-hero">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <button className="cta-button dashboard-add-btn" onClick={() => navigate("/products/addproduct")}>Add Product</button>
        </div>
<br />
        <h2>Total Products: {products.length}</h2><br></br>
        <h2>Products Sold : {products.filter((p) => p.status === "Sold").length}</h2>
        <br></br><h2>Products Available : {products.filter((p) => p.status !== "Sold").length}</h2>

        <div className="products-section"><br></br>
          <h2 className="products-heading">My Products</h2>

          <div className="products-container">
            {products.length === 0 ? (
              <p>No products found. Please add some products.</p>
            ) : (
              products.map((product) => (
                <div className="product-card" key={product._id}>
                  {
                    (() => {
                      const backendBase = import.meta.env.VITE_API_URL || 'https://reloop-backend.onrender.com'
                      const src = product.image || (product.images && product.images.length ? `${backendBase}${product.images[0]}` : productPlaceholder)
                      return <img className="product-image" src={src} alt={product.title} />
                    })()
                  }
                  <div className="product-content">
                    <div className="product-card-header">
                      <h3 className="product-title">{product.title}</h3>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <div className="product-price-badge">₹ {product.price}</div>
                        {product.status && (
                          <div className={`product-status-badge ${product.status === 'Sold' ? 'sold' : ''}`}>
                            {product.status}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="product-meta-row">
                      <span className="product-location">{product.location}</span>
                      <span className="product-category">{product.category}</span>
                    </div>

                    <div className="product-actions-row">
                      <button className="edit-btn" onClick={() => navigate(`/editproduct/${product._id}`)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                      {product.status !== 'Sold' ? (
                        <button className="mark-sold-btn" onClick={() => handleMarkSold(product._id)}>Mark as Sold</button>
                      ) : (
                        <button className="mark-sold-btn" disabled>Sold</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="dashboard-message">{message}</p>
      </div>
    </div>
  )
}

export default DashBoard