import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { img } from "../utils/assets";
import "./Products.css";

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const imageMap = {
    "Exide Xplore 12X2.5L-C (2.5Ah)": "exide-2-5ah.jpg",
    "Exide Xplore 12X5L-B (5Ah)": "exide-5l-b.jpg",
    "Exide Xplore 12X7-B (7Ah)": "exide-7-b.jpg",
    "Exide Xplore 12X9-B (9Ah)": "exide-9-b.jpg",
    "Exide Xplore 12X14L-A2 (14Ah)": "exide-14l-a2.jpg",
    "Exide Xplore XLTZ4A (4Ah)": "exide-xltz4a.jpg",
    "Exide Xplore XLTZ5A (5Ah)": "exide-xltz5a.jpg",
    "Exide Xplore XLTZ6 (5Ah)": "exide-xltz6.jpg",
    "Exide Xplore XLTZ7 (6Ah)": "exide-xltz7.jpg",
    "Exide Xplore XLTZ9 (8Ah)": "exide-xltz9.jpg",
    "Exide Xplore XLTZ14 (12Ah)": "exide-xltz14.jpg"
  };

  // --- FIXED IMAGE LOGIC FOR THREE-WHEELER ---
  const getProductImage = (product, index = 0) => {
    // 1. If the product already has a direct URL, use it
    if (product.image && product.image.startsWith('http')) return product.image;

    // 2. Logic for Two-Wheeler
    if (subCategory === "two-wheeler") {
      const fileName = imageMap[product.name];
      return fileName 
        ? img(`/images/products/two-wheeler/${fileName}`) 
        : img("/images/products/two-wheeler/exide-7-b.jpg");
    }

    if (subCategory === "three-wheeler") {
      if (product.name.includes("EKO32")) return img("/images/products/three-wheeler/t1.jpg");
      if (product.name.includes("EKO40L")) return img("/images/products/three-wheeler/t2.jpg");
      if (product.name.includes("EKO50L")) return img("/images/products/three-wheeler/t3.jpg");
      return img("/images/products/three-wheeler/t1.jpg");
    }

    if (subCategory === "four-wheeler") {
      const file = product.imageName || `f${(index % 3) + 1}.jpg`;
      return img(`/images/products/four-wheeler/${file}`);
    }
    if (subCategory === "truck") {
      const file = product.imageName || `a${(index % 3) + 1}.jpg`;
      return img(`/images/products/truck/${file}`);
    }
    if (subCategory === "home") {
      const file = product.imageName || `h${(index % 3) + 1}.jpg`;
      return img(`/images/products/home/${file}`);
    }
    if (subCategory) {
      const fileName = product.imageName || 'default.jpg';
      return img(`/images/products/${subCategory}/${fileName}`);
    }

    if (category === "ups") {
      const file = `up${(index % 3) + 1}.jpg`;
      return img(`/images/products/ups/${file}`);
    }

    return img("/images/products/two-wheeler/exide-7-b.jpg");
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products", {
        params: { category, subCategory },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subCategory || category === "ups") fetchProducts();
  }, [subCategory, category]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  // --- Views ---
  if (category === "ups" && !subCategory) {
    return (
      <div className="products-container">
        <div className="products-header">
          <button onClick={() => navigate("/inventory")} className="back-button">← Back</button>
          <h1>UPS</h1>
        </div>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={getProductImage(product, index)}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = img("/images/products/ups/up1.jpg");
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-footer">
                    <p className="product-price">₹{product.price}</p>
                    <p className="product-stock">{product.stock} in stock</p>
                  </div>
                </div>
                <button
                  className="add-to-cart-btn"
                  disabled={product.stock === 0}
                  onClick={() => handleAddToCart(product)}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (category === "battery" && !subCategory) {
    return (
      <div className="products-container">
        <div className="products-header">
          <button onClick={() => navigate("/inventory")} className="back-button">← Back</button>
          <h1>Batteries</h1>
        </div>
        <div className="subcategories-grid">
          <div className="subcategory-card" onClick={() => setSubCategory("vehicle")}>
            <div className="subcategory-card-image">
              <img src={img("/images/products/four-wheeler/f1.jpg")} alt="Vehicle Batteries" />
            </div>
            <h3>Vehicle Batteries</h3>
            <p>2W • 3W • 4W • Truck</p>
          </div>
          <div className="subcategory-card" onClick={() => setSubCategory("home")}>
            <div className="subcategory-card-image">
              <img src={img("/images/products/home/h1.jpg")} alt="Home Batteries" />
            </div>
            <h3>Home Batteries</h3>
            <p>Inverter & backup</p>
          </div>
        </div>
      </div>
    );
  }

  if (subCategory === "vehicle") {
    return (
      <div className="products-container">
        <div className="products-header">
          <button onClick={() => setSubCategory(null)} className="back-button">← Back</button>
          <h1>Vehicle Batteries</h1>
        </div>
        <div className="subcategories-grid">
          {[
            { type: "two-wheeler", img: img("/images/products/two-wheeler/exide-7-b.jpg"), label: "Two Wheeler" },
            { type: "three-wheeler", img: img("/images/products/three-wheeler/t1.jpg"), label: "Three Wheeler" },
            { type: "four-wheeler", img: img("/images/products/four-wheeler/f1.jpg"), label: "Four Wheeler" },
            { type: "truck", img: img("/images/products/truck/a1.jpg"), label: "Truck" },
          ].map(({ type, img, label }) => (
            <div key={type} className="subcategory-card" onClick={() => setSubCategory(type)}>
              <div className="subcategory-card-image">
                <img src={img} alt={label} onError={(e) => { e.target.onerror = null; e.target.src = img("/images/products/two-wheeler/exide-7-b.jpg"); }} />
              </div>
              <h3>{label.toUpperCase()}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <button 
          onClick={() => setSubCategory(category === 'battery' ? (subCategory === 'home' ? null : 'vehicle') : null)} 
          className="back-button"
        >
          ← Back
        </button>
        <h1>{subCategory ? subCategory.replace("-", " ").toUpperCase() : "PRODUCTS"}</h1>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={getProductImage(product, index)} 
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = img("/images/products/two-wheeler/exide-7-b.jpg");
                  }}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-footer">
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-stock">{product.stock} in stock</p>
                </div>
              </div>
              <button 
                className="add-to-cart-btn" 
                disabled={product.stock === 0}
                onClick={() => handleAddToCart(product)}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;