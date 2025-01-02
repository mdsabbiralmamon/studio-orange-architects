'use client';

import React, { useState } from 'react';

const NewSitePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: '', // Added LinkedIn field
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [studioImages, setStudioImages] = useState<File[]>([]);
  const [navbarImages, setNavbarImages] = useState<{ [key: string]: File }>({});
  const [loading, setLoading] = useState(false);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setStudioImages(fileArray);
  };

  const handleNavbarImageChange = (section: string, file: File | null) => {
    if (file) {
      setNavbarImages((prevState) => ({
        ...prevState,
        [section]: file,
      }));
    }
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !description ||
      !contactNumber ||
      !email ||
      !mapLocation ||
      !logo ||
      studioImages.length === 0
    ) {
      return alert('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('contactNumber', contactNumber);
    formData.append('email', email);
    formData.append('mapLocation', mapLocation);

    // Append social links
    Object.entries(socialLinks).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append logo
    if (logo) {
      formData.append('logo', logo);
    }

    // Append studio images
    studioImages.forEach((file) => {
      formData.append('studioImages', file);
    });

    // Append navbar images
    Object.entries(navbarImages).forEach(([section, file]) => {
      formData.append(`${section}Image`, file);
    });

    setLoading(true);
    try {
      const res = await fetch('/api/manage-site/new', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Site created successfully!');
        window.location.href = '/admin/site-manager'; // Redirect to the site listing page
      } else {
        alert(data.message || 'Failed to create site.');
      }
    } catch (error) {
      console.error('Error creating site:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Create New Site</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-xl font-semibold text-gray-700">Site Name:</label>
          <input
            type="text"
            placeholder="Site Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700">Address:</label>
          <textarea
            placeholder="Add Address"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700">Contact Number:</label>
          <input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700">Map Location:</label>
          <input
            type="text"
            placeholder="Map Location"
            value={mapLocation}
            onChange={(e) => setMapLocation(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700">Social Links:</label>
          {Object.entries(socialLinks).map(([key, value]) => (
            <input
              key={key}
              type="url"
              name={key}
              placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
              value={value}
              onChange={handleSocialLinkChange}
              className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
          ))}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700">Logo:</label>
          <input
            type="file"
            onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700">Upload Studio Images(Must upload 2 Photos):</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageChange(e.target.files)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {studioImages.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">{studioImages.length} file(s) selected.</p>
          )}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700">Upload Navbar Images:</label>
          {['Studio', 'Work', 'Product', 'People', 'Journal', 'Contact'].map((section) => (
            <div key={section} className="mb-6">
              <label className="block text-lg font-medium text-gray-600">
                {`${section} Section Image:`}
              </label>
              <input
                type="file"
                onChange={(e) => handleNavbarImageChange(section, e.target.files ? e.target.files[0] : null)}
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {navbarImages[section] && (
                <p className="text-sm text-gray-500 mt-2">{`${section} image selected.`}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500"
        >
          {loading ? 'Creating...' : 'Create Site'}
        </button>
      </div>
    </div>
  );
};

export default NewSitePage;
