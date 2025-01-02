'use client';

import React, { useState, useEffect } from 'react';

interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  linkedin: string; // Added LinkedIn
}

interface NavbarImage {
  image: string;
}

interface SiteInfo {
  name: string;
  description: string;
  contactNumber: string;
  email: string;
  mapLocation: string;
  social: SocialLinks;
  logo: string;
  studioImages: string[];
  navbarImages: Record<string, NavbarImage>;
}

const UpdateSitePage: React.FC = () => {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [formState, setFormState] = useState<Omit<SiteInfo, 'navbarImages'>>({
    name: '',
    description: '',
    contactNumber: '',
    email: '',
    mapLocation: '',
    social: { facebook: '', instagram: '', youtube: '', twitter: '', linkedin: '' }, // Added LinkedIn
    logo: '',
    studioImages: ['', ''],
  });
  const [navbarImages, setNavbarImages] = useState<Record<string, NavbarImage>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const res = await fetch('/api/manage-site');
        const data = await res.json();
        if (data.success && data.siteInfo) {
          setSiteInfo(data.siteInfo);
          setFormState({
            name: data.siteInfo.name,
            description: data.siteInfo.description,
            contactNumber: data.siteInfo.contactNumber,
            email: data.siteInfo.email,
            mapLocation: data.siteInfo.mapLocation,
            social: data.siteInfo.social,
            logo: data.siteInfo.logo,
            studioImages: data.siteInfo.studioImages.length === 2 ? data.siteInfo.studioImages : ['', ''],
          });
          setNavbarImages(data.siteInfo.navbarImages || {});
        }
      } catch (error) {
        console.error('Error fetching site info:', error);
      }
    };

    fetchSiteInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value,
      },
    }));
  };

  const handleNavbarImageChange = (section: string, value: string) => {
    setNavbarImages((prev) => ({
      ...prev,
      [section]: { image: value },
    }));
  };

  const handleStudioImageChange = (index: number, value: string) => {
    setFormState((prev) => {
      const updatedImages = [...prev.studioImages];
      updatedImages[index] = value;
      return { ...prev, studioImages: updatedImages };
    });
  };

  const handleSubmit = async () => {
    const { name, description, contactNumber, email, mapLocation } = formState;

    if (!name || !description || !contactNumber || !email || !mapLocation) {
      return alert('Please fill in all required fields.');
    }

    const payload = {
      ...formState,
      navbarImages,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/manage-site/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert('Site updated successfully!');
        window.location.href = '/admin/site-manager';
      } else {
        alert(data.message || 'Failed to update site.');
      }
    } catch (error) {
      console.error('Error updating site:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!siteInfo) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-semibold text-gray-900">Update Site</h1>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Site Name"
            value={formState.name}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Add Address"
            value={formState.description}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-lg font-medium text-gray-700 mb-2">
            Contact Number
          </label>
          <input
            id="contactNumber"
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formState.contactNumber}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formState.email}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="mapLocation" className="block text-lg font-medium text-gray-700 mb-2">
            Map Location
          </label>
          <input
            id="mapLocation"
            type="text"
            name="mapLocation"
            placeholder="Map Location"
            value={formState.mapLocation}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Social Links</label>
          {Object.keys(formState.social).map((key) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input
                type="url"
                name={key}
                placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
                value={formState.social[key as keyof SocialLinks]}
                onChange={handleSocialLinksChange}
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="logo" className="block text-lg font-medium text-gray-700 mb-2">
            Logo
          </label>
          <input
            id="logo"
            type="text"
            name="logo"
            placeholder="Logo Image URL"
            value={formState.logo}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Studio Images</label>
          {formState.studioImages.map((url, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Studio Image {index + 1}:</label>
              <input
                type="text"
                placeholder={`Studio Image ${index + 1} URL`}
                value={url}
                onChange={(e) => handleStudioImageChange(index, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Navbar Images</label>
          {Object.keys(navbarImages).map((section) => (
            <div key={section} className="my-4">
              <label className="block text-sm font-medium text-gray-600">{section}:</label>
              <input
                type="text"
                placeholder={`${section} Navbar Image URL`}
                value={navbarImages[section]?.image || ''}
                onChange={(e) => handleNavbarImageChange(section, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {loading ? 'Updating...' : 'Update Site'}
      </button>
    </div>
  );
};

export default UpdateSitePage;
