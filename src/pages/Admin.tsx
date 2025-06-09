import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Upload, Download, Save, Trash2, Play, Pause, RotateCcw, Plus, Edit, Eye, Activity, Users, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AdManagement from "@/components/admin/AdManagement";
import TopBannerAdManagement from "@/components/admin/TopBannerAdManagement";
import AntiClickBotManagement from "../components/admin/AntiClickBotManagement";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ENDPOINTS } from '../config/constants';

// النوع الخاص بإحصائيات التحدي
interface ChallengeStats {
  image1: {
    total: number;
    countries: Record<string, number>;
  };
  image2: {
    total: number;
    countries: Record<string, number>;
  };
}

// النوع الخاص بتحديات سابقة
interface PastChallenge {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  image1Url: string;
  image2Url: string;
  totalClicks: number;
  winner: 1 | 2;
}

// النوع الخاص بإحصائيات الزوار
interface VisitorStats {
  total: number;
  unique: number;
  today: number;
  lastWeek: number;
}

const Admin = () => {
  const [secretKey, setSecretKey] = useState<string>(""); // ✅ تم النقل الصحيح
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [password3, setPassword3] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [adminId, setAdminId] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [image1File, setImage1File] = useState<File | null>(null);
  const [image2File, setImage2File] = useState<File | null>(null);
  const [image1PressedFile, setImage1PressedFile] = useState<File | null>(null);
  const [image2PressedFile, setImage2PressedFile] = useState<File | null>(null);
  const [image1Preview, setImage1Preview] = useState<string>("");
  const [image2Preview, setImage2Preview] = useState<string>("");
  const [image1PressedPreview, setImage1PressedPreview] = useState<string>("");
  const [image2PressedPreview, setImage2PressedPreview] = useState<string>("");
  const [sound1File, setSound1File] = useState<File | null>(null);
  const [sound2File, setSound2File] = useState<File | null>(null);
  const [statsData, setStatsData] = useState<ChallengeStats | null>(null);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    total: 0,
    unique: 0,
    today: 0,
    lastWeek: 0
  });
  const [pastChallenges, setPastChallenges] = useState<PastChallenge[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{id: number; url: string; type: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [adUrl, setAdUrl] = useState("");
  const [adEnabled, setAdEnabled] = useState(true); // أو false حسب القيمة الافتراضية
  const [activeTab, setActiveTab] = useState("overview");
  const handleSaveAd = () => {
    const adData = {
      url: adUrl,
      enabled: adEnabled,
    };
    localStorage.setItem("customAd", JSON.stringify(adData));
    alert("تم حفظ الإعلان بنجاح ✅");
  };
  
  
  // إضافة تأثير للتحقق من جلسة المستخدم
  useEffect(() => {
    // التحقق من وجود معلومات المصادقة في localStorage
    const authInfo = localStorage.getItem('admin_auth');
    if (authInfo) {
      try {
        const parsedAuthInfo = JSON.parse(authInfo);
        if (parsedAuthInfo.isAuthenticated) {
          setIsAuthenticated(true);
          fetchDashboardData();
        }
      } catch (error) {
        console.error("Error parsing auth info:", error);
      }
    }
  }, []);

  // دالة لجلب بيانات لوحة القيادة
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // محاولة جلب الإحصائيات الحالية
      try {
        const statsResponse = await axios.get(`${API_BASE_URL}${ENDPOINTS.GET_STATS}`);
        if (statsResponse.data) {
          setStatsData(statsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // استخدام بيانات افتراضية في حال فشل الاتصال بالخادم
        setStatsData({
          image1: {
            total: 62184039,
            countries: {
              "Syria": 6000066,
              "Egypt": 4517368,
              "Saudi Arabia": 3521493,
              "Turkey": 2845912,
              "Indonesia": 2215784
            }
          },
          image2: {
            total: 41907521,
            countries: {
              "Egypt": 6059965,
              "Syria": 4626164,
              "Saudi Arabia": 3215874,
              "Indonesia": 2845127,
              "Turkey": 1954872
            }
          }
        });
      }

      // جلب إحصائيات الزوار (افتراضية حاليًا)
      setVisitorStats({
        total: 512489,
        unique: 132874,
        today: 5472,
        lastWeek: 32541
      });

      // جلب التحديات السابقة (افتراضية حاليًا)
      setPastChallenges([
        {
          id: 1,
          title: "قط أم كلب؟",
          startDate: "2025-01-01",
          endDate: "2025-01-31",
          image1Url: "/lovable-uploads/ac4366c6-5d46-4197-be93-db22576b6b2a.png",
          image2Url: "/lovable-uploads/ac4366c6-5d46-4197-be93-db22576b6b2a.png", 
          totalClicks: 89724563,
          winner: 1
        },
        {
          id: 2,
          title: "صيف أم شتاء؟",
          startDate: "2025-02-01",
          endDate: "2025-02-28",
          image1Url: "/lovable-uploads/ac4366c6-5d46-4197-be93-db22576b6b2a.png",
          image2Url: "/lovable-uploads/ac4366c6-5d46-4197-be93-db22576b6b2a.png",
          totalClicks: 74521698,
          winner: 2
        }
      ]);

      // جلب الصور المرفوعة سابقًا (افتراضية حاليًا)
      setUploadedImages([
        { id: 1, url: "/lovable-uploads/ac4366c6-5d46-4197-be93-db22576b6b2a.png", type: "standard" },
        { id: 2, url: "/lovable-uploads/ac4366c6-5d46-4197-be93-db22576b6b2a.png", type: "standard" },
        { id: 3, url: "/lovable-uploads/ac4366c6-5d46-4197-be93-db22576b6b2a.png", type: "pressed" },
        { id: 4, url: "/lovable-uploads/ac4366c6-5d46-4197-be93-db22576b6b2a.png", type: "pressed" }
      ]);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

   // تحديث دالة تسجيل الدخول لتخزين المعلومات في localStorage
   const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin-4Bxr7Xt89/login`, {
        username,
        password1,
        password2,
        password3
      });
  
      if (response.data.requireOtp) {
        setAdminId(response.data.adminId);
        setAwaitingOtp(true);
        toast({
          title: "تم إرسال رمز التحقق",
          description: "تحقق من بريدك الإلكتروني وأدخل الرمز لإكمال تسجيل الدخول",
        });
      } else if (response.data.success) {
        setIsAuthenticated(true);
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
  };
  

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin-4Bxr7Xt89/verify-otp`, {
        adminId,
        otpCode
      });
  
      if (response.data.success) {
        toast({
          title: "تم التحقق بنجاح",
          description: "مرحبًا بك!",
        });
        setIsAuthenticated(true);
      } else {
        toast({
          title: "خطأ في الرمز",
          description: response.data.message || "رمز التحقق غير صحيح",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "فشل التحقق",
        description: error.response?.data?.message || "حدث خطأ",
        variant: "destructive",
      });
    }
  };
  
    // تحديث دالة تسجيل الخروج لحذف المعلومات من localStorage
    const handleLogout = () => {
      setIsAuthenticated(false);
      setAdminId(null);
      setAwaitingOtp(false);
      setOtpCode("");
      setUsername("");
      setPassword1("");
      setPassword2("");
      setPassword3("");
      localStorage.removeItem('admin_auth');
      setIsAuthenticated(false);
    };
  
    // دالة لتحديث البيانات يدويًا
    const handleRefreshData = () => {
      fetchDashboardData();
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث إحصائيات لوحة التحكم بنجاح",
      });
    };

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${API_BASE_URL}/api/admin-4Bxr7Xt89/register`, {
          username,
          password1,
          password2,
          password3,
          fullName,
          email,
          secretKey: 'MySuperSecretKey2024' // أضف هذا المفتاح السري فقط عند التسجيل
        });
    
        if (response.data.success) {
          toast({
            title: "تم إنشاء الحساب",
            description: "تم إنشاء حساب المشرف بنجاح",
          });
          setIsRegistering(false);
        } else {
          toast({
            title: "فشل التسجيل",
            description: response.data.message || "حدث خطأ غير متوقع",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "فشل التسجيل",
          description: error?.response?.data?.message || "حدث خطأ في السيرفر",
          variant: "destructive",
        });
      }
    };
    

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من امتدادات الصور المسموحة
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "يرجى اختيار صورة بامتداد JPG، PNG، GIF، أو WEBP",
        variant: "destructive",
      });
      return;
    }

    // إنشاء معاينة للصورة
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      switch (imageType) {
        case 'image1':
          setImage1File(file);
          setImage1Preview(result);
          break;
        case 'image2':
          setImage2File(file);
          setImage2Preview(result);
          break;
        case 'image1Pressed':
          setImage1PressedFile(file);
          setImage1PressedPreview(result);
          break;
        case 'image2Pressed':
          setImage2PressedFile(file);
          setImage2PressedPreview(result);
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSoundChange = (e: React.ChangeEvent<HTMLInputElement>, soundNumber: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من امتدادات الصوت المسموحة
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "نوع ملف صوت غير مدعوم",
        description: "يرجى اختيار ملف صوت بامتداد MP3، WAV، أو OGG",
        variant: "destructive",
      });
      return;
    }

    if (soundNumber === 1) {
      setSound1File(file);
    } else {
      setSound2File(file);
    }
  };

  const handleImageUpload = async (imageType: string) => {
    let file;
    let imageId;
    let isPressedVariant = false;
  
    switch (imageType) {
      case 'image1':
        file = image1File;
        imageId = 1;
        break;
      case 'image2':
        file = image2File;
        imageId = 2;
        break;
      case 'image1Pressed':
        file = image1PressedFile;
        imageId = 1;
        isPressedVariant = true;
        break;
      case 'image2Pressed':
        file = image2PressedFile;
        imageId = 2;
        isPressedVariant = true;
        break;
      default:
        file = null;
    }
  
    if (!file) {
      toast({
        title: "لم يتم اختيار صورة",
        description: "يرجى اختيار صورة أولاً",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('isPressedVariant', String(isPressedVariant));
  
      const response = await axios.post(`${API_BASE_URL}/api/upload-image/${imageId}`, formData);
  
      if (response.data.success) {
        toast({
          title: "تم رفع الصورة بنجاح",
          description: response.data.message,
        });
      } else {
        toast({
          title: "خطأ في رفع الصورة",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };
  

  const handleSoundUpload = async (soundNumber: number) => {
    const file = soundNumber === 1 ? sound1File : sound2File;
    
    if (!file) {
      toast({
        title: "لم يتم اختيار ملف صوت",
        description: "يرجى اختيار ملف صوت أولاً",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('sound', file);
      
      const response = await axios.post(`${API_BASE_URL}/api/upload-sound/${soundNumber}`, formData);
      
      if (response.data.success) {
        toast({
          title: "تم رفع الصوت بنجاح",
          description: response.data.message,
        });
      } else {
        toast({
          title: "خطأ في رفع الصوت",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading sound:', error);
      toast({
        title: "خطأ في رفع الصوت",
        description: "حدث خطأ أثناء رفع الصوت. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };
  
   // تنسيق الرقم بفواصل للأرقام الكبيرة
   const formatNumber = (num: number): string => {
     return num.toLocaleString();
   };
 
   // دالة لحساب إجمالي عدد النقرات للصورة الأولى والثانية
   const calculateTotalClicks = (): number => {
     if (!statsData) return 0;
     return statsData.image1.total + statsData.image2.total;
   };
 
   // دالة لحساب النسبة المئوية
   const calculatePercentage = (part: number, total: number): string => {
    if (total === 0) return "0";
     return ((part / total) * 100).toFixed(1);
   };

   if (!isAuthenticated) {
    if (awaitingOtp) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>التحقق من الرمز</CardTitle>
              <CardDescription>أدخل رمز التحقق الذي تم إرساله إلى بريدك الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">رمز التحقق</label>
                  <Input
                    id="otp"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">تحقق</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isRegistering ? "إنشاء حساب مشرف جديد" : "تسجيل دخول المشرف"}</CardTitle>
            <CardDescription>
              {isRegistering
                ? "قم بإنشاء حساب مشرف جديد للوحة التحكم"
                : "قم بتسجيل الدخول لإدارة تحدي النقر"}
            </CardDescription>
          </CardHeader>
          {/* زر إدارة الإعلانات */}
            <div className="flex justify-end px-6 mt-[-1rem] mb-4">
              <Link to="/admin-4Bxr7Xt89-secure/ads">
                <Button variant="outline">إدارة الإعلانات</Button>
              </Link>
            </div>

          <CardContent>
  {isRegistering ? (
    <form onSubmit={handleRegister} className="space-y-4">
  <div className="space-y-2">
    <label htmlFor="username" className="text-sm font-medium">اسم المستخدم</label>
    <Input
      id="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
  </div>
  <div className="space-y-2">
    <label htmlFor="fullName" className="text-sm font-medium">الاسم الكامل</label>
    <Input
      id="fullName"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      required
    />
  </div>
  <div className="space-y-2">
    <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
    <Input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>
  <div className="space-y-2">
    <label htmlFor="password1" className="text-sm font-medium">كلمة المرور الأولى</label>
    <Input
      id="password1"
      type="password"
      value={password1}
      onChange={(e) => setPassword1(e.target.value)}
      required
    />
  </div>
  <div className="space-y-2">
    <label htmlFor="password2" className="text-sm font-medium">كلمة المرور الثانية</label>
    <Input
      id="password2"
      type="password"
      value={password2}
      onChange={(e) => setPassword2(e.target.value)}
      required
    />
  </div>
  <div className="space-y-2">
    <label htmlFor="password3" className="text-sm font-medium">كلمة المرور الثالثة</label>
    <Input
      id="password3"
      type="password"
      value={password3}
      onChange={(e) => setPassword3(e.target.value)}
      required
    />
  </div>
  <div className="space-y-2">
    <label htmlFor="confirmPassword" className="text-sm font-medium">تأكيد كلمة المرور الأولى</label>
    <Input
      id="confirmPassword"
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
  </div>
  <div className="space-y-2">
    <label htmlFor="secretKey" className="text-sm font-medium">المفتاح السري</label>
    <Input
      id="secretKey"
      type="text"
      value={secretKey}
      onChange={(e) => setSecretKey(e.target.value)}
      required
    />
  </div>
  <div className="flex gap-2">
    <Button type="submit" className="flex-1">إنشاء حساب</Button>
    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsRegistering(false)}>
      العودة لتسجيل الدخول
    </Button>
  </div>
</form>

  ) : (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">اسم المستخدم</label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password1" className="text-sm font-medium">كلمة المرور الأولى</label>
        <Input
          id="password1"
          type="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password2" className="text-sm font-medium">كلمة المرور الثانية</label>
        <Input
          id="password2"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password3" className="text-sm font-medium">كلمة المرور الثالثة</label>
        <Input
          id="password3"
          type="password"
          value={password3}
          onChange={(e) => setPassword3(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">تسجيل الدخول</Button>
        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsRegistering(true)}>
          إنشاء حساب جديد
        </Button>
      </div>
    </form>
  )}
</CardContent>

        </Card>
      </div>
    );
  }
  
  
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="py-4 bg-white shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
              className="flex items-center gap-1"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'جاري التحديث...' : 'تحديث البيانات'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
     
        {/* نظرة عامة على الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Activity className="h-10 w-10 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي النقرات</p>
                  <h3 className="text-2xl font-bold">{formatNumber(calculateTotalClicks())}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Users className="h-10 w-10 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الزوار</p>
                  <h3 className="text-2xl font-bold">{formatNumber(visitorStats.total)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Users className="h-10 w-10 text-violet-500" />
                <div>
                  <p className="text-sm text-muted-foreground">زوار اليوم</p>
                  <h3 className="text-2xl font-bold">{formatNumber(visitorStats.today)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Users className="h-10 w-10 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">زوار الأسبوع</p>
                  <h3 className="text-2xl font-bold">{formatNumber(visitorStats.lastWeek)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="challenges">التحديات</TabsTrigger>
            <TabsTrigger value="files">الملفات</TabsTrigger>
            <TabsTrigger value="bans">إدارة الحظر</TabsTrigger>
            <TabsTrigger value="ads">الإعلانات</TabsTrigger>
            <TabsTrigger value="top-banner">البانر العلوي</TabsTrigger>
            <TabsTrigger value="sounds">الأصوات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            <TabsTrigger value="anti-bot">مكافحة البوتات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ads">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">إدارة الإعلانات</h2>
              </div>
              
              <Tabs defaultValue="regular-ads" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="regular-ads">الإعلانات العادية</TabsTrigger>
                  <TabsTrigger value="banner-ads">إعلانات البانر العلوي</TabsTrigger>
                </TabsList>
                
                <TabsContent value="regular-ads">
                  <AdManagement />
                </TabsContent>
                
                <TabsContent value="banner-ads">
                  <TopBannerAdManagement />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="anti-bot">
            <AntiClickBotManagement />
          </TabsContent>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات التحدي الحالي</CardTitle>
                <CardDescription>
                  معلومات تفصيلية عن التحدي الجاري
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg border">
                      <div className="text-xl font-semibold flex items-center justify-between">
                        <span>الصورة 1</span> 
                        <span className="text-sm font-normal text-gray-500">
                          ({calculatePercentage(statsData?.image1.total || 0, calculateTotalClicks())}%)
                        </span>
                      </div>
                      <div className="text-3xl font-bold mt-2">{formatNumber(statsData?.image1.total || 0)}</div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{
                              width: `${calculatePercentage(statsData?.image1.total || 0, calculateTotalClicks())}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border">
                      <div className="text-xl font-semibold flex items-center justify-between">
                        <span>الصورة 2</span>
                        <span className="text-sm font-normal text-gray-500">
                          ({calculatePercentage(statsData?.image2.total || 0, calculateTotalClicks())}%)
                        </span>
                      </div>
                      <div className="text-3xl font-bold mt-2">{formatNumber(statsData?.image2.total || 0)}</div>
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{
                              width: `${calculatePercentage(statsData?.image2.total || 0, calculateTotalClicks())}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4">أعلى البلدان مشاركة</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>البلد</TableHead>
                            <TableHead className="text-right">الصورة 1</TableHead>
                            <TableHead className="text-right">الصورة 2</TableHead>
                            <TableHead className="text-right">المجموع</TableHead>
                            <TableHead className="text-right">النسبة</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {statsData && Object.keys(statsData.image1.countries).slice(0, 10).map((country) => {
                            const image1Clicks = statsData.image1.countries[country] || 0;
                            const image2Clicks = statsData.image2.countries[country] || 0;
                            const countryTotal = image1Clicks + image2Clicks;
                            const percentage = calculatePercentage(countryTotal, calculateTotalClicks());
                            
                            return (
                              <TableRow key={country}>
                                <TableCell>{country}</TableCell>
                                <TableCell className="text-right">{formatNumber(image1Clicks)}</TableCell>
                                <TableCell className="text-right">{formatNumber(image2Clicks)}</TableCell>
                                <TableCell className="text-right">{formatNumber(countryTotal)}</TableCell>
                                <TableCell className="text-right">{percentage}%</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4">إحصائيات الزوار</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground">إجمالي الزوار</p>
                          <h3 className="text-2xl font-bold">{formatNumber(visitorStats.total)}</h3>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground">الزوار الفريدين</p>
                          <h3 className="text-2xl font-bold">{formatNumber(visitorStats.unique)}</h3>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground">زوار اليوم</p>
                          <h3 className="text-2xl font-bold">{formatNumber(visitorStats.today)}</h3>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground">زوار الأسبوع</p>
                          <h3 className="text-2xl font-bold">{formatNumber(visitorStats.lastWeek)}</h3>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <Card>
              <CardHeader>
                <CardTitle>التحديات</CardTitle>
                <CardDescription>
                  عرض نتائج التحديات المنتهية وإحصائياتها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm text-gray-500">Total Clicks Image 1</div>
                      <div className="text-2xl font-bold">62,184,039</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm text-gray-500">Total Clicks Image 2</div>
                      <div className="text-2xl font-bold">41,907,521</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Top Clicking Countries</h3>
                    <div className="overflow-x-auto">
                    
                    <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الرقم</TableHead>
                        <TableHead>العنوان</TableHead>
                        <TableHead>تاريخ البداية</TableHead>
                        <TableHead>تاريخ النهاية</TableHead>
                        <TableHead>عدد النقرات</TableHead>
                        <TableHead>الفائز</TableHead>
                        <TableHead>الصور</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastChallenges.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell>{challenge.id}</TableCell>
                          <TableCell>{challenge.title}</TableCell>
                          <TableCell>{new Date(challenge.startDate).toLocaleDateString('ar-SA')}</TableCell>
                          <TableCell>{new Date(challenge.endDate).toLocaleDateString('ar-SA')}</TableCell>
                          <TableCell>{formatNumber(challenge.totalClicks)}</TableCell>
                          <TableCell>
                            الصورة {challenge.winner} 
                            <span className={`inline-block ml-1 w-3 h-3 rounded-full ${challenge.winner === 1 ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className="w-10 h-10 overflow-hidden rounded-md">
                                <img src={challenge.image1Url} alt="صورة 1" className="w-full h-full object-cover" />
                              </div>
                              <span>VS</span>
                              <div className="w-10 h-10 overflow-hidden rounded-md">
                                <img src={challenge.image2Url} alt="صورة 2" className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الملفات</CardTitle>
                <CardDescription>
                  رفع أو تغيير ملفات التحدي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-10">
                    {/* الصورة الأولى وحالة الضغط عليها */}
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">الصورة 1</h2>
                      
                      {/* الصورة الأساسية */}
                      <div className="space-y-4">
                        <h3 className="font-medium">الصورة الأساسية</h3>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {image1Preview ? (
                            <img 
                              src={image1Preview} 
                              alt="معاينة الصورة 1" 
                              className="max-h-40 mx-auto"
                            />
                          ) : (
                            <p className="text-gray-500">اسحب وأفلت صورة هنا أو انقر للاستعراض</p>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageChange(e, 'image1')} 
                            className="max-w-xs"
                          />
                          <Button onClick={() => handleImageUpload('image1')}>رفع الصورة</Button>
                        </div>
                      </div>
                      
                      {/* صورة الضغط */}
                      <div className="space-y-4 mt-6">
                        <h3 className="font-medium">صورة حالة الضغط</h3>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {image1PressedPreview ? (
                            <img 
                              src={image1PressedPreview} 
                              alt="معاينة صورة الضغط 1" 
                              className="max-h-40 mx-auto"
                            />
                          ) : (
                            <p className="text-gray-500">اختر صورة حالة الضغط للصورة 1</p>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageChange(e, 'image1Pressed')} 
                            className="max-w-xs"
                          />
                          <Button onClick={() => handleImageUpload('image1Pressed')}>رفع صورة الضغط</Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* الصورة الثانية وحالة الضغط عليها */}
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">الصورة 2</h2>
                      
                      {/* الصورة الأساسية */}
                      <div className="space-y-4">
                        <h3 className="font-medium">الصورة الأساسية</h3>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {image2Preview ? (
                            <img 
                              src={image2Preview} 
                              alt="معاينة الصورة 2" 
                              className="max-h-40 mx-auto"
                            />
                          ) : (
                            <p className="text-gray-500">اسحب وأفلت صورة هنا أو انقر للاستعراض</p>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageChange(e, 'image2')} 
                            className="max-w-xs"
                          />
                          <Button onClick={() => handleImageUpload('image2')}>رفع الصورة</Button>
                        </div>
                      </div>
                      
                      {/* صورة الضغط */}
                      <div className="space-y-4 mt-6">
                        <h3 className="font-medium">صورة حالة الضغط</h3>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {image2PressedPreview ? (
                            <img 
                              src={image2PressedPreview} 
                              alt="معاينة صورة الضغط 2" 
                              className="max-h-40 mx-auto"
                            />
                          ) : (
                            <p className="text-gray-500">اختر صورة حالة الضغط للصورة 2</p>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageChange(e, 'image2Pressed')} 
                            className="max-w-xs"
                          />
                          <Button onClick={() => handleImageUpload('image2Pressed')}>رفع صورة الضغط</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* قسم الصور المرفوعة مسبقاً */}
                  <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">الصور المرفوعة مسبقاً</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="border rounded-md p-2">
                          <img 
                            src={image.url} 
                            alt={`صورة ${image.id}`}
                            className="w-full h-40 object-cover mb-2"
                          />
                          <div className="text-sm text-center">
                            <div className="font-medium">صورة #{image.id}</div>
                            <div className="text-gray-500">{image.type === 'standard' ? 'أساسية' : 'ضغط'}</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2 w-full"
                              onClick={() => {
                                if (image.type === 'standard') {
                                  if (image.id % 2 === 1) {
                                    setImage1Preview(image.url);
                                  } else {
                                    setImage2Preview(image.url);
                                  }
                                } else {
                                  if (image.id % 2 === 1) {
                                    setImage1PressedPreview(image.url);
                                  } else {
                                    setImage2PressedPreview(image.url);
                                  }
                                }
                                toast({
                                  title: "تم اختيار الصورة",
                                  description: "تم اختيار الصورة للاستخدام في التحدي الجديد"
                                });
                              }}
                            >
                              استخدام
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bans">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الحظر</CardTitle>
                <CardDescription>
                  إدارة الحظر المستخدمين
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm text-gray-500">Total Clicks Image 1</div>
                      <div className="text-2xl font-bold">62,184,039</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-sm text-gray-500">Total Clicks Image 2</div>
                      <div className="text-2xl font-bold">41,907,521</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Top Clicking Countries</h3>
                    <div className="overflow-x-auto">
                    
                    <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الرقم</TableHead>
                        <TableHead>العنوان</TableHead>
                        <TableHead>تاريخ البداية</TableHead>
                        <TableHead>تاريخ النهاية</TableHead>
                        <TableHead>عدد النقرات</TableHead>
                        <TableHead>الفائز</TableHead>
                        <TableHead>الصور</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastChallenges.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell>{challenge.id}</TableCell>
                          <TableCell>{challenge.title}</TableCell>
                          <TableCell>{new Date(challenge.startDate).toLocaleDateString('ar-SA')}</TableCell>
                          <TableCell>{new Date(challenge.endDate).toLocaleDateString('ar-SA')}</TableCell>
                          <TableCell>{formatNumber(challenge.totalClicks)}</TableCell>
                          <TableCell>
                            الصورة {challenge.winner} 
                            <span className={`inline-block ml-1 w-3 h-3 rounded-full ${challenge.winner === 1 ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className="w-10 h-10 overflow-hidden rounded-md">
                                <img src={challenge.image1Url} alt="صورة 1" className="w-full h-full object-cover" />
                              </div>
                              <span>VS</span>
                              <div className="w-10 h-10 overflow-hidden rounded-md">
                                <img src={challenge.image2Url} alt="صورة 2" className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sounds">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الأصوات</CardTitle>
                <CardDescription>
                  رفع أو تغيير أصوات النقر
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">الصوت 1 (للصورة 1)</h3>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {sound1File ? (
                      <div className="flex flex-col items-center">
                        <p className="text-green-500 font-medium mb-2">تم اختيار: {sound1File.name}</p>
                        <audio controls src={sound1File ? URL.createObjectURL(sound1File) : ''} className="w-full"></audio>
                      </div>
                    ) : (
                      <p className="text-gray-500">اختر ملف صوت للصورة 1</p>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <Input 
                      type="file" 
                      accept="audio/*" 
                      onChange={(e) => handleSoundChange(e, 1)} 
                      className="max-w-xs"
                    />
                    <Button onClick={() => handleSoundUpload(1)}>رفع الصوت</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">الصوت 2 (للصورة 2)</h3>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {sound2File ? (
                      <div className="flex flex-col items-center">
                        <p className="text-green-500 font-medium mb-2">تم اختيار: {sound2File.name}</p>
                        <audio controls src={sound2File ? URL.createObjectURL(sound2File) : ''} className="w-full"></audio>
                      </div>
                    ) : (
                      <p className="text-gray-500">اختر ملف صوت للصورة 2</p>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <Input 
                      type="file" 
                      accept="audio/*" 
                      onChange={(e) => handleSoundChange(e, 2)} 
                      className="max-w-xs"
                    />
                    <Button onClick={() => handleSoundUpload(2)}>رفع الصوت</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات التحدي</CardTitle>
                <CardDescription>
                  ضبط معلمات التحدي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">وقت بداية التحدي</label>
                      <Input type="datetime-local" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">وقت نهاية التحدي</label>
                      <Input type="datetime-local" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">عنوان التحدي</label>
                    <Input defaultValue="تحدي النقر العالمي" />
                  </div>
                  
                  <Button>حفظ الإعدادات</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
