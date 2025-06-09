
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { UserPlus } from "lucide-react";

interface AdminRegistrationFormProps {
  username: string;
  setUsername: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password1: string;
  setPassword1: (value: string) => void;
  password2: string;
  setPassword2: (value: string) => void;
  password3: string;
  setPassword3: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  secretKey: string;
  setSecretKey: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

const AdminRegistrationForm = ({
  username,
  setUsername,
  fullName,
  setFullName,
  email,
  setEmail,
  password1,
  setPassword1,
  password2,
  setPassword2,
  password3,
  setPassword3,
  confirmPassword,
  setConfirmPassword,
  secretKey,
  setSecretKey,
  onSubmit,
  onBackToLogin
}: AdminRegistrationFormProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <UserPlus className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <CardTitle>إنشاء حساب مشرف جديد</CardTitle>
        <CardDescription>قم بإنشاء حساب مشرف جديد للوحة التحكم</CardDescription>
      </CardHeader>
      <CardContent>
        {/* شروط إنشاء الحساب */}
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-green-800 mb-2">شروط إنشاء الحساب:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• اسم المستخدم يجب أن يكون فريد (غير مستخدم مسبقاً)</li>
            <li>• كل كلمة مرور يجب أن تحتوي على 6 أحرف على الأقل</li>
            <li>• البريد الإلكتروني يجب أن يكون صالح ومفعل</li>
            <li>• المفتاح السري مطلوب للتفويض</li>
            <li>• يجب تأكيد كلمة المرور الأولى بشكل صحيح</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">اسم المستخدم *</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">الاسم الكامل *</label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني *</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="password1" className="text-sm font-medium">كلمة المرور الأولى *</label>
              <Input
                id="password1"
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                placeholder="6 أحرف على الأقل"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password2" className="text-sm font-medium">كلمة المرور الثانية *</label>
              <Input
                id="password2"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="6 أحرف على الأقل"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password3" className="text-sm font-medium">كلمة المرور الثالثة *</label>
              <Input
                id="password3"
                type="password"
                value={password3}
                onChange={(e) => setPassword3(e.target.value)}
                placeholder="6 أحرف على الأقل"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">تأكيد كلمة المرور الأولى *</label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور الأولى"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="secretKey" className="text-sm font-medium">المفتاح السري *</label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="أدخل المفتاح السري للتفويض"
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">إنشاء حساب</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onBackToLogin}>
              العودة لتسجيل الدخول
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminRegistrationForm;
