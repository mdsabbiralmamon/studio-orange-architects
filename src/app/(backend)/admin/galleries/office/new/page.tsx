'use client';

import React, { useState } from 'react';

const NewOfficeGalleryPage = () => {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (files: FileList | null) => {
    if (files) {
      setImages(Array.from(files));
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      return alert('Please select at least one image.');
    }

    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    setLoading(true);
    try {
      const res = await fetch('/api/gallery/office/manage', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Office gallery images added successfully!');
        window.location.href = '/admin/galleries';
      } else {
        alert(data.message || 'Failed to add office gallery images.');
      }
    } catch (error) {
      console.error('Error adding office gallery images:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Add New Office Gallery Image</h1>
      <div>
        <label className="block font-medium">Upload Images</label>
        <input
          type="file"
          multiple
          onChange={(e) => handleImageChange(e.target.files)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {images.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">{images.length} files selected.</p>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {loading ? 'Uploading...' : 'Add Images'}
      </button>
    </div>
  );
};

export default NewOfficeGalleryPage;
