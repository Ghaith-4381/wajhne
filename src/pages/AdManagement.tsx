import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdManagement = () => {
  const [customAds, setCustomAds] = useState<
    { image: string; url: string; enabled: boolean }[]
  >([]);

  // تحميل الإعلانات من localStorage عند بداية التشغيل
  useEffect(() => {
    const storedAds = localStorage.getItem("customAds");
    if (storedAds) {
      setCustomAds(JSON.parse(storedAds));
    }
  }, []);

  // تحديث تفعيل/إلغاء تفعيل الإعلان
  const toggleAdEnabled = (index: number, checked: boolean) => {
    const updatedAds = [...customAds];
    updatedAds[index] = { ...updatedAds[index], enabled: checked };
    setCustomAds(updatedAds);
    localStorage.setItem("customAds", JSON.stringify(updatedAds));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">إدارة الإعلانات</h2>
      {customAds.length === 0 && <p>لا توجد إعلانات مضافة بعد.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {customAds.map((ad, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md bg-white">
            <div className="mb-2">
              <Label className="block mb-1">رابط الإعلان:</Label>
              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {ad.url || "لا يوجد"}
              </a>
            </div>

            <div className="mb-2">
              <Label className="block mb-1">صورة الإعلان:</Label>
              {ad.image ? (
                <a
                  href={ad.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={ad.image}
                    alt={`Ad ${index + 1}`}
                    className="w-full max-h-40 object-contain rounded border"
                  />
                </a>
              ) : (
                <p>لا توجد صورة</p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Label>تفعيل الإعلان</Label>
              <Switch
                checked={ad.enabled}
                onCheckedChange={(checked) => toggleAdEnabled(index, checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdManagement;
