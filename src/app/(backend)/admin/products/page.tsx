'use client';

// import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${page}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      setLoading(true);
  
      const res = await fetch(`/api/products/delete?id=${productId}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
  
      if (data.success) {
        alert("Product deleted successfully!");
        fetchProducts(currentPage); // Refresh the product list after deletion
      } else {
        alert(data.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Store</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => window.location.href = '/admin/products/new'}
      >
        Create New Product
      </button>

      {loading && <p>Loading...</p>}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex items-center bg-white p-4 rounded-md shadow-lg"
          >
            {/* Product Image */}
            <img
              width={100}
              height={100}
              src={product.images[0]}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-md"
            />

            {/* Product Info */}
            <div className="flex-1 ml-4">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-500">${product.price.toFixed(2)}</p>
              <p className="text-gray-500 text-sm truncate">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => window.location.href = `/admin/products/update/${product._id}`}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded-md"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          className="px-4 py-2 bg-gray-300 rounded-md"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
