import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Addproduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value  // ✅ FIX
    }));
  }

  async function handleAddProduct(e) {
    e.preventDefault();

    // ✅ Simple validation
    if (!formData.name || !formData.price) {
      alert("Name and Price are required");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ✅ FIX

      const res = await API.post(
        "/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ IMPORTANT
          }
        }
      );

      if (res.status === 201) {
        alert("Product added successfully ✅");
        navigate("/");
      }

    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Error adding product");
    }
  }

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <form onSubmit={handleAddProduct} className="card p-4 shadow">
            
            <h3 className="mb-3">Add Product</h3>

            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter Name"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                placeholder="Enter Price"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                className="form-control"
                placeholder="Enter description"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                name="image"
                className="form-control"
                placeholder="Enter image url"
                onChange={handleChange}
              />
            </div>

            <button className='btn btn-warning w-100'>
              Add Product
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}