'use client';

import React, { useState } from 'react';

const NewProjectPage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverAlt, setCoverAlt] = useState('');
  const [coverName, setCoverName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageAlts, setImageAlts] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [details, setDetails] = useState({
    AppointmentYear: '',
    CompletionYear: '',
    Client: '',
    Location: '',
  });
  const [description, setDescription] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const imageArray = Array.from(files)
    setImages(imageArray);
  };

  const handleSubmit = async () => {
    if (!title || !category || !cover) {
      return alert('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('cover', cover);
    formData.append('coverAlt', coverAlt);
    formData.append('coverName', coverName);
    formData.append('description', description);
    formData.append('mapLocation', mapLocation);
    formData.append('details', JSON.stringify(details));

    // Append images
    images.forEach((file, index) => {
      formData.append('images', file);
      formData.append('imageAlts', imageAlts[index]);
      formData.append('imageNames', imageNames[index]);
    });

    setLoading(true);
    try {
      const res = await fetch('/api/projects/new', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/admin/projects';
      } else {
        alert('Failed to create project.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Create New Project</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      >
        <option value="" disabled>
          Select Category
        </option>
        <option value="Architecture">Architecture</option>
        <option value="Interior">Interior</option>
        <option value="Landscape">Landscape</option>
        <option value="Artwork">Artwork</option>
        <option value="ReCrafted">ReCrafted</option>
        <option value="Woodwork">Woodwork</option>
      </select>

      <div>
        <label className="block">Cover Image</label>
        <input
          type="file"
          onChange={(e) => setCover(e.target.files?.[0] || null)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {cover && (
          <div>
            <input
              type="text"
              placeholder="Alt text for Cover Image"
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Name for Cover Image"
              value={coverName}
              onChange={(e) => setCoverName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block">Additional Images</label>
        <input
          type="file"
          multiple
          onChange={(e) => handleImageChange(e.target.files)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {images.map((image, index) => (
          <div key={index} className="mt-2">
            <input
              type="text"
              placeholder={`Alt text for Image ${index + 1}`}
              value={imageAlts[index] || ''}
              onChange={(e) => {
                const updatedAlts = [...imageAlts];
                updatedAlts[index] = e.target.value;
                setImageAlts(updatedAlts);
              }}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder={`Name for Image ${index + 1}`}
              value={imageNames[index] || ''}
              onChange={(e) => {
                const updatedNames = [...imageNames];
                updatedNames[index] = e.target.value;
                setImageNames(updatedNames);
              }}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
      </div>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      ></textarea>

      <input
        type="text"
        placeholder="Map Location"
        value={mapLocation}
        onChange={(e) => setMapLocation(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <div>
        <h3 className="font-medium">Details</h3>
        <input
          type="text"
          placeholder="Appointment Year"
          value={details.AppointmentYear}
          onChange={(e) => setDetails({ ...details, AppointmentYear: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Completion Year"
          value={details.CompletionYear}
          onChange={(e) => setDetails({ ...details, CompletionYear: e.target.value })}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Client"
          value={details.Client}
          onChange={(e) => setDetails({ ...details, Client: e.target.value })}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Location"
          value={details.Location}
          onChange={(e) => setDetails({ ...details, Location: e.target.value })}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </div>
  );
};

export default NewProjectPage;
