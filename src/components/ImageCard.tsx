
import ClickableImage from "./ClickableImage";
import UserScoreDisplay from "./UserScoreDisplay";
import { Globe, Users } from "lucide-react";

interface ImageCardProps {
  imageNumber: number;
  clickCount: number;
  percentage: number;
  onImageClick: () => void;
  isLoading: boolean;
  imageSrc: string;
  soundSrc: string;
  altText: string;
  userScore: number;
  pendingClicks: number;
}

const ImageCard = ({ 
  imageNumber, 
  clickCount, 
  percentage, 
  onImageClick, 
  isLoading,
  imageSrc,
  soundSrc,
  altText,
  userScore,
  pendingClicks
}: ImageCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center space-y-4">
      {/* السكور العام */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 shadow-lg border border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="text-blue-200" size={20} />
            <span className="text-blue-100 font-medium text-sm">إجمالي الأصوات</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="text-yellow-400" size={18} />
            <span className="text-white font-bold text-2xl">
              {isLoading ? "..." : clickCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* سكور المستخدم */}
      <UserScoreDisplay 
        userScore={userScore}
        imageNumber={imageNumber}
        pendingClicks={pendingClicks}
        className="w-full"
      />

      {/* الصورة القابلة للنقر */}
      <ClickableImage 
        defaultSrc={imageSrc}
        alt={altText}
        onClick={onImageClick}
        className="w-full max-w-md h-auto aspect-square object-cover"
        soundSrc={soundSrc}
        errorFallback={true}
      />

      {/* شريط التقدم */}
      <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ImageCard;
