'use client';

import React, { useState, useEffect } from 'react';

interface Project {
  _id: string;
  title: string;
  category: string;
  cover: { url: string };
  images: { url: string }[];
}

const ProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?page=${page}`);
      const data = await res.json();
      setProjects(data.projects || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/delete?id=${projectId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects(currentPage); // Refetch projects after deletion
      } else {
        alert('Failed to delete project.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const getImageUrl = (url: string) => `http://localhost:3000${url}`;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Work & Products</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => window.location.href = '/admin/projects/new'}
      >
        Create New Project
      </button>

      {loading && <p>Loading...</p>}

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="flex items-center bg-white p-4 rounded-md shadow-lg"
          >
            {/* Cover Image */}
            <img
              src={getImageUrl(project.cover.url)}
              alt={project.title}
              className="w-24 h-24 object-cover rounded-md"
            />

            {/* Project Info */}
            <div className="flex-1 ml-4">
              <h2 className="text-xl font-thin">{project.title}</h2>
              <p className="text-gray-500">
                {project.images.length} {project.images.length === 1 ? 'Image' : 'Images'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => window.location.href = `/admin/projects/update/${project._id}`}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleDelete(project._id)}
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

export default ProjectPage;
