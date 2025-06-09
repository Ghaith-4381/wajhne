
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface AdBannerProps {
  onVisibilityChange?: (visible: boolean) => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ onVisibilityChange }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const loadActiveAds = () => {
      const savedAds = localStorage.getItem('site_ads');
      if (savedAds) {
        const allAds: Ad[] = JSON.parse(savedAds);
        const now = new Date();
        
        // Filter active ads that are within their date range
        const activeAds = allAds.filter(ad => {
          if (!ad.isActive) return false;
          
          // Handle ads without date fields (backwards compatibility)
          if (!ad.startDate || !ad.endDate) return true;
          
          const startDate = new Date(ad.startDate);
          const endDate = new Date(ad.endDate);
          
          return now >= startDate && now <= endDate;
        });

        setAds(activeAds);
        
        // Reset index if no ads or current index is out of bounds
        if (activeAds.length === 0 || currentAdIndex >= activeAds.length) {
          setCurrentAdIndex(0);
        }
      }
    };

    loadActiveAds();
    
    // Check for ad updates every minute
    const interval = setInterval(loadActiveAds, 60000);
    
    return () => clearInterval(interval);
  }, [currentAdIndex]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // تغيير الإعلان كل 5 ثوان

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  useEffect(() => {
    const hasActiveAd = ads.length > 0 && isVisible;
    onVisibilityChange?.(hasActiveAd);
  }, [ads.length, isVisible, onVisibilityChange]);

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
        
        <div className="text-xs text-blue-600 font-medium">
          إعلان
        </div>
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
