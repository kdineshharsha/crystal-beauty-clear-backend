import { PopupAd } from "../models/popupAd.js";
export const createPromotion = async (req, res) => {
  try {
    const newPromo = new PopupAd(req.body);
    await newPromo.save();
    res.status(201).json(newPromo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPopupPromotion = async (req, res) => {
  try {
    const popupAd = await PopupAd.findOne({
      showAsPopup: true,
      isActive: true,
    }).sort({ createdAt: -1 }); // latest one
    res.json(popupAd || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPromotions = async (req, res) => {
  const promos = await PopupAd.find().sort({ createdAt: -1 });
  res.json(promos);
};

export const deletePromotion = async (req, res) => {
  await PopupAd.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const updatePromotion = async (req, res) => {
  const updated = await PopupAd.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};
