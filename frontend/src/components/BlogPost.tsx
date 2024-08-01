import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { Blog } from '../hooks'; // custom hook to fetch blog data
import { Appbar } from './Appbar';
import { format } from 'date-fns';
import axios from 'axios';
import { BACKEND_URL } from '../config'; // adjust the import as necessary

export const BlogPost = ({ blog }: { blog: Blog }) => {
  const authorName = blog.author?.name || '?';
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(blog.comments || []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog/comments`, {
        postId: blog.id,
        content: newComment,
      },{
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      const newCommentData = response.data;
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('An error occurred while posting your comment. Please try again.');
    }
  };

  return (
    <div>
      <Appbar />
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <header className="mb-8 border-b pb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 break-words">
              {blog.title}
            </h1>
            {blog.imageUrl && (
              <img
                className="w-full h-100 object-cover rounded-lg mt-4"
                src={blog.imageUrl}
                alt={blog.title}
              />
            )}
            <p className="text-gray-600 mt-2">
              Posted on {format(new Date(blog.createdAt), 'MMMM d, yyyy h:mm a')}
            </p>
          </header>
          <section className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {blog.content}
            </p>
          </section>
          
          <footer className="flex items-center mt-8 pt-4 border-t">
            <Avatar name={authorName} size="large" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Author</p>
              <p className="text-lg font-medium text-gray-800">{authorName}</p>
              <p className="text-sm text-gray-600">This is the author bio</p>
            </div>
          </footer>
          
          <div className="border-t border-gray-200 my-8"></div>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Post Comment
              </button>
            </form>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-4 p-4 bg-gray-100 rounded">
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    By {comment.author.name} on {format(new Date(comment.createdAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No comments yet.</p>
            )}
          </section>
        </article>
      </div>
    </div>
  );
};
