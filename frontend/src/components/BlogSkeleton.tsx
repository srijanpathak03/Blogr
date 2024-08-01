export const BlogCardSkeleton = () => {
    return (
      <div className="max-w-2xl mx-auto my-4 p-6 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
        <div className="flex items-center">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="ml-4">
            {/* Author name skeleton */}
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            {/* Date skeleton */}
            <div className="h-3 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
          </div>
        </div>
  
        <div className="mt-4">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          {/* Content skeleton */}
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
  
        {/* Read time skeleton */}
        <div className="mt-2">
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
  
        {/* Tags skeleton (uncomment if needed) */}
        {/* <div className="mt-4 flex flex-wrap">
          <div className="h-6 bg-gray-200 rounded-full w-16 mr-2 mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20 mr-2 mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14 mr-2 mb-2 animate-pulse"></div>
        </div> */}
      </div>
    );
  };