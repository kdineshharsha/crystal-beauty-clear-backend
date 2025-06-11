import AdBanner from "../models/adBanner.js";

export const createBanner = async (req, res) => {
  try {
    const newBanner = new AdBanner(req.body);
    const saved = await newBanner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBanners = async (req, res) => {
  try {
    const now = new Date();
    const allBanners = await AdBanner.find();

    const bannersWithStatus = allBanners.map((banner) => {
      const isExpired = banner.endDate && new Date(banner.endDate) < now;
      return {
        ...banner._doc,
        status: isExpired ? "expired" : banner.isVisible ? "visible" : "hidden",
      };
    });

    res.status(200).json(bannersWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getActiveBanners = async (req, res) => {
  try {
    const now = new Date();
    const banners = await AdBanner.find({
      isVisible: true,
      $or: [{ endDate: { $exists: false } }, { endDate: { $gt: now } }],
    });

    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function updateBanner(req, res) {
  console.log(req.params);
  AdBanner.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((updatedBanner) => {
      if (updatedBanner == null) {
        res.status(404).json({
          message: "AdBanner not found",
        });
      } else {
        res.json({
          message: "AdBanner updated successfully",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "AdBanner not updated",
      });
    });
}

export async function deleteBanner(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }
  if (req.user.role != "admin") {
    res.status(403).json({
      message: "You are not authorized to delete a product",
    });
    return;
  }
  AdBanner.findOneAndDelete({ _id: req.params.id })
    .then(() => {
      res.json({
        message: "AdBanner deleted successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "AdBanner not deleted",
      });
    });
}
