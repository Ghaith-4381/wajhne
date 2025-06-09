/*import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
}

interface AdBannerProps {
  onVisibilityChange?: (visible: boolean) => void;
}

const AdBanner = ({ onVisibilityChange }: AdBannerProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const savedAds = localStorage.getItem('site_ads');
    if (savedAds) {
      const allAds = JSON.parse(savedAds);
      const activeAds = allAds.filter((ad: Ad) => ad.isActive);
      setAds(activeAds);
      if (onVisibilityChange) {
        onVisibilityChange(activeAds.length > 0);
      }
    } else {
      if (onVisibilityChange) {
        onVisibilityChange(false);
      }
    }
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible && ads.length > 0);
    }
  }, [isVisible]);

  if (!isVisible || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>

      <a
        href={currentAd.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 hover:opacity-90 transition-opacity"
      >
        <img
          src={currentAd.imageUrl}
          alt={currentAd.title}
          className="w-16 h-12 object-cover rounded border"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-800 truncate">
            {currentAd.title}
          </h3>
          {currentAd.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {currentAd.description}
            </p>
          )}
        </div>

        <div className="text-xs text-blue-600 font-medium">إعلان</div>
      </a>

      {ads.length > 1 && (
        <div className="flex justify-center mt-3 gap-1">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAdIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
*/


import { useEffect, useState } from "react";
import { X } from "lucide-react";

const AdBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = document.getElementById("propeller-ad-container");
    if (container) {
      // ✅ الإعلان التجريبي (وهمي)
      const fakeAd = document.createElement("div");
      fakeAd.innerHTML = `
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
         <img src="/ad-placeholder.png" />

               alt="Ad Banner" 
               style="width: 100%; max-width: 728px; border-radius: 8px; box-shadow: 0 0 5px rgba(0,0,0,0.1);" />
        </a>
      `;
      container.appendChild(fakeAd);

      // ✅ لما تسجّل بـ PropellerAds، بدل هذا القسم:
      /*
      const script = document.createElement("script");
      script.src = "https://your-propellerads-script-url.js";
      script.async = true;
      container.appendChild(script);
      */

      return () => {
        container.removeChild(fakeAd);
        // container.removeChild(script); ← إذا استخدمت سكربت حقيقي
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>

      <div id="propeller-ad-container" className="w-full text-center" />
    </div>
  );
};

export default AdBanner;
