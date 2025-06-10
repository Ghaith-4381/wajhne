
import { useState, useEffect, useRef } from "react";
import { useAntiClickBot } from "../hooks/useAntiClickBot";

interface ClickableImageProps {
  defaultSrc: string;
  pressedSrc?: string;
  alt: string;
  onClick: (clickData?: { isTrusted: boolean; timestamp: number }) => void;
  className?: string;
  soundSrc?: string;
  errorFallback?: boolean;
}

const ClickableImage = ({
  defaultSrc,
  pressedSrc,
  alt,
  onClick,
  className = "",
  soundSrc,
  errorFallback = false
}: ClickableImageProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastClickTime = useRef(0);
  const { validateClick } = useAntiClickBot();

  useEffect(() => {
    if (soundSrc) {
      const audioElement = new Audio(soundSrc);
      audioElement.preload = "auto";
      audioElement.volume = 0.7;
      
      audioElement.addEventListener("error", () => {
        console.warn(`Sound file not found: ${soundSrc}`);
        setSoundError(true);
      });
      
      audioElement.addEventListener("canplaythrough", () => {
        setSoundError(false);
      });
      
      audioRef.current = audioElement;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [soundSrc]);

  const playSound = () => {
    if (audioRef.current && !soundError) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Error playing audio:", err);
        setSoundError(true);
      });
    }
  };

  const handlePress = () => {
    setIsPressed(true);
    playSound();
  };

  const handleRelease = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // منع النقرات السريعة جداً (أقل من 50ms)
    const now = Date.now();
    if (now - lastClickTime.current < 50) {
      return;
    }
    lastClickTime.current = now;
    
    // التحقق من صحة النقرة
    if (!validateClick(e)) {
      console.warn('Click blocked by anti-click-bot system');
      return;
    }

    // تشغيل الصوت فوراً
    playSound();
    
    // إرسال النقرة فوراً
    onClick({
      isTrusted: e.isTrusted,
      timestamp: now
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handlePress();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleRelease();
    handleClick(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handlePress();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleRelease();
    handleClick(e);
  };

  const getImageUrl = () => {
    const src = isPressed && pressedSrc ? pressedSrc : defaultSrc;
    return src;
  };

  const handleImageError = () => {
    setImageError(true);
    if (pressedSrc && isPressed && errorFallback) {
      // إذا فشلت الصورة المضغوطة، استخدم الصورة الافتراضية
      setIsPressed(false);
    }
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div
      className={`cursor-pointer relative clickable-image select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleRelease}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        transform: isPressed ? "scale(0.98)" : "scale(1)",
        transition: "transform 0.1s ease"
      }}
    >
      <img
        src={getImageUrl()}
        alt={alt}
        className="w-full h-full object-cover rounded-lg pointer-events-none"
        draggable={false}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          touchAction: "manipulation",
          WebkitUserSelect: "none",
          userSelect: "none"
        }}
      />
      
      {imageError && (
        <div className="absolute inset-0 bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-2">🖼️</div>
            <div>لم يتم العثور على الصورة</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClickableImage;
