"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-neutral-100 rounded-3xl flex items-center justify-center text-xs text-neutral-400 dark:bg-neutral-900">
        No Image Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative w-full aspect-square overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 rounded-3xl">
        <Image
          src={images[activeIndex]}
          alt="Active product image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover w-full h-full transform hover:scale-[1.03] transition-transform duration-300 ease-out"
          priority
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 select-none scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={img}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 ${
                activeIndex === idx
                  ? "border-primary scale-[0.98]"
                  : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
              }`}
            >
              <Image
                src={img}
                alt="Product thumbnail"
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
