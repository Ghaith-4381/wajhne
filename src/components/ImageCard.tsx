
import ClickableImage from "./ClickableImage";

interface ImageCardProps {
  imageNumber: number;
  clickCount: number;
  percentage: number;
  onImageClick: () => void;
  isLoading: boolean;
  imageSrc: string;
  soundSrc: string;
  altText: string;
}

const ImageCard = ({ 
  imageNumber, 
  clickCount, 
  percentage, 
  onImageClick, 
  isLoading,
  imageSrc,
  soundSrc,
  altText
}: ImageCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <div className="text-5xl font-bold mb-4">
        {isLoading ? "..." : clickCount.toLocaleString()}
      </div>
      <ClickableImage 
        defaultSrc={imageSrc}
        alt={altText}
        onClick={onImageClick}
        className="w-full max-w-md h-auto aspect-square object-cover"
        soundSrc={soundSrc}
        errorFallback={true}
      />
      <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-green-500 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ImageCard;
