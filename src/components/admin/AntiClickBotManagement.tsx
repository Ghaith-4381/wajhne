
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Shield, 
  Users, 
  Settings, 
  Eye, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  UserX,
  RotateCcw
} from 'lucide-react';
import { useAntiClickBot } from '../../hooks/useAntiClickBot';

const settingsFormSchema = z.object({
  is_enabled: z.boolean(),
  max_clicks_per_minute: z.number().min(1).max(1000),
  time_window_seconds: z.number().min(1).max(3600),
  block_duration_minutes: z.number().min(1).max(1440),
  require_captcha: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const AntiClickBotManagement = () => {
  const { toast } = useToast();
  const {
    settings,
    stats,
    loading,
    error,
    fetchSettings,
    updateSettings,
    fetchStats,
    unblockUser,
    resetUserClicks
  } = useAntiClickBot();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      is_enabled: true,
      max_clicks_per_minute: 100,
      time_window_seconds: 60,
      block_duration_minutes: 5,
      require_captcha: true,
    },
  });

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, [fetchSettings, fetchStats]);

  useEffect(() => {
    if (settings) {
      form.reset({
        is_enabled: settings.is_enabled,
        max_clicks_per_minute: settings.max_clicks_per_minute,
        time_window_seconds: settings.time_window_seconds,
        block_duration_minutes: settings.block_duration_minutes,
        require_captcha: settings.require_captcha,
      });
    }
  }, [settings, form]);

  const onSubmit = async (values: SettingsFormValues) => {
    const result = await updateSettings(values);
    if (result?.success) {
      toast({
        title: "تم التحديث",
        description: result.message,
      });
    } else {
      toast({
        title: "خطأ",
        description: result?.error || "فشل في التحديث",
        variant: "destructive",
      });
    }
  };

  const handleUnblockUser = async (ipAddress: string) => {
    const result = await unblockUser(ipAddress);
    if (result?.success) {
      toast({
        title: "تم إلغاء الحظر",
        description: result.message,
      });
    } else {
      toast({
        title: "خطأ",
        description: result?.error || "فشل في إلغاء الحظر",
        variant: "destructive",
      });
    }
  };

  const handleResetUserClicks = async (ipAddress: string) => {
    const result = await resetUserClicks(ipAddress);
    if (result?.success) {
      toast({
        title: "تم إعادة التعيين",
        description: result.message,
      });
    } else {
      toast({
        title: "خطأ",
        description: result?.error || "فشل في إعادة التعيين",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold">حماية ضد النقرات التلقائية</h1>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            الإعدادات
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Eye className="h-4 w-4 mr-2" />
            الإحصائيات
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            المستخدمون
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات الحماية
              </CardTitle>
              <CardDescription>
                تكوين نظام الحماية ضد النقرات التلقائية والسكربتات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="is_enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">
                            تفعيل الحماية ضد النقرات التلقائية
                          </FormLabel>
                          <FormDescription>
                            تفعيل أو تعطيل نظام الحماية بالكامل
                          </FormDescription>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="max_clicks_per_minute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الحد الأقصى للنقرات في النافذة الزمنية</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="1000"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            عدد النقرات المسموحة قبل الحظر
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time_window_seconds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>النافذة الزمنية (بالثواني)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="3600"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            الفترة الزمنية لحساب النقرات
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="block_duration_minutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مدة الحظر (بالدقائق)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="1440"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            مدة حظر المستخدم عند التجاوز
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="require_captcha"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">
                            طلب CAPTCHA عند التجاوز
                          </FormLabel>
                          <FormDescription>
                            إظهار تحدي CAPTCHA للمستخدمين المشبوهين
                          </FormDescription>
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

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "جاري التحديث..." : "حفظ الإعدادات"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">إجمالي المستخدمين</p>
                    <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">المستخدمون المحظورون</p>
                    <p className="text-2xl font-bold text-red-600">{stats?.blockedUsers || 0}</p>
                  </div>
                  <UserX className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">النقرات المشبوهة (24 ساعة)</p>
                    <p className="text-2xl font-bold text-orange-600">{stats?.suspiciousClicks24h || 0}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">آخر تحديث</p>
                    <p className="text-sm">{new Date().toLocaleTimeString('ar')}</p>
                  </div>
                  <Clock className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mb-4">
            <Button onClick={fetchStats} disabled={loading} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث الإحصائيات
            </Button>
          </div>

          {/* أكثر المستخدمين نشاطاً مشبوهاً */}
          {stats?.topSuspiciousUsers && stats.topSuspiciousUsers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>المستخدمون الأكثر نشاطاً مشبوهاً</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان IP</TableHead>
                      <TableHead>الأنشطة المشبوهة</TableHead>
                      <TableHead>عدد النقرات</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>آخر نشاط</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topSuspiciousUsers.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{user.ip_address}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">{user.suspicious_activity_count}</Badge>
                        </TableCell>
                        <TableCell>{user.click_count}</TableCell>
                        <TableCell>
                          {user.is_blocked ? (
                            <Badge variant="destructive">محظور</Badge>
                          ) : (
                            <Badge variant="secondary">نشط</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDateTime(user.last_click_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.is_blocked && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnblockUser(user.ip_address)}
                              >
                                إلغاء الحظر
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResetUserClicks(user.ip_address)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              إعادة تعيين
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>إدارة المستخدمين</CardTitle>
              <CardDescription>
                عرض وإدارة المستخدمين وحالات الحظر
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                سيتم إضافة قائمة تفصيلية للمستخدمين قريباً
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AntiClickBotManagement;
