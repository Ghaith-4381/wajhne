
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminPasswordForm from "./admin/AdminPasswordForm";
import AdminOTPForm from "./admin/AdminOTPForm";
import AdminRegistrationForm from "./admin/AdminRegistrationForm";

interface AdminAuthProps {
  onAuthenticate: () => void;
}

const ADMIN_PASSWORD = "123456";

const AdminAuth = ({ onAuthenticate }: AdminAuthProps) => {
  const [step, setStep] = useState<"password" | "otp" | "register">("password");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password3, setPassword3] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password1 === "admin" && password2 === "secure" && password3 === "2025") {
      toast.success("تم إرسال رمز التحقق إلى البريد الإلكتروني!");
      localStorage.setItem("admin_auth_started", "true");
      setStep("otp");
    } else {
      toast.error("بيانات الاعتماد غير صالحة!");
    }
  };

  const handleOtpComplete = (value: string) => {
    setOtp(value);
    
    if (value === ADMIN_PASSWORD) {
      toast.success("تم المصادقة بنجاح!");
      localStorage.setItem("admin_authenticated", "true");
      localStorage.setItem("admin_auth_time", Date.now().toString());
      onAuthenticate();
    } else if (value.length === 6) {
      toast.error("رمز التحقق غير صالح!");
    }
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password1 !== confirmPassword) {
      toast.error("كلمة المرور وتأكيدها غير متطابقتين!");
      return;
    }
    
    if (password1.length < 6 || password2.length < 6 || password3.length < 6) {
      toast.error("كل كلمة مرور يجب أن تحتوي على 6 أحرف على الأقل!");
      return;
    }
    
    if (secretKey !== "MySuperSecretKey2024") {
      toast.error("المفتاح السري غير صحيح!");
      return;
    }
    
    toast.success("تم إنشاء الحساب بنجاح!");
    setStep("password");
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (step === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AdminRegistrationForm
          username={username}
          setUsername={setUsername}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password1={password1}
          setPassword1={setPassword1}
          password2={password2}
          setPassword2={setPassword2}
          password3={password3}
          setPassword3={setPassword3}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          secretKey={secretKey}
          setSecretKey={setSecretKey}
          onSubmit={handleRegistration}
          onBackToLogin={() => setStep("password")}
        />
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AdminOTPForm
          otp={otp}
          onOtpChange={handleOtpComplete}
          onSubmit={() => handleOtpComplete(otp)}
          onBack={() => setStep("password")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AdminPasswordForm
        username={username}
        setUsername={setUsername}
        password1={password1}
        setPassword1={setPassword1}
        password2={password2}
        setPassword2={setPassword2}
        password3={password3}
        setPassword3={setPassword3}
        onSubmit={handlePasswordSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminAuth;
