'use client';

import React, { useState } from 'react';

const NewPostPage = () => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [descriptions, setDescriptions] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const handleCoverChange = (file: File | null) => {
    setCover(file);
  };

  const handleDescriptionChange = (value: string, index: number) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    setDescriptions(updatedDescriptions);
  };

  const handleAddDescription = () => {
    setDescriptions([...descriptions, '']);
  };

  const handleRemoveDescription = (index: number) => {
    const updatedDescriptions = descriptions.filter((_, i) => i !== index);
    setDescriptions(updatedDescriptions);
  };

  const handleSubmit = async () => {
    if (!title || !topic || !cover || descriptions.length === 0 || descriptions.some((desc) => !desc.trim())) {
      return alert('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('topic', topic);
    formData.append('cover', cover);
    descriptions.forEach((desc) => {
      formData.append('description', desc);
    });

    setLoading(true);
    try {
      const res = await fetch('/api/posts/manage', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Post created successfully!');
        window.location.href = '/admin/posts'; // Redirect to the posts listing page
      } else {
        alert(data.message || 'Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Create New Post</h1>

      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <div>
        <label className="block font-medium">Upload Cover Image</label>
        <input
          type="file"
          onChange={(e) => handleCoverChange(e.target.files ? e.target.files[0] : null)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {cover && (
          <p className="text-sm text-gray-500 mt-2">
            {cover.name} selected.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block font-medium">Descriptions</label>
        {descriptions.map((desc, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="text"
              placeholder={`Description ${index + 1}`}
              value={desc}
              onChange={(e) => handleDescriptionChange(e.target.value, index)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {descriptions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveDescription(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddDescription}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Description
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </div>
  );
};

export default NewPostPage;
