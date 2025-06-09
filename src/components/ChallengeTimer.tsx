import { useState, useEffect } from 'react';
import { Clock, Trophy, Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface Challenge {
  id: number;
  title: string;
  isActive: boolean;
  hasEndTime: boolean;
  endTime?: string;
}

const ChallengeTimer = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const fetchActiveChallenge = async () => {
    try {
      const response = await fetch('/api/challenges/active');
      if (response.ok) {
        const data = await response.json();
        console.log('Active challenge data:', data);
        if (data.challenge && data.challenge.hasEndTime) {
          setChallenge(data.challenge);
        } else {
          setChallenge(null);
        }
      } else {
        console.warn('Failed to fetch active challenge, server response:', response.status);
        setChallenge(null);
      }
    } catch (error) {
      console.error('Error fetching active challenge:', error);
      setChallenge(null);
    }
  };

  const calculateTimeLeft = () => {
    if (!challenge || !challenge.hasEndTime || !challenge.endTime) {
      setTimeLeft(null);
      return;
    }

    const now = new Date().getTime();
    const endTime = new Date(challenge.endTime).getTime();
    const difference = endTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    } else {
      setTimeLeft(null);
      // التحدي انتهى، نحديث البيانات
      fetchActiveChallenge();
    }
  };

  useEffect(() => {
    console.log('ChallengeTimer component mounted, fetching active challenge...');
    fetchActiveChallenge();
  }, []);

  useEffect(() => {
    if (challenge && challenge.hasEndTime && challenge.endTime) {
      console.log('Setting up timer for challenge:', challenge);
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    } else {
      console.log('No timed challenge active, hiding timer');
      setTimeLeft(null);
    }
  }, [challenge]);

  // إذا لم يكن هناك تحدي نشط أو التحدي مفتوح (بدون وقت نهاية)، لا نعرض شيء
  if (!challenge || !challenge.hasEndTime || !timeLeft) {
    console.log('Timer not shown - Challenge:', challenge, 'TimeLeft:', timeLeft);
    return null;
  }

  console.log('Showing timer for challenge:', challenge.title);

  return (
    <Card className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 border-amber-600/50 mb-8">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="text-amber-400" size={24} />
            <h2 className="text-xl font-bold text-amber-100">
              {challenge.title}
            </h2>
            <Trophy className="text-amber-400" size={24} />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="text-amber-300" size={20} />
            <span className="text-amber-200 font-medium">الوقت المتبقي للتحدي</span>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-600/30">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-amber-300">أيام</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-600/30">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-amber-300">ساعات</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-600/30">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-amber-300">دقائق</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-600/30">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-amber-300">ثواني</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-amber-200">
            <Calendar size={16} />
            <span className="text-sm">
              ينتهي التحدي في: {new Date(challenge.endTime!).toLocaleString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeTimer;
