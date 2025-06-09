
// src/pages/AdminAds.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

interface Ad {
  id: number;
  imageUrl: string;
  link: string;
  allowedCountries: string[]; // مثل ["SY", "IQ"]
  clicks: number;
}

const AdminAds = () => {
  const queryClient = useQueryClient();
  const [newAd, setNewAd] = useState({ imageUrl: "", link: "", allowedCountries: "" });

  const { data: ads = [], isLoading } = useQuery<Ad[]>({
    queryKey: ["custom-ads"],
    queryFn: async () => {
      const res = await axios.get("/api/ads/custom");
      return res.data;
    },
  });

  const addAdMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...newAd,
        allowedCountries: newAd.allowedCountries.split(",").map((c) => c.trim()),
      };
      await axios.post("/api/ads/custom", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-ads"] });
      setNewAd({ imageUrl: "", link: "", allowedCountries: "" });
    },
  });

  const deleteAdMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/ads/custom/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-ads"] });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إضافة إعلان جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="رابط الصورة"
            value={newAd.imageUrl}
            onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
          />
          <Input
            placeholder="رابط عند النقر"
            value={newAd.link}
            onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
          />
          <Textarea
            placeholder="الدول المسموحة (مثال: SY,IQ)"
            value={newAd.allowedCountries}
            onChange={(e) => setNewAd({ ...newAd, allowedCountries: e.target.value })}
          />
          <Button onClick={() => addAdMutation.mutate()}>إضافة الإعلان</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الإعلانات الحالية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p>جاري التحميل...</p>
          ) : ads.length === 0 ? (
            <p>لا يوجد إعلانات بعد.</p>
          ) : (
            ads.map((ad) => (
              <div key={ad.id} className="border rounded-lg p-4 space-y-2">
                <img src={ad.imageUrl} alt="Ad" className="w-full h-32 object-cover rounded" />
                <p className="text-sm break-all">🔗 <a href={ad.link} className="text-blue-600 underline" target="_blank">{ad.link}</a></p>
                <p className="text-sm">الدول: {ad.allowedCountries.join(", ") || "الكل"}</p>
                <p className="text-sm text-gray-500">عدد النقرات: {ad.clicks}</p>
                <Button variant="destructive" size="sm" onClick={() => deleteAdMutation.mutate(ad.id)}>حذف</Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAds;
