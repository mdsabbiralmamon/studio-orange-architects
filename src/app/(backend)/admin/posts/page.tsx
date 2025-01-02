'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Post {
  _id: string;
  title: string;
  cover: string;
  description: string[];
  topic: string;
}

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${page}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/posts/manage?id=${postId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Post deleted successfully!");
        fetchPosts(currentPage); // Refresh the posts list after deletion
      } else {
        alert(data.message || "Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Posts</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => window.location.href = '/admin/posts/new'}
      >
        Create New Post
      </button>

      {loading && <p>Loading...</p>}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="flex items-center bg-white p-4 rounded-md shadow-lg"
          >
            {/* Post Cover */}
            <Image
              src={post.cover}
              alt={post.title}
              width={100}
              height={100}
              className="w-24 h-24 object-cover rounded-md"
            />

            {/* Post Info */}
            <div className="flex-1 ml-4">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="text-gray-500">{post.topic}</p>
              <p className="text-gray-500 text-sm">
                {post.description.slice(0, 2).join(", ")}...
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleDelete(post._id)}
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

export default PostsPage;
