import React, { useState } from 'react';
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from 'react-router-dom';
import { Appbar } from '../components/Appbar';

export const Publish = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'blog_images');

        const uploadResponse = await axios.post('https://api.cloudinary.com/v1_1/dt6ekj5b3/image/upload', formData);
        imageUrl = uploadResponse.data.secure_url;
      }

      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`,
        { title, content, imageUrl },
        {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        }
      );
      console.log('Blog published successfully:', response.data);
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error('Error publishing blog:', error);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-3xl w-full px-4 py-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Publish Your Blog Post</h1>
          <p className="text-gray-600">
            Share your thoughts and ideas with the world. Our simple publishing tool makes it easy to get your content online.
          </p>
          <form className="flex flex-col gap-4 w-full" onSubmit={handlePublish}>
            <div>
              <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog post title"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-left text-sm font-medium text-gray-700">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content"
                rows={8}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-left text-sm font-medium text-gray-700">Image</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
