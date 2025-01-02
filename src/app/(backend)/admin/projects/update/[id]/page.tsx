'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const UpdateProjectPage = () => {
  const [project, setProject] = useState({
    title: '',
    category: '',
    cover: { url: '' },
    images: [{ url: '', name: '', alt: '' }],
    details: {
      AppointmentYear: '',
      CompletionYear: '',
      Client: '',
      Location: '',
    },
    description: '',
    mapLocation: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { id } = useParams();

  const categories = ['Architecture', 'Interior', 'Landscape', 'Product', 'Artwork', 'ReCrafted', 'Woodwork'];

  // Fetch project details on page load
  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/single/${id}`);
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
      } else {
        setMessage('Failed to load project details.');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setMessage('An error occurred while loading the project.');
    }
  };

  // Handle form submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Filter out blank image fields
      const filteredImages = project.images.filter(
        (image) => image.url.trim() !== '' && image.name.trim() !== '' && image.alt.trim() !== ''
      );

      const res = await fetch(`/api/projects/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...project,
          images: filteredImages,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Project updated successfully!');
        router.push('/admin/projects');
      } else {
        setMessage(data.message || 'Failed to update project.');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setMessage('An error occurred while updating the project.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for simple fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for the details object fields
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      details: { ...prev.details, [name]: value },
    }));
  };

  // Handle changes for image fields
  const handleImageChange = (index: number, field: string, value: string) => {
    const updatedImages = [...project.images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setProject((prev) => ({ ...prev, images: updatedImages }));
  };

  // Fetch project details when the page loads
  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-thin">Update Project</h1>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      <form className="space-y-4 mt-6" onSubmit={handleUpdate}>
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={project.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Cover Image URL</label>
          <input
            type="text"
            name="cover"
            value={project.cover.url}
            onChange={(e) =>
              setProject((prev) => ({
                ...prev,
                cover: { url: e.target.value },
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium">Additional Images</label>
          {project.images.map((image, index) => (
            <div key={index} className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                placeholder="Image URL"
                value={image.url}
                onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Image Name"
                value={image.name}
                onChange={(e) => handleImageChange(index, 'name', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Image Alt Text"
                value={image.alt}
                onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  const updatedImages = project.images.filter((_, i) => i !== index);
                  setProject((prev) => ({ ...prev, images: updatedImages }));
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Remove Image
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setProject((prev) => ({
                ...prev,
                images: [...prev.images, { url: '', name: '', alt: '' }],
              }))
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Image
          </button>
        </div>

        <div>
          <label className="block font-medium">Details</label>
          {Object.keys(project.details).map((key) => (
            <div key={key} className="mb-2">
              <label className="block font-medium">{key}</label>
              <input
                type="text"
                name={key}
                value={project.details[key as keyof typeof project.details]}
                onChange={handleDetailsChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={project.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium">Map Location</label>
          <input
            type="text"
            name="mapLocation"
            value={project.mapLocation}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          {loading ? 'Updating...' : 'Update Project'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProjectPage;
