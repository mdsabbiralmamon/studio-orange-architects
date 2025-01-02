'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const UpdatePersonPage = () => {
  const { id: personId } = useParams(); // Get the person ID from the URL parameters
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageToRemove, setImageToRemove] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!personId) return;

    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/people/single/${personId}`);
        const data = await res.json();

        if (data.success) {
          const { name, role, category, image } = data.person;
          setName(name || '');
          setRole(role || '');
          setCategory(category || '');
          setCurrentImage(image || null);
        } else {
          alert('Failed to fetch person data.');
        }
      } catch (error) {
        console.error('Error fetching person:', error);
      }
    };

    fetchPerson();
  }, [personId]);

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const handleRemoveImage = () => {
    setImageToRemove(true);
    setCurrentImage(null);
  };

  const handleSubmit = async () => {
    if (!name || !role || !category) {
      return alert('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('category', category);

    // Append new image if uploaded
    if (image) {
      formData.append('image', image);
    }

    // Append flag for image removal
    formData.append('imageToRemove', JSON.stringify(imageToRemove));

    setLoading(true);
    try {
      const res = await fetch(`/api/people/update/${personId}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        alert('Person updated successfully!');
        window.location.href = '/admin/people'; // Redirect to the people listing page
      } else {
        alert(data.message || 'Failed to update person.');
      }
    } catch (error) {
      console.error('Error updating person:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Update Person</h1>

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
        <label className="block font-medium">Current Image</label>
        {currentImage && (
          <div className="relative mt-2">
            <img
              src={currentImage}
              alt="Current Person Image"
              className="w-20 h-20 object-cover border border-gray-300 rounded-md"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
            >
              X
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block font-medium">Upload New Image</label>
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
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {loading ? 'Updating...' : 'Update Person'}
      </button>
    </div>
  );
};

export default UpdatePersonPage;
