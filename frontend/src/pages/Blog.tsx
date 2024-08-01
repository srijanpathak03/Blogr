
import { useParams } from 'react-router-dom';
import { useBlog } from '../hooks';
import { BlogPost } from '../components/BlogPost';
import { BlogPostSkeleton } from '../components/BlogPostSkeleton';

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({ id: id || '' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400">
        <BlogPostSkeleton />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400">
        <BlogPostSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400">
      <BlogPost blog={blog} />
    </div>
  );
};
