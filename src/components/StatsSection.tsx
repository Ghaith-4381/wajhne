
import { useState } from "react";
import CountryStats from "./CountryStats";
import { CountryStatsData } from "../services/api";
import { ChevronDown, Globe, Trophy } from "lucide-react";

interface StatsSectionProps {
  data: CountryStatsData;
  userCountry: string;
  topCountry: { country: string; clicks: number };
  totalClicks: number;
}

const StatsSection = ({ data, userCountry, topCountry, totalClicks }: StatsSectionProps) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="mt-6">
      <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden">
        <div 
          className="p-6 border-b border-purple-500/30 flex justify-between items-center cursor-pointer hover:bg-purple-800/20 transition-all duration-300"
          onClick={() => setShowStats(!showStats)}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-400 animate-pulse" size={24} />
              <h2 className="text-2xl font-bold text-white">إحصائيات الدول</h2>
            </div>
            <ChevronDown 
              className={`text-purple-300 transition-transform duration-300 ${showStats ? 'rotate-180' : ''}`} 
              size={24}
            />
            
            <div className="flex items-center gap-2 ml-6">
              <Globe className="text-blue-400" size={20} />
              <span className="text-blue-200 font-medium">
                إجمالي الأصوات: <span className="text-white font-bold">{totalClicks.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
        
        {!showStats && topCountry.country && (
          <div className="p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-b border-yellow-500/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-400" size={18} />
                <span className="font-medium text-yellow-200">الدولة المتصدرة:</span> 
                <span className="text-white font-bold">{topCountry.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-yellow-200">الأصوات:</span> 
                <span className="text-white font-bold">{topCountry.clicks.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
        
        {showStats && (
          <div className="animate-fade-in">
            <CountryStats 
              data={data} 
              userCountry={userCountry}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsSection;
