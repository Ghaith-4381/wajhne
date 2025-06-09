import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Clock, Play, Square, Calendar, Trophy, AlertCircle, Upload, Volume2, Timer } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

interface Challenge {
  id: number;
  title: string;
  isActive: boolean;
  hasEndTime: boolean;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  image1Path?: string;
  image2Path?: string;
  sound1Path?: string;
  sound2Path?: string;
}

const challengeFormSchema = z.object({
  title: z.string().min(2, {
    message: "عنوان التحدي يجب أن يكون على الأقل حرفين.",
  }),
  hasEndTime: z.boolean(),
  durationHours: z.string().optional(),
  durationMinutes: z.string().optional(),
  image1: z.any().optional(),
  image2: z.any().optional(),
  sound1: z.any().optional(),
  sound2: z.any().optional(),
})

const ChallengeManagement = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof challengeFormSchema>>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      title: "",
      hasEndTime: false,
      durationHours: "0",
      durationMinutes: "30",
    },
  })

  const watchHasEndTime = form.watch("hasEndTime");

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/challenges');
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب التحديات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, type: 'image' | 'sound', imageId: number) => {
    const formData = new FormData();
    formData.append(type, file);

    const endpoint = type === 'image' 
      ? `/api/upload-image/${imageId}` 
      : `/api/upload-sound/${imageId}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    return response.json();
  };

  const onSubmit = async (values: z.infer<typeof challengeFormSchema>) => {
    try {
      setLoading(true);
      setUploadingFiles(true);

      // رفع الملفات أولاً إذا كانت موجودة
      if (values.image1 && values.image1[0]) {
        console.log('Uploading image1...');
        await uploadFile(values.image1[0], 'image', 1);
      }
      if (values.image2 && values.image2[0]) {
        console.log('Uploading image2...');
        await uploadFile(values.image2[0], 'image', 2);
      }
      if (values.sound1 && values.sound1[0]) {
        console.log('Uploading sound1...');
        await uploadFile(values.sound1[0], 'sound', 1);
      }
      if (values.sound2 && values.sound2[0]) {
        console.log('Uploading sound2...');
        await uploadFile(values.sound2[0], 'sound', 2);
      }

      setUploadingFiles(false);

      // حساب وقت النهاية إذا كان التحدي محدود الوقت
      let startTime = null;
      let endTime = null;
      
      if (values.hasEndTime) {
        const now = new Date();
        startTime = now.toISOString();
        
        const hours = parseInt(values.durationHours || "0");
        const minutes = parseInt(values.durationMinutes || "0");
        
        const endDate = new Date(now.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000));
        endTime = endDate.toISOString();
      }

      // إنشاء التحدي
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: values.title,
          hasEndTime: values.hasEndTime,
          startTime: startTime,
          endTime: endTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم إنشاء التحدي",
          description: data.message,
        });
        form.reset();
        await fetchChallenges();
      } else {
        toast({
          title: "خطأ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء التحدي",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  const stopChallenge = async (challengeId: number) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/stop`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم إيقاف التحدي",
          description: data.message,
        });
        await fetchChallenges();
      } else {
        toast({
          title: "خطأ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إيقاف التحدي",
        variant: "destructive",
      });
    }
  };

  const activateChallenge = async (challengeId: number) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/activate`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم تفعيل التحدي",
          description: data.message,
        });
        await fetchChallenges();
      } else {
        toast({
          title: "خطأ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تفعيل التحدي",
        variant: "destructive",
      });
    }
  };

  const deleteChallenge = async (challengeId: number) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم حذف التحدي",
          description: data.message,
        });
        await fetchChallenges();
      } else {
        toast({
          title: "خطأ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف التحدي",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Create New Challenge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            إنشاء تحدي جديد
          </CardTitle>
          <CardDescription>
            إنشاء تحدي جديد مع إمكانية تحديد المدة والصور والأصوات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان التحدي</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل عنوان التحدي" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* صور التحدي */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="image1"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        صورة القائد الأول
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image2"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        صورة القائد الثاني
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* أصوات التحدي */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sound1"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        صوت القائد الأول
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sound2"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        صوت القائد الثاني
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="hasEndTime"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        تحديد مدة التحدي
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        إذا لم يتم تفعيل هذا الخيار، سيكون التحدي لانهائي (بدون مؤقت)
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchHasEndTime && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Timer className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-800">تحديد مدة التحدي</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="durationHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الساعات</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="23"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="durationMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الدقائق</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              placeholder="30"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-3 text-sm text-blue-600">
                    سيبدأ التحدي فوراً وينتهي بعد المدة المحددة
                  </div>
                </Card>
              )}

              <Button type="submit" disabled={loading || uploadingFiles} className="w-full">
                {uploadingFiles ? "جاري رفع الملفات..." : loading ? "جاري الإنشاء..." : "إنشاء التحدي"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Challenges List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            قائمة التحديات
          </CardTitle>
          <CardDescription>
            إدارة التحديات الموجودة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                <p>لا توجد تحديات حالياً</p>
              </div>
            ) : (
              challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{challenge.title}</h3>
                      <Badge variant={challenge.isActive ? "default" : "secondary"}>
                        {challenge.isActive ? "نشط" : "متوقف"}
                      </Badge>
                      {!challenge.hasEndTime && (
                        <Badge variant="outline">تحدي لانهائي</Badge>
                      )}
                    </div>
                    {challenge.hasEndTime && challenge.startTime && challenge.endTime && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          <span>البداية: {formatDateTime(challenge.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Square className="h-4 w-4" />
                          <span>النهاية: {formatDateTime(challenge.endTime)}</span>
                        </div>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      تم الإنشاء: {formatDateTime(challenge.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {challenge.isActive ? (
                      <>
                        {!challenge.hasEndTime && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => stopChallenge(challenge.id)}
                          >
                            <Square className="h-4 w-4 mr-1" />
                            إيقاف التحدي
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => activateChallenge(challenge.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        تفعيل
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteChallenge(challenge.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={fetchChallenges} disabled={loading} variant="outline">
              {loading ? 'جاري التحديث...' : 'تحديث القائمة'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeManagement;
