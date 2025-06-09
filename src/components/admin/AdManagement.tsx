
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink, Calendar } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

const AdManagement = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    startDate: "",
    endDate: "",
    isActive: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = () => {
    const savedAds = localStorage.getItem('site_ads');
    if (savedAds) {
      setAds(JSON.parse(savedAds));
    }
  };

  const saveAds = (newAds: Ad[]) => {
    localStorage.setItem('site_ads', JSON.stringify(newAds));
    setAds(newAds);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl || !formData.linkUrl) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate >= endDate) {
        toast({
          title: "خطأ في التاريخ",
          description: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية",
          variant: "destructive"
        });
        return;
      }
    }

    const newAd: Ad = {
      id: editingAd ? editingAd.id : Date.now().toString(),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      isActive: formData.isActive,
      createdAt: editingAd ? editingAd.createdAt : new Date().toISOString()
    };

    let updatedAds;
    if (editingAd) {
      updatedAds = ads.map(ad => ad.id === editingAd.id ? newAd : ad);
    } else {
      updatedAds = [...ads, newAd];
    }

    saveAds(updatedAds);
    
    toast({
      title: "نجح",
      description: editingAd ? "تم تحديث الإعلان بنجاح" : "تم إضافة الإعلان بنجاح"
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
      startDate: "",
      endDate: "",
      isActive: true
    });
    setEditingAd(null);
    setShowForm(false);
  };

  const handleEdit = (ad: Ad) => {
    setFormData({
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      startDate: ad.startDate || "",
      endDate: ad.endDate || "",
      isActive: ad.isActive
    });
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleDelete = (adId: string) => {
    const updatedAds = ads.filter(ad => ad.id !== adId);
    saveAds(updatedAds);
    toast({
      title: "تم الحذف",
      description: "تم حذف الإعلان بنجاح"
    });
  };

  const toggleAdStatus = (adId: string) => {
    const updatedAds = ads.map(ad => 
      ad.id === adId ? { ...ad, isActive: !ad.isActive } : ad
    );
    saveAds(updatedAds);
  };

  const isAdActive = (ad: Ad) => {
    if (!ad.isActive) return false;
    if (!ad.startDate || !ad.endDate) return true;
    
    const now = new Date();
    const startDate = new Date(ad.startDate);
    const endDate = new Date(ad.endDate);
    
    return now >= startDate && now <= endDate;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الإعلانات العادية</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة إعلان جديد
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingAd ? "تعديل الإعلان" : "إضافة إعلان جديد"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الإعلان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="ادخل عنوان الإعلان"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">وصف الإعلان</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="ادخل وصف الإعلان (اختياري)"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">رابط صورة الإعلان *</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="linkUrl">رابط الإعلان *</Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">تاريخ البداية</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">تاريخ النهاية</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">الإعلان مفعل</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingAd ? "تحديث الإعلان" : "إضافة الإعلان"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {ads.map((ad) => {
          const isCurrentlyActive = isAdActive(ad);
          return (
            <Card key={ad.id} className={`${isCurrentlyActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <img 
                      src={ad.imageUrl} 
                      alt={ad.title}
                      className="w-24 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{ad.title}</h3>
                        {isCurrentlyActive && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">نشط</span>
                        )}
                      </div>
                      {ad.description && (
                        <p className="text-gray-600 text-sm mt-1">{ad.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <ExternalLink className="h-3 w-3" />
                        <a 
                          href={ad.linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {ad.linkUrl}
                        </a>
                      </div>
                      {(ad.startDate || ad.endDate) && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>من: {ad.startDate ? new Date(ad.startDate).toLocaleDateString('ar') : 'غير محدد'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>إلى: {ad.endDate ? new Date(ad.endDate).toLocaleDateString('ar') : 'غير محدد'}</span>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        تم الإنشاء: {new Date(ad.createdAt).toLocaleDateString('ar')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdStatus(ad.id)}
                      className={ad.isActive ? 'text-green-600' : 'text-gray-400'}
                    >
                      {ad.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ad)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ad.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {ads.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              لا توجد إعلانات مضافة بعد
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdManagement;
