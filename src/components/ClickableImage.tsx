import { useState, useEffect, useRef } from "react";
import { useAntiClickBot } from "../hooks/useAntiClickBot";

interface ClickableImageProps {
  defaultSrc: string;
  pressedSrc?: string;
  alt: string;
  onClick: () => void;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
      audioRef.current = audioElement;
    }
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

  // نقرة فورية بدون أي تأخير
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // التحقق من صحة النقرة
    if (!validateClick(e)) {
      console.warn('Click blocked by anti-click-bot system');
      return;
    }

    // تشغيل الصوت فوراً
    playSound();
    
    // تنفيذ النقرة فوراً (أهم شيء!)
    onClick();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPressed(false);
    handleClick(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(false);
    handleClick(e);
  };

  return (
    <div
      className={`cursor-pointer relative clickable-image select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        transform: isPressed ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.05s ease"
      }}
    >
      <img
        src={isPressed && pressedSrc ? pressedSrc : defaultSrc}
        alt={alt}
        className="w-full h-full object-cover rounded-lg pointer-events-none"
        draggable={false}
        onError={(e) => {
          if ((e.target as HTMLImageElement).src === pressedSrc && errorFallback) {
            (e.target as HTMLImageElement).src = defaultSrc;
          }
        }}
        style={{
          touchAction: "manipulation",
          WebkitUserSelect: "none",
          userSelect: "none"
        }}
      />
    </div>
  );
};

export default ClickableImage;
