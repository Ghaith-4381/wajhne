
import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, Clock } from "lucide-react";

interface SyncStatusProps {
  lastSyncTime: number;
  isOnline: boolean;
  pendingClicksCount: number;
  onForceSync?: () => void;
}

const SyncStatus = ({ lastSyncTime, isOnline, pendingClicksCount, onForceSync }: SyncStatusProps) => {
  const [timeSinceSync, setTimeSinceSync] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceSync(Math.floor((Date.now() - lastSyncTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSyncTime]);

  const getSyncStatusColor = () => {
    if (!isOnline) return "text-red-400";
    if (timeSinceSync < 3) return "text-green-400";
    if (timeSinceSync < 10) return "text-yellow-400";
    return "text-orange-400";
  };

  const getSyncStatusText = () => {
    if (!isOnline) return "غير متصل";
    if (timeSinceSync < 3) return "متزامن";
    return `آخر تحديث: ${timeSinceSync}ث`;
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-3 text-sm">
          {/* حالة الاتصال */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className={`${getSyncStatusColor()} animate-pulse`} size={16} />
            ) : (
              <WifiOff className="text-red-400" size={16} />
            )}
            <span className={getSyncStatusColor()}>
              {getSyncStatusText()}
            </span>
          </div>

          {/* النقرات المعلقة */}
          {pendingClicksCount > 0 && (
            <div className="flex items-center gap-1 text-blue-400">
              <Clock size={14} />
              <span className="text-xs">{pendingClicksCount}</span>
            </div>
          )}

          {/* زر التحديث اليدوي */}
          {onForceSync && (
            <button
              onClick={onForceSync}
              className="text-slate-300 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
              title="تحديث فوري"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncStatus;
