import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// التعامل مع ES Modules لتحديد __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adsFilePath = path.join(__dirname, "../data/customAds.json");

// ✅ جلب الإعلانات
router.get("/ads/custom", (req, res) => {
  fs.readFile(adsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading custom ads:", err);
      return res.status(500).json({ error: "Failed to read ads" });
    }

    try {
      const adsData = JSON.parse(data);
      res.json(adsData);
    } catch (parseErr) {
      console.error("Error parsing ads:", parseErr);
      res.status(500).json({ error: "Failed to parse ads" });
    }
  });
});

// ✅ إضافة إعلان جديد
router.post("/ads/custom", (req, res) => {
  const { imageUrl, linkUrl, country } = req.body;

  if (!imageUrl || !linkUrl || !country) {
    return res.status(400).json({ error: "Missing fields" });
  }

  fs.readFile(adsFilePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });

    const ads = JSON.parse(data);
    const newAd = {
      id: Date.now(), // رقم فريد بسيط
      imageUrl,
      linkUrl,
      country,
    };

    ads.push(newAd);

    fs.writeFile(adsFilePath, JSON.stringify(ads, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Failed to save ad" });

      res.status(201).json({ message: "Ad added successfully", ad: newAd });
    });
  });
});

// ✅ حذف إعلان
router.delete("/ads/custom/:id", (req, res) => {
  const adId = parseInt(req.params.id, 10);

  fs.readFile(adsFilePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read file" });

    let ads = JSON.parse(data);
    const newAds = ads.filter(ad => ad.id !== adId);

    if (ads.length === newAds.length) {
      return res.status(404).json({ error: "Ad not found" });
    }

    fs.writeFile(adsFilePath, JSON.stringify(newAds, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: "Failed to delete ad" });

      res.json({ message: "Ad deleted successfully" });
    });
  });
});

// ✅ تفعيل / تعطيل الإعلانات الخاصة (مثلاً بتخزين خيار عام في ملف JSON)
const settingsPath = path.join(__dirname, "../data/settings.json");

router.patch("/ads/toggle", (req, res) => {
  const { enabled } = req.body;

  fs.writeFile(settingsPath, JSON.stringify({ customAdsEnabled: enabled }, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to update setting" });
    res.json({ message: "Setting updated", enabled });
  });
});

// ✅ جلب حالة التفعيل
router.get("/ads/toggle", (req, res) => {
  fs.readFile(settingsPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read setting" });
    const settings = JSON.parse(data);
    res.json({ enabled: settings.customAdsEnabled });
  });
});

export default router;
