'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const UpdateProductPage = () => {
  const { id: productId } = useParams(); // Get the product ID from the URL parameters
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/single/${productId}`);
        const data = await res.json();

        if (data.success) {
          const { name, price, description, images } = data.product;
          setName(name || '');
          setPrice(price || '');
          setDescription(description || '');
          setCurrentImages(images || []);
        } else {
          alert('Failed to fetch product data.');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    setImages(Array.from(files));
  };

  const handleRemoveImage = (index: number) => {
    setImagesToRemove((prev) => [...prev, currentImages[index]]);
    setCurrentImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !price || !description) {
      return alert('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('description', description);

    // Append new images
    images.forEach((file) => {
      formData.append('images', file);
    });

    // Append images to remove
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));

    setLoading(true);
    try {
      const res = await fetch(`/api/products/update/${productId}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        alert('Product updated successfully!');
        window.location.href = '/admin/products'; // Redirect to the product listing page
      } else {
        alert(data.message || 'Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Update Product</h1>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      ></textarea>

      <div>
        <label className="block font-medium">Current Images</label>
        <div className="flex space-x-4 mt-2">
          {currentImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Current Image ${index + 1}`}
                className="w-20 h-20 object-cover border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium">Upload New Images</label>
        <input
          type="file"
          multiple
          onChange={(e) => handleImageChange(e.target.files)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {images.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            {images.length} file(s) selected.
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {loading ? 'Updating...' : 'Update Product'}
      </button>
    </div>
  );
};

export default UpdateProductPage;
