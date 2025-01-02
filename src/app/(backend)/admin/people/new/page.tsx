'use client';

import React, { useState } from 'react';

const NewPersonPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const handleSubmit = async () => {
    if (!name || !role || !category || !image) {
      return alert('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('category', category);
    formData.append('image', image);

    setLoading(true);
    try {
      const res = await fetch('/api/people/new', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Person created successfully!');
        window.location.href = '/admin/people'; // Redirect to the people listing page
      } else {
        alert(data.message || 'Failed to create person.');
      }
    } catch (error) {
      console.error('Error creating person:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Create New Person</h1>

      <input
        type="text"
        placeholder="Person Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <div>
        <label className="block font-medium">Upload Image</label>
        <input
          type="file"
          onChange={(e) => handleImageChange(e.target.files ? e.target.files[0] : null)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {image && (
          <p className="text-sm text-gray-500 mt-2">
            {image.name} selected.
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        {loading ? 'Creating...' : 'Create Person'}
      </button>
    </div>
  );
};

export default NewPersonPage;
