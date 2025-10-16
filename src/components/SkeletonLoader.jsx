import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  const SkeletonProduct = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow group animate-pulse">
      <div className="w-full aspect-[4/5] bg-gray-200"></div>
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonTable = () => (
    <div className="animate-pulse">
      <div className="space-y-3">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <SkeletonCard />;
      case 'product':
        return <SkeletonProduct />;
      case 'list':
        return <SkeletonList />;
      case 'table':
        return <SkeletonTable />;
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <div className={type === 'product' ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6' : ''}>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
