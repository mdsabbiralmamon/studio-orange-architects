'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface SiteInfo {
  _id: string;
  logo: string;
  name: string;
  description: string;
  link: string;
  studioImages: string[];
}

const SiteLinksPage = () => {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSiteInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/manage-site');
      const data = await res.json();

      if (data.success) {
        setSiteInfo(data.siteInfo);
      } else {
        setSiteInfo(null);
      }
    } catch (error) {
      console.error('Error fetching site information:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (siteId: string) => {
    if (!window.confirm('Are you sure you want to delete this site info?')) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/manage-site/delete?id=${siteId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert('Site info deleted successfully!');
        setSiteInfo(null); // Clear the state after deletion
      } else {
        alert(data.message || 'Failed to delete site info.');
      }
    } catch (error) {
      console.error('Error deleting site info:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteInfo();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Site Important Links</h1>
      <button
        className={`px-4 py-2 rounded-md ${
          siteInfo
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        onClick={() => window.location.href = '/admin/site-manager/new'}
        disabled={!!siteInfo} // Disable button if siteInfo exists
      >
        Add New Site Information
      </button>

      {loading && <p>Loading...</p>}

      {siteInfo ? (
        <div className="flex items-center bg-white p-4 rounded-md shadow-lg">
          {/* Site Image */}
          <Image
            src={siteInfo.logo}
            alt={siteInfo.name}
            className="w-24 h-24 object-cover rounded-md"
            width={96}
            height={96}
          />

          {/* Site Info */}
          <div className="flex-1 ml-4">
            <h2 className="text-xl font-bold">{siteInfo.name}</h2>
            <p>{siteInfo.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => window.location.href = `/admin/site-manager/update`}
            >
              Update
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => handleDelete(siteInfo._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p>No site information available.</p>
      )}
    </div>
  );
};

export default SiteLinksPage;
