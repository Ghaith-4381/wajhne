import { User, Trophy } from "lucide-react";

interface UserScoreDisplayProps {
  userScore: number;
  imageNumber: number;
  pendingClicks: number;
  className?: string;
}

const UserScoreDisplay = ({ 
  userScore, 
  imageNumber, 
  pendingClicks,
  className = "" 
}: UserScoreDisplayProps) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <User className="text-amber-400" size={16} />
        <span className="text-amber-200 text-sm font-medium">مشاركتك</span>
        <Trophy className="text-amber-400" size={16} />
      </div>
      <div className="text-2xl font-bold text-white">
        {userScore.toLocaleString()}
      </div>
    </div>
  );
};

export default UserScoreDisplay;
