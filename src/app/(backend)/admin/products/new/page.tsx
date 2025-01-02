'use client';

import React, { useState } from 'react';

const NewProductPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setImages(fileArray);
  };

  const handleSubmit = async () => {
    if (!name || !price || !description || images.length === 0) {
      return alert('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('description', description);

    // Append images
    images.forEach((file) => {
      formData.append('images', file);
    });

    setLoading(true);
    try {
      const res = await fetch('/api/products/new', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Product created successfully!');
        window.location.href = '/admin/products'; // Redirect to the product listing page
      } else {
        alert(data.message || 'Failed to create product.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Create New Product</h1>

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
        <label className="block font-medium">Upload Images</label>
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
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </div>
  );
};

export default NewProductPage;
