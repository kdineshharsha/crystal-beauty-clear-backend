import User from "../models/user.js";
import Order from "../models/order.js";
import Product from "../models/product.js"; // ✅ make sure this path is correct

export async function getAdminSummary(req, res) {
  try {
    const { period = "all", page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    // Total Users and Orders
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();

    // Total Revenue (all orders)
    const allOrders = await Order.find({});
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);

    // Period Filter
    let match = {};
    if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      match.date = { $gte: weekAgo };
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      match.date = { $gte: monthAgo };
    }

    // Recent Orders (paginated)
    const recentOrders = await Order.find(match)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    // User Growth Chart
    const usersPerPeriod = await User.aggregate([
      {
        $match: match.date ? { createdAt: match.date } : {},
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🔥 Top-Selling Products
    const productSales = {};
    allOrders.forEach((order) => {
      order.billItems.forEach((item) => {
        if (!productSales[item.productName]) {
          productSales[item.productName] = 0;
        }
        productSales[item.productName] += item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // ❗ Low Stock Products
    const lowStock = await Product.find({ stock: { $lte: 5 } }).select(
      "name stock"
    );

    // ✅ Response
    res.json({
      users,
      orders,
      revenue: totalRevenue,
      recentOrders,
      usersPerPeriod,
      topProducts,
      lowStock,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
}
