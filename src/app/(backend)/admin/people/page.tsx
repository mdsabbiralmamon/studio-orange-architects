'use client';

// import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Person {
  _id: string;
  name: string;
  role: string;
  image: string;
  category: string;
}

const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPeople = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/people?page=${page}`);
      const data = await res.json();
      setPeople(data.people || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (personId: string) => {
    if (!window.confirm("Are you sure you want to delete this person?")) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/people/delete?id=${personId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Person deleted successfully!");
        fetchPeople(currentPage); // Refresh the people list after deletion
      } else {
        alert(data.message || "Failed to delete person.");
      }
    } catch (error) {
      console.error("Error deleting person:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">People Directory</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => window.location.href = '/admin/people/new'}
      >
        Add New Person
      </button>

      {loading && <p>Loading...</p>}

      <div className="space-y-4">
        {people.map((person) => (
          <div
            key={person._id}
            className="flex items-center bg-white p-4 rounded-md shadow-lg"
          >
            {/* Person Image */}
            <img
              width={100}
              height={100}
              src={person.image}
              alt={person.name}
              className="w-24 h-24 object-cover rounded-md"
            />

            {/* Person Info */}
            <div className="flex-1 ml-4">
              <h2 className="text-xl font-bold">{person.name}</h2>
              <p className="text-gray-500">{person.role}</p>
              <p className="text-gray-500 text-sm">{person.category}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => window.location.href = `/admin/people/update/${person._id}`}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleDelete(person._id)}
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

export default PeoplePage;
