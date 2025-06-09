
import React from "react";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Lock } from "lucide-react";

interface AdminOTPFormProps {
  otp: string;
  onOtpChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const AdminOTPForm = ({ otp, onOtpChange, onSubmit, onBack }: AdminOTPFormProps) => {
  const OTP_PIN_LENGTH = 6;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      <div className="flex justify-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Lock className="h-10 w-10 text-blue-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">رمز التحقق</h2>
      <p className="text-center text-gray-500 mb-6">
        أدخل الرمز المكون من 6 أرقام المرسل إلى البريد الإلكتروني
      </p>

      {/* ملاحظات رمز التحقق */}
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">ملاحظات هامة:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• الرمز صالح لمدة 10 دقائق فقط</li>
          <li>• تحقق من مجلد الرسائل غير المرغوب فيها</li>
          <li>• يجب إدخال الرمز بالأرقام الإنجليزية</li>
          <li>• لا تشارك هذا الرمز مع أي شخص آخر</li>
        </ul>
      </div>
      
      <div className="flex justify-center mb-6">
        <InputOTP maxLength={6} value={otp} onChange={onOtpChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      
      <div className="mt-6 flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="w-full"
        >
          رجوع
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={otp.length !== OTP_PIN_LENGTH}
          className="w-full"
        >
          تحقق
        </Button>
      </div>
    </div>
  );
};

export default AdminOTPForm;
