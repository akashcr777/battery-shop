import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";

const products = [
  {
    id: 1,
    name: "EXIDE XPLORE",
    type: "battery",
    description: "Motorcycle VRLA Battery – Zero Maintenance",
    image: "/images/products/two-wheeler/exide-7-b.jpg",
  },
  {
    id: 2,
    name: "EXIDE INSTA BRITE",
    type: "battery",
    description: "Inverter Battery – Long Power Backup",
    image: "/images/products/home/h1.jpg",
  },
  {
    id: 3,
    name: "EXIDE DRIVE",
    type: "battery",
    description: "Car Battery – Premium Performance",
    image: "/images/products/four-wheeler/f1.jpg",
  },
  {
    id: 4,
    name: "AMARON PRO",
    type: "battery",
    description: "Auto Rickshaw Battery – Heavy Duty",
    image: "/images/products/three-wheeler/t1.jpg",
  },
  {
    id: 5,
    name: "EXIDE POWERSAFE",
    type: "battery",
    description: "Truck Battery – Commercial Grade",
    image: "/images/products/truck/a1.jpg",
  },
  {
    id: 6,
    name: "APC Smart-UPS",
    type: "ups",
    description: "Online UPS – 1000VA",
    image: "/images/products/ups/up1.jpg",
  },
  {
    id: 7,
    name: "Luminous Cruze",
    type: "ups",
    description: "Line Interactive UPS – 2000VA",
    image: "/images/products/ups/up2.jpg",
  },
  {
    id: 8,
    name: "Microtek Legend",
    type: "ups",
    description: "Premium UPS – 3000VA",
    image: "/images/products/ups/up3.jpg",
  },
];

const Inventory = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inventory-container">
      <h1 className="title">Our Inventory</h1>

      {/* CAROUSEL - fixed frame, full-size images */}
      <div className="carousel">
        <div className="carousel-frame">
          <div
            className="slides"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {products.map((item) => (
            <div className="slide" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/products/home/h1.jpg";
                }}
              />
              <div className="caption">
                <h2>{item.name}</h2>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
          </div>
        </div>

        <button
          className="nav left"
          onClick={() =>
            setCurrent((current - 1 + products.length) % products.length)
          }
        >
          ‹
        </button>

        <button
          className="nav right"
          onClick={() => setCurrent((current + 1) % products.length)}
        >
          ›
        </button>
      </div>

      {/* CATEGORIES */}
      <div className="categories">
        <div className="card" onClick={() => navigate("/products/battery")}>
          <div className="category-card-img">
            <img src="/images/products/two-wheeler/exide-7-b.jpg" alt="Batteries" />
          </div>
          <h3>Batteries</h3>
          <p>Vehicle & Home</p>
        </div>

        <div className="card" onClick={() => navigate("/products/ups")}>
          <div className="category-card-img">
            <img src="/images/products/ups/up1.jpg" alt="UPS" />
          </div>
          <h3>UPS</h3>
          <p>Power Backup</p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
