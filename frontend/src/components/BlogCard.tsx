import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Avatar } from './Avatar';
import { FaFire, FaComment, FaShareAlt, FaImage } from 'react-icons/fa';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { format } from 'date-fns';

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  likesCount: number;
  imageUrl?: string;
}

export const BlogCard = ({ id, title, content, authorName, createdAt, likesCount: initialLikesCount, imageUrl }: BlogCardProps) => {
  const [likes, setLikes] = useState(initialLikesCount);
  const [liked, setLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog/like`,
        { postId: id },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setLikes(response.data.likes);
      setLiked(true);
    } catch (error) {
      console.error('Failed to like the post: ', error);
    }
  };

  const handleUnlike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog/unlike`,
        { postId: id },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setLikes(response.data.likes);
      setLiked(false);
    } catch (error) {
      console.error('Failed to unlike the post: ', error);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = `${window.location.origin}/blog/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Blog link copied to clipboard!');
    }).catch((error) => {
      console.error('Failed to copy text: ', error);
    });
  };

  return (
    <Link to={`/blog/${id}`} className="max-w-2xl mx-auto my-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row cursor-pointer">
      <div className="flex-grow">
        <div className="flex items-center">
          <Avatar name={authorName} size="small" />
          <div className="ml-4">
            <p className="text-sm font-semibold text-gray-700">{authorName} • {format(new Date(createdAt), 'MMMM d, yyyy h:mm a')}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-gray-600">{content.slice(0, 100) + "..."}</p>
        </div>
        
        <div className="mt-2 text-gray-500 text-sm font-thin">
          {`${Math.ceil(content.length / 400)} minute(s) read`}
        </div>
        
        <div className="mt-4 flex space-x-3 text-gray-500">
          <button 
            className={`hover:text-yellow-600 flex items-center space-x-1 ${liked ? 'fancy-glow-animation' : ''}`} 
            onClick={liked ? handleUnlike : handleLike}>
            <FaFire />
            <span>{likes}</span>
          </button>
          <button className="hover:text-blue-600" onClick={(e) => e.stopPropagation()}>
            <FaComment />
          </button>
          <button className="hover:text-green-600" onClick={handleShare}>
            <FaShareAlt />
          </button>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 w-full sm:w-40 h-40 flex items-center justify-center bg-gray-100 rounded-md">
        {imageUrl ? (
          <img
            className="w-full h-full object-cover rounded-md"
            src={imageUrl}
            alt={title}
          />
        ) : (
          <FaImage className="text-5xl text-gray-400" />
        )}
      </div>
    </Link>
  );
};
