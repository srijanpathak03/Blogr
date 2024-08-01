import { Appbar } from '../components/Appbar';
import { BlogCard } from '../components/BlogCard';
import { BlogCardSkeleton } from '../components/BlogSkeleton';
import { useBlogs, Blog } from '../hooks';

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
                <Appbar />
                <div className="container mx-auto px-4 ">
                    <BlogCardSkeleton />
                    <BlogCardSkeleton />
                    <BlogCardSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
            <Appbar />
            <div className="container mx-auto px-4 pb-8">
                {blogs.map((blog: Blog) => (
                    <BlogCard
                        key={blog.id}
                        id={blog.id}
                        title={blog.title}
                        content={blog.content}
                        createdAt={blog.createdAt}
                        authorName={blog.authorName || "?"}
                        likesCount={blog.likesCount}
                        imageUrl={blog.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
};
