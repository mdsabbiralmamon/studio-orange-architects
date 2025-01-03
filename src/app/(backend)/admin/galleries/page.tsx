'use client';

// import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Gallery {
  _id: string;
  images: string[];
  type: 'Office' | 'Normal';
}

const GalleryPage = () => {
  const [officeGallery, setOfficeGallery] = useState<Gallery[]>([]);
  const [normalGallery, setNormalGallery] = useState<Gallery[]>([]);
  const [currentOfficePage, setCurrentOfficePage] = useState(1);
  const [currentNormalPage, setCurrentNormalPage] = useState(1);
  const [totalOfficePages, setTotalOfficePages] = useState(1);
  const [totalNormalPages, setTotalNormalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch galleries
  const fetchGalleries = async (page: number, type: 'office' | 'general') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery/${type.toLowerCase()}?page=${page}`);
      const data = await res.json();
      if (type === 'office') {
        setOfficeGallery(data.galleries || []);
        setTotalOfficePages(data.totalPages || 1);
      } else {
        setNormalGallery(data.galleries || []);
        setTotalNormalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error(`Error fetching ${type} gallery:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'office' | 'general') => {
    if (!window.confirm(`Are you sure you want to delete this ${type} gallery image?`)) return;
  
    const url = `/api/gallery/${type.toLowerCase()}/manage?id=${id}`;
    // console.log('Request URL:', url); // Log the URL to ensure it's correct
  
    try {
      setLoading(true);
      const res = await fetch(url, {
        method: 'DELETE',
      });
  
      // console.log('Response:', res); // Log the response to debug
  
      const data = await res.json();
      if (data.success) {
        alert(`${type} gallery image deleted successfully!`);
        fetchGalleries(type === 'office' ? currentOfficePage : currentNormalPage, type);
      } else {
        alert(data.message || `Failed to delete ${type} gallery image.`);
      }
    } catch (error) {
      console.error(`Error deleting ${type} gallery image:`, error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchGalleries(currentOfficePage, 'office');
    fetchGalleries(currentNormalPage, 'general');
  }, [currentOfficePage, currentNormalPage]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Gallery Management</h1>
      
      {/* Buttons for adding new galleries */}
      <div className="space-x-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => window.location.href = '/admin/galleries/office/new'}
        >
          Add New Office Gallery Image
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={() => window.location.href = '/admin/galleries/general/new'}
        >
          Add New Normal Gallery Image
        </button>
      </div>

      {/* Office Gallery */}
      <div>
        <h2 className="text-2xl font-bold">Office Gallery</h2>
        {loading && <p>Loading...</p>}
        <div className="space-y-4">
          {officeGallery.map((gallery) => (
            <div key={gallery._id} className="flex items-center bg-white p-4 rounded-md shadow-lg">
              {/* Gallery Images */}
              <div className="flex space-x-4">
                {gallery.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Office Gallery ${idx + 1}`}
                    className="object-cover rounded-md"
                    width={80}
                    height={80}
                  />
                ))}
              </div>
              <div className="ml-auto flex space-x-2">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleDelete(gallery._id, 'office')}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentOfficePage}
          totalPages={totalOfficePages}
          onPageChange={setCurrentOfficePage}
        />
      </div>

      {/* Normal Gallery */}
      <div>
        <h2 className="text-2xl font-bold">Normal Gallery</h2>
        {loading && <p>Loading...</p>}
        <div className="space-y-4">
          {normalGallery.map((gallery) => (
            <div key={gallery._id} className="flex items-center bg-white p-4 rounded-md shadow-lg">
              {/* Gallery Images */}
              <div className="flex space-x-4">
                {gallery.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Normal Gallery ${idx + 1}`}
                    className="object-cover rounded-md"
                    width={80}
                    height={80}
                  />
                ))}
              </div>
              <div className="ml-auto flex space-x-2">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleDelete(gallery._id, 'general')}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentNormalPage}
          totalPages={totalNormalPages}
          onPageChange={setCurrentNormalPage}
        />
      </div>
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-center items-center space-x-4 mt-6">
    <button
      className="px-4 py-2 bg-gray-300 rounded-md"
      disabled={currentPage === 1}
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
    >
      Previous
    </button>
    <p>
      Page {currentPage} of {totalPages}
    </p>
    <button
      className="px-4 py-2 bg-gray-300 rounded-md"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
    >
      Next
    </button>
  </div>
);

export default GalleryPage;
