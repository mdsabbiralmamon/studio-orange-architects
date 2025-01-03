'use client';

// import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Media {
  _id: string;
  type: string;
  url: string;
  mimeType?: string;
  title?: string;
  alt?: string;
  createdAt: string;
}

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileAlt, setFileAlt] = useState<string>('');
  const [mediaFiles, setMediaFiles] = useState<Media[]>([]);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFileName, setEditFileName] = useState<string>('');
  const [editFileAlt, setEditFileAlt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [permanentFileUrl, setPermanentFileUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file to upload.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', fileName);
    formData.append('alt', fileAlt);

    setLoading(true);

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        fetchMediaFiles(); // Refresh the media list
        setPermanentFileUrl(result.media.url); // Save the permanent file URL
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingMedia) return;

    const formData = new FormData();
    formData.append('mediaId', editingMedia._id);
    if (editFile) formData.append('file', editFile);
    formData.append('title', editFileName);
    formData.append('alt', editFileAlt);

    setLoading(true);

    try {
      const response = await fetch('/api/media/upload', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        fetchMediaFiles();
        setEditingMedia(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error editing file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/media/delete?id=${mediaId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchMediaFiles();
      } else {
        alert('Failed to delete the file.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaFiles = async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      setMediaFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Upload and Manage Media</h1>

      {/* Upload Section */}
      <div className="upload-section p-6 bg-white rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-medium text-gray-700 mb-6">Upload New File</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter title"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Enter alt text"
              value={fileAlt}
              onChange={(e) => setFileAlt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 px-6 py-3 w-full bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {/* Recent Uploaded File Preview */}
      <h2 className="text-2xl font-thin text-gray-800">Preview</h2>
      <div className="recent-upload p-6 bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col md:flex-row items-center gap-6">
        <div className="preview w-full md:w-1/3 p-2 border border-gray-200 rounded-lg bg-gray-50 flex justify-center items-center">
          {file ? (
            file.type.startsWith('image') ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="rounded-lg object-cover"
              />
            ) : (
              <video
                width="150"
                height="150"
                controls
                className="rounded-lg"
              >
                <source src={URL.createObjectURL(file)} />
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V6a2 2 0 012-2h14a2 2 0 012 2v10.5M3 16.5a3.5 3.5 0 003.5 3.5h11a3.5 3.5 0 003.5-3.5M3 16.5h18m-9-8v4m0 0l-2-2m2 2l2-2"
                />
              </svg>
              <p className="text-sm">No file selected</p>
            </div>
          )}
        </div>
        <div className="details w-full md:w-2/3 text-center md:text-left">
          <p className="font-medium text-lg">
            <strong>Title:</strong> {fileName || 'Untitled'}
          </p>
          <p>
            <strong>Alt Text:</strong> {fileAlt || 'No alt text'}
          </p>
          {permanentFileUrl && (
            <div className="mt-4">
              <input
                type="text"
                value={permanentFileUrl}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(permanentFileUrl)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
              >
                Copy URL
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Media Files List */}
      <div className="media-files space-y-6">
        <h2 className="text-2xl font-thin text-gray-800">All Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaFiles.map((media) => (
            <div
              key={media._id}
              className="media-item flex flex-col p-4 bg-white rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="media-preview w-full h-48 flex justify-center items-center overflow-hidden rounded-md bg-gray-100">
                {media.type.startsWith('image') ? (
                  <img
                    src={media.url}
                    alt={media.alt || ''}
                    className="object-cover rounded-md"
                  />
                ) : (
                  <video
                    className="w-full h-full object-cover rounded-md"
                    controls
                  >
                    <source src={media.url} type={media.mimeType} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="media-details mt-4 flex-1 flex flex-col text-center">
                <h3 className="text-lg font-semibold text-gray-700 truncate">
                  {media.title || 'Untitled'}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {media.alt || 'No alt text'}
                </p>
              </div>

              <div className="media-actions mt-4 flex flex-col gap-2">
                {/* URL Copy Section */}
                <div className="flex flex-col md:flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={media.url}
                    readOnly
                    className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(media.url)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>

                {/* Edit and Delete Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setEditingMedia(media);
                      setShowModal(true);
                    }}
                    className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(media._id)}
                    className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Modal for Editing Media */}
      {showModal && editingMedia && (
        <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-white p-8 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-6">Edit Media</h2>
            <input
              type="file"
              onChange={(e) => setEditFile(e.target.files?.[0] || null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <input
              type="text"
              placeholder="Edit title"
              value={editFileName}
              onChange={(e) => setEditFileName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <input
              type="text"
              placeholder="Edit alt text"
              value={editFileAlt}
              onChange={(e) => setEditFileAlt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-6"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleEditSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-3 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
