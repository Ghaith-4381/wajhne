
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TopBannerAdData {
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

interface TopBannerAdProps {
  onVisibilityChange?: (visible: boolean) => void;
}

const TopBannerAd: React.FC<TopBannerAdProps> = ({ onVisibilityChange }) => {
  const [currentAd, setCurrentAd] = useState<TopBannerAdData | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const loadActiveAd = () => {
      const savedAds = localStorage.getItem('top_banner_ads');
      if (savedAds) {
        const allAds: TopBannerAdData[] = JSON.parse(savedAds);
        const now = new Date();
        
        // Filter active ads that are within their date range
        const activeAds = allAds.filter(ad => {
          if (!ad.isActive) return false;
          
          const startDate = new Date(ad.startDate);
          const endDate = new Date(ad.endDate);
          
          return now >= startDate && now <= endDate;
        });

        // Get the most recent active ad
        if (activeAds.length > 0) {
          const sortedAds = activeAds.sort((a, b) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          setCurrentAd(sortedAds[0]);
        } else {
          setCurrentAd(null);
        }
      }
    };

    loadActiveAd();
    
    // Check for ad updates every minute
    const interval = setInterval(loadActiveAd, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hasActiveAd = currentAd !== null && isVisible;
    onVisibilityChange?.(hasActiveAd);
  }, [currentAd, isVisible, onVisibilityChange]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentAd || !isVisible) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 border-2 border-amber-300 rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 z-10 text-amber-600 hover:text-amber-800 transition-colors bg-white rounded-full p-1 shadow-md"
      >
        <X size={18} />
      </button>
      
      <a
        href={currentAd.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-95 transition-opacity"
      >
        <div className="flex items-center gap-6 p-6">
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-24 h-16 object-cover rounded-lg border border-amber-200 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-amber-900 mb-2">
              {currentAd.title}
            </h3>
            {currentAd.description && (
              <p className="text-amber-700 text-base leading-relaxed">
                {currentAd.description}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold shadow-md">
              إعلان مميز
            </div>
            <div className="text-xs text-amber-600 font-medium">
              انقر للمزيد
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default TopBannerAd;