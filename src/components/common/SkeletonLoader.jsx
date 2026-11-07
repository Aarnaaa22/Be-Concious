import React from 'react';

export const SkeletonBox = ({ className = '', style = {} }) => (
  <div 
    className={`skeleton-shimmer rounded-2xl ${className}`} 
    style={style}
    aria-hidden="true" 
  />
);

export const ProductAnalysisSkeleton = () => {
  return (
    <div className="space-y-8 animate-fadeIn" aria-busy="true" aria-label="Loading product nutritional analysis">
      {/* Top Banner Skeleton */}
      <div className="rounded-3xl bg-white border border-[#EFE4EB] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <SkeletonBox className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex-shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center gap-2">
              <SkeletonBox className="h-4 w-24 rounded-full" />
              <SkeletonBox className="h-4 w-16 rounded-full" />
            </div>
            <SkeletonBox className="h-8 w-3/4 rounded-xl" />
            <SkeletonBox className="h-4 w-1/2 rounded-lg" />
            <div className="flex gap-2 pt-2">
              <SkeletonBox className="h-10 w-28 rounded-2xl" />
              <SkeletonBox className="h-10 w-28 rounded-2xl" />
              <SkeletonBox className="h-10 w-28 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-[#EFE4EB] space-y-2">
            <div className="flex justify-between items-center">
              <SkeletonBox className="h-3 w-16 rounded-full" />
              <SkeletonBox className="w-6 h-6 rounded-lg" />
            </div>
            <SkeletonBox className="h-8 w-20 rounded-xl" />
            <SkeletonBox className="h-3 w-12 rounded-full" />
          </div>
        ))}
      </div>

      {/* Insights Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white border border-[#EFE4EB] p-6 space-y-3">
          <SkeletonBox className="h-4 w-32 rounded-full" />
          <SkeletonBox className="h-12 w-24 rounded-2xl" />
          <SkeletonBox className="h-3 w-full rounded-lg" />
        </div>
        <div className="rounded-3xl bg-white border border-[#EFE4EB] p-6 space-y-3">
          <SkeletonBox className="h-4 w-32 rounded-full" />
          <SkeletonBox className="h-12 w-24 rounded-2xl" />
          <SkeletonBox className="h-3 w-full rounded-lg" />
        </div>
        <div className="rounded-3xl bg-white border border-[#EFE4EB] p-6 space-y-3">
          <SkeletonBox className="h-4 w-32 rounded-full" />
          <SkeletonBox className="h-12 w-24 rounded-2xl" />
          <SkeletonBox className="h-3 w-full rounded-lg" />
        </div>
      </div>

      {/* Nutrition Breakdown Skeleton */}
      <div className="rounded-3xl bg-white border border-[#EFE4EB] p-6 sm:p-8 space-y-4">
        <SkeletonBox className="h-6 w-48 rounded-xl" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-[#EFE4EB]/60">
              <SkeletonBox className="h-4 w-28 rounded-lg" />
              <SkeletonBox className="h-3 flex-1 max-w-xs rounded-full" />
              <SkeletonBox className="h-4 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="paper-card rounded-3xl p-6 space-y-4 animate-fadeIn" aria-hidden="true">
      <SkeletonBox className="w-full aspect-square rounded-2xl" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-3 w-20 rounded-full" />
          <SkeletonBox className="h-3 w-14 rounded-full" />
        </div>
        <SkeletonBox className="h-5 w-4/5 rounded-xl" />
        <SkeletonBox className="h-3 w-3/5 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-2 py-2">
        <SkeletonBox className="h-10 rounded-xl" />
        <SkeletonBox className="h-10 rounded-xl" />
        <SkeletonBox className="h-10 rounded-xl" />
      </div>
      <div className="pt-2 border-t border-[#EFE4EB] flex gap-2">
        <SkeletonBox className="h-9 w-20 rounded-xl" />
        <SkeletonBox className="h-9 flex-1 rounded-xl" />
      </div>
    </div>
  );
};

