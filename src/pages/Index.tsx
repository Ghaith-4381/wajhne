import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import ClickableImage from "../components/ClickableImage";
import CountryStats from "../components/CountryStats";
import AdBanner from "../components/AdBanner";
import TopBannerAd from "../components/TopBannerAd";
import { fetchStats, registerClick, fetchImages, CountryStatsData } from "../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Globe, Users, Crown, Shield, Award, Flag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "../config/constants";
import { useClickStats } from "../hooks/useClickStats";
import SyncStatus from "../components/SyncStatus";

// دالة للتأكد من سلامة البيانات
const ensureSafeData = (data: any): CountryStatsData => {
  if (!data || typeof data !== 'object') {
    return {
      image1: { total: 0, countries: {} },
      image2: { total: 0, countries: {} }
    };
  }
  
  return {
    image1: {
      total: data.image1?.total || 0,
      countries: data.image1?.countries || {}
    },
    image2: {
      total: data.image2?.total || 0,
      countries: data.image2?.countries || {}
    }
  };
};

// المعلومات الأولية الآمنة للعرض أثناء التحميل
const initialClickData: CountryStatsData = {
  image1: { total: 0, countries: {} },
  image2: { total: 0, countries: {} }
};

// بيانات وهمية تستخدم في حالة عدم توفر الخادم
const fallbackData: CountryStatsData = {
  image1: {
    total: 1234,
    countries: { Syria: 500, Egypt: 300, "Saudi Arabia": 200, Germany: 150, Turkey: 84 }
  },
  image2: {
    total: 987,
    countries: { Syria: 400, Egypt: 250, "Saudi Arabia": 175, Germany: 100, Turkey: 62 }
  }
};

const Index = () => {
  const [userCountry, setUserCountry] = useState("Unknown");
  const [imagePaths, setImagePaths] = useState<{ image1: any; image2: any }>({ image1: null, image2: null });
  const [hasAd, setHasAd] = useState(false);
  
  // استخدام الهوك المحسن مع المزامنة اللحظية
  const {
    clickData,
    isLoading,
    useLocalData,
    handleImageClick,
    image1Percentage,
    image2Percentage,
    totalClicks,
    topCountry,
    pendingClicksCount,
    lastSyncTime,
    isOnline,
    forceSync
  } = useClickStats();

  useEffect(() => {
    // حدد الدولة تلقائياً من خلال IP
    axios.get("https://ipapi.co/json/")
      .then(res => {
        const countryName = res.data?.country_name;
        if (countryName) {
          setUserCountry(countryName);
        } else {
          setUserCountry("Unknown");
        }
      })
      .catch(err => {
        console.error("IP detection error:", err);
        setUserCountry("Unknown");
      });
  
    // تحميل الصور من Supabase
    fetchImages()
      .then(res => setImagePaths(res))
      .catch(err => console.error("Error loading images:", err));
  }, []);

  // دالة النقر المحسنة مع المزامنة
  const handleOptimizedImageClick = useCallback((imageNum: number) => {
    console.log("🚀 نقرة هجينة مع مزامنة فورية:", imageNum);
    handleImageClick(imageNum, userCountry);
  }, [handleImageClick, userCountry]);

  // حساب الدولة الرائدة بطريقة آمنة
  const leadingCountry = (() => {
    const allEntries = [
      ...Object.entries(clickData.image1?.countries || {}),
      ...Object.entries(clickData.image2?.countries || {})
    ];
    
    const countryTotals = allEntries.reduce((acc, [country, count]) => {
      const image1Count = clickData.image1?.countries?.[country] || 0;
      const image2Count = clickData.image2?.countries?.[country] || 0;
      const total = image1Count + image2Count;
      return total > acc.total ? { country, total } : acc;
    }, { country: "", total: 0 });
    
    return countryTotals.country;
  })();

  const getWinnerStatus = () => {
    if (image1Percentage > image2Percentage) return "left";
    if (image2Percentage > image1Percentage) return "right";
    return "tie";
  };

  const winnerStatus = getWinnerStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* مؤشر حالة المزامنة */}
      <SyncStatus 
        lastSyncTime={lastSyncTime}
        isOnline={isOnline}
        pendingClicksCount={pendingClicksCount}
        onForceSync={forceSync}
      />

      <div className="container mx-auto px-4 pt-4">
        <TopBannerAd onVisibilityChange={(visible) => setHasAd(visible)} />
        <AdBanner onVisibilityChange={(visible) => setHasAd(visible)} />
      </div>
      
      {/* Presidential Header */}
      <header className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12 text-center">
          <div className="flex justify-center items-center gap-6 mb-6">
            <Shield className="text-amber-400" size={48} />
            <h1 className="text-4xl md:text-6xl font-bold text-amber-100 tracking-wider">
              تحدي القادة العالمي
            </h1>
            <Award className="text-amber-400" size={48} />
          </div>
          <p className="text-xl md:text-2xl text-amber-200 font-semibold mb-4">
            صوت لقائدك المفضل في المعركة الرئاسية
          </p>
          <div className="flex justify-center items-center gap-2 text-amber-300">
            <Flag size={20} />
            <span className="text-lg font-medium">معركة الشرف والكرامة</span>
            <Flag size={20} />
          </div>
          {useLocalData && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-400/50 rounded-lg text-red-200">
              <Shield size={16} />
              <span className="font-medium">وضع العرض التوضيحي</span>
            </div>
          )}
          {pendingClicksCount > 0 && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-400/50 rounded-lg text-green-200">
              <span className="text-sm">⏳ {pendingClicksCount} نقرة في الانتظار</span>
            </div>
          )}
        </div>
      </header>
     
      <main className={`container mx-auto px-4 py-12 transition-all duration-500 ${hasAd ? 'mb-36' : 'mb-8'}`}>
        {/* Presidential Stats Dashboard */}
        <div className="mb-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl shadow-2xl border border-amber-600/30 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-900/50 to-amber-800/50 px-6 py-4 border-b border-amber-600/30">
            <h2 className="text-2xl font-bold text-amber-100 text-center flex items-center justify-center gap-3">
              <Crown className="text-amber-400" size={28} />
              لوحة المعركة الرئاسية
              <Crown className="text-amber-400" size={28} />
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Globe className="text-blue-400" size={24} />
                  <span className="text-slate-300 font-medium">إجمالي الأصوات</span>
                </div>
                <div className="text-3xl font-bold text-white">{totalClicks.toLocaleString()}</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flag className="text-green-400" size={24} />
                  <span className="text-slate-300 font-medium">دولتك</span>
                </div>
                <div className="text-2xl font-bold text-amber-300">{userCountry}</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="text-amber-400" size={24} />
                  <span className="text-slate-300 font-medium">الدولة المتصدرة</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">{leadingCountry || "غير محدد"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Presidential Battle Arena */}
        <div className="grid md:grid-cols-2 gap-12 relative">
          {/* Leader 1 */}
          <div className={`relative transition-all duration-700 ${winnerStatus === "left" ? "transform scale-105" : ""}`}>
            <div className={`bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl border-2 overflow-hidden transition-all duration-500 ${
              winnerStatus === "left" ? "border-amber-400 shadow-amber-400/30" : "border-slate-600"
            }`}>
              {winnerStatus === "left" && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2">
                    <Crown size={20} />
                    <span>القائد المتصدر</span>
                    <Crown size={20} />
                  </div>
                </div>
              )}
              
              <div className="bg-gradient-to-r from-amber-900/40 to-amber-800/40 p-4 border-b border-amber-600/30">
                <div className="text-center">
                  <div className="text-amber-200 text-sm mb-1 font-medium">إجمالي أصوات القائد</div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {isLoading && !useLocalData ? "..." : (clickData.image1?.total || 0).toLocaleString()}
                  </div>
                  <div className="text-xl font-bold text-amber-300">
                    {image1Percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {imagePaths.image1?.default && (
                <div className="p-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent rounded-xl"></div>
                    <ClickableImage
                      defaultSrc={`${API_BASE_URL}${imagePaths.image1.default}`}
                      pressedSrc={`${API_BASE_URL}${imagePaths.image1.pressed}`}
                      alt="القائد الأول"
                      onClick={() => handleOptimizedImageClick(1)}
                      className="w-full h-[500px] md:h-[600px] object-cover rounded-xl border-2 border-amber-600/50 shadow-2xl cursor-pointer transition-all duration-300 hover:border-amber-400 hover:shadow-amber-400/20"
                      soundSrc={imagePaths.image1?.sound ? `${API_BASE_URL}${imagePaths.image1.sound}` : undefined}
                      errorFallback={true}
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-amber-900/90 text-amber-100 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                        <Award size={16} />
                        <span>صوت للقائد</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 pt-0">
                <div className="w-full bg-slate-600 rounded-full h-4 overflow-hidden border border-slate-500">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${image1Percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VS Presidential Seal */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-black rounded-full w-24 h-24 flex items-center justify-center shadow-2xl border-4 border-amber-300">
                <div className="text-center">
                  <Shield className="mx-auto mb-1" size={20} />
                  <div className="font-black text-sm">VS</div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full animate-ping bg-amber-400/20"></div>
            </div>
          </div>

          {/* Leader 2 */}
          <div className={`relative transition-all duration-700 ${winnerStatus === "right" ? "transform scale-105" : ""}`}>
            <div className={`bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl border-2 overflow-hidden transition-all duration-500 ${
              winnerStatus === "right" ? "border-amber-400 shadow-amber-400/30" : "border-slate-600"
            }`}>
              {winnerStatus === "right" && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2">
                    <Crown size={20} />
                    <span>القائد المتصدر</span>
                    <Crown size={20} />
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-amber-900/40 to-amber-800/40 p-4 border-b border-amber-600/30">
                <div className="text-center">
                  <div className="text-amber-200 text-sm mb-1 font-medium">إجمالي أصوات القائد</div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {isLoading && !useLocalData ? "..." : (clickData.image2?.total || 0).toLocaleString()}
                  </div>
                  <div className="text-xl font-bold text-amber-300">
                    {image2Percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {imagePaths.image2?.default && (
                <div className="p-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent rounded-xl"></div>
                    <ClickableImage
                      defaultSrc={`${API_BASE_URL}${imagePaths.image2.default}`}
                      pressedSrc={`${API_BASE_URL}${imagePaths.image2.pressed}`}
                      alt="القائد الثاني"
                      onClick={() => handleOptimizedImageClick(2)}
                      className="w-full h-[500px] md:h-[600px] object-cover rounded-xl border-2 border-amber-600/50 shadow-2xl cursor-pointer transition-all duration-300 hover:border-amber-400 hover:shadow-amber-400/20"
                      soundSrc={imagePaths.image2?.sound ? `${API_BASE_URL}${imagePaths.image2.sound}` : undefined}
                      errorFallback={true}
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-amber-900/90 text-amber-100 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                        <Award size={16} />
                        <span>صوت للقائد</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 pt-0">
                <div className="w-full bg-slate-600 rounded-full h-4 overflow-hidden border border-slate-500">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${image2Percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Country Stats */}
      <div className="container mx-auto px-4 pb-8">
        <CountryStats data={clickData} userCountry={userCountry} />
      </div>

      {/* Presidential Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-amber-600/30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-300 mb-4">
              <div className="flex items-center gap-2">
                <Flag className="text-amber-400" size={20} />
                <span>دولتك: <span className="font-bold text-amber-300">{userCountry}</span></span>
              </div>
              <div className="hidden md:block w-2 h-2 bg-amber-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Crown className="text-amber-400" size={20} />
                <span>القائد المتصدر: <span className="font-bold text-amber-300">{leadingCountry}</span></span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-amber-200">
              <Shield size={18} />
              <span className="font-semibold text-lg">شارك في اختيار القائد العالمي</span>
              <Shield size={18} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
