
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminPasswordFormProps {
  username: string;
  setUsername: (value: string) => void;
  password1: string;
  setPassword1: (value: string) => void;
  password2: string;
  setPassword2: (value: string) => void;
  password3: string;
  setPassword3: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const AdminPasswordForm = ({
  username,
  setUsername,
  password1,
  setPassword1,
  password2,
  setPassword2,
  password3,
  setPassword3,
  onSubmit,
  onCancel
}: AdminPasswordFormProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">لوحة تحكم المشرف</CardTitle>
        <CardDescription>
          أدخل بيانات الاعتماد للوصول إلى لوحة التحكم
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="أدخل اسم المستخدم"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password1">كلمة المرور الأولى</Label>
            <Input
              id="password1"
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
              placeholder="أدخل كلمة المرور الأولى"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password2">كلمة المرور الثانية</Label>
            <Input
              id="password2"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              placeholder="أدخل كلمة المرور الثانية"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password3">كلمة المرور الثالثة</Label>
            <Input
              id="password3"
              type="password"
              value={password3}
              onChange={(e) => setPassword3(e.target.value)}
              required
              placeholder="أدخل كلمة المرور الثالثة"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              تسجيل الدخول
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminPasswordForm;
