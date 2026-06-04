import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cities } from "../data/cities";

function AllProducts({ searchTerm: propSearchTerm, setSearchTerm: setParentSearchTerm }) {
  const [internalSearchTerm, setInternalSearchTerm] = useState(propSearchTerm ?? "");
  const searchValue = propSearchTerm !== undefined ? propSearchTerm : internalSearchTerm;
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    condition: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleSearchChange = (value) => {
    if (setParentSearchTerm) {
      setParentSearchTerm(value);
    } else {
      setInternalSearchTerm(value);
    }
  }

  const navigate = useNavigate();
  const productPlaceholder = "https://via.placeholder.com/320x180?text=Product";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:5000/products/allproducts";

        if (searchValue.trim()) {
          url = `http://localhost:5000/products/search/${searchValue}`;
        } else if (
          filters.category ||
          filters.condition ||
          filters.location ||
          filters.minPrice ||
          filters.maxPrice
        ) {
          const query = new URLSearchParams(filters).toString();
          url = `http://localhost:5000/products/filter?${query}`;
        }

        const response = await axios.get(url);
        setProducts(response.data);
      } catch (err) {
        console.log(err);
        setMessage(err.message);
      }
    };

    fetchProducts();
  }, [searchValue, filters]);

  const handleFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = (id) => {
    navigate(`/product/${id}`);
  };

  const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  return (
    <div>
      <div className="search-toolbar">
        <div className="search-toolbar-group">
          <select
            value={filters.category}
            onChange={(e) => handleFilter("category", e.target.value)}
          >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home and Garden">Home and Garden</option>
          <option value="Furniture">Furniture</option>
          <option value="Others">Others</option>
        </select>

        <select
          value={filters.condition}
          onChange={(e) => handleFilter("condition", e.target.value)}
        >
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>

          <select
            value={filters.location}
            onChange={(e) => handleFilter("location", e.target.value)}
          >
          <option value="">All Locations</option>
          {Object.entries(cities).map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => handleFilter("minPrice", e.target.value)}
        />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilter("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {message && <p className="page-message">{message}</p>}

      <div className="products-grid">
        {products.map((product) => {
          const imageSrc = product.image || (product.images && product.images.length ? `${backendBase}${product.images[0]}` : productPlaceholder)
          return (
          <div key={product._id} className="product-card">
            <img
              src={imageSrc}
              alt={product.title}
              className="product-image"
            />
            <div className="product-card-body">
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
              </div>

              <div className="product-actions-row">
                <button className="cta-button" onClick={() => handleView(product._id)}>
                  View Details
                </button>
              </div>
            </div>
          </div>
          )
        })}
      </div>

      
    </div>
  );
}

export default AllProducts