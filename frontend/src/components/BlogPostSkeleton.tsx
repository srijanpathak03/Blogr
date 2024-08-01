
export const BlogPostSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Appbar placeholder */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Appbar content placeholder */}
          <div className="h-8 bg-gray-300 rounded w-32"></div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-auto">
              {/* Blog post content */}
              <div className="max-w-4xl mx-auto p-8">
                <div className="animate-pulse">
                  {/* Title */}
                  <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                  {/* Date */}
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                  </div>
                  
                  {/* Author section */}
                  <div className="flex items-center mt-8 pt-4 border-t border-gray-200">
                    {/* Avatar placeholder */}
                    <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-48"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};