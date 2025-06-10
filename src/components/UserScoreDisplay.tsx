
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
    <div className={`bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-3 shadow-lg border border-emerald-500/30 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="text-emerald-200" size={20} />
          <span className="text-emerald-100 font-medium text-sm">مشاركتك</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={18} />
          <span className="text-white font-bold text-lg">{userScore.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default UserScoreDisplay;