"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImageGallery({
  primaryImage,
  productName,
  galleryImages = [],
}: {
  primaryImage: string;
  productName: string;
  galleryImages?: string[];
}) {
  // Only include unique, valid images
  const allImages = Array.from(new Set([primaryImage, ...galleryImages].filter(Boolean)));
  const [selectedImage, setSelectedImage] = useState(allImages[0] || primaryImage);

  return (
    <div className="space-y-4">
      {/* MAIN SHOWCASE BOX */}
      <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[500px] rounded-[32px] bg-white border border-slate-200/90 shadow-xs flex items-center justify-center p-6 overflow-hidden group">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={selectedImage}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain scale-105 group-hover:scale-115 transition-transform duration-500"
            priority
          />
        </div>
      </div>

      {/* THUMBNAILS - ONLY RENDER IF THERE IS MORE THAN 1 GENUINE IMAGE */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3">
          {allImages.map((img, idx) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                aria-label={`View angle ${idx + 1} of ${productName}`}
                className={`relative w-20 h-20 rounded-2xl bg-white border p-1 overflow-hidden transition-all duration-150 ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-100 shadow-xs scale-105"
                    : "border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
