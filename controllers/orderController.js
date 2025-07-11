import Notification from "../models/notifications.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { sendOrderStatusEmail } from "../utilis/emailService.js";

export async function createOrder(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const body = req.body;
    const orderData = {
      orderId: "",
      email: req.user.email,
      name: body.name,
      address: body.address,
      phoneNumber: body.phoneNumber,
      billItems: [],
      total: 0,
      totalDiscount: 0,
    };

    const lastBill = await Order.findOne().sort({ date: -1 });
    orderData.orderId = lastBill
      ? "ORD" +
        (parseInt(lastBill.orderId.replace("ORD", "")) + 1)
          .toString()
          .padStart(4, "0")
      : "ORD0001";

    for (let i = 0; i < body.billItems.length; i++) {
      const item = body.billItems[i];
      const product = await Product.findOne({ productId: item.productId });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // 💥 Update product stock and totalSold
      product.stock -= item.quantity;
      product.totalSold = (product.totalSold || 0) + item.quantity;
      await product.save();

      // 🧾 Build bill item
      orderData.billItems[i] = {
        productId: product.productId,
        productName: product.name,
        image: product.image[0],
        quantity: item.quantity,
        price: product.price,
      };

      orderData.total += product.price * item.quantity;

      const itemDiscount = product.labeledPrice * item.quantity;
      orderData.totalDiscount += itemDiscount - product.price * item.quantity;
    }

    const order = new Order(orderData);
    await order.save();

    // 💾 Save address if it's new
    const user = await User.findOne({ email: req.user.email });
    if (user && !user.savedAddresses.includes(orderData.address)) {
      user.savedAddresses.push({
        fullName: orderData.name,
        address: orderData.address,
        phone: orderData.phoneNumber,
      });
      await user.save();
    }

    // 🔔 Save notification
    const notification = new Notification({
      orderId: orderData.orderId,
      status: "Pending",
      userEmail: orderData.email,
      message: `Order #${orderData.orderId} is now Pending`,
    });
    await notification.save();

    // 📧 Send status email
    await sendOrderStatusEmail(
      orderData.email,
      orderData.orderId,
      "Pending",
      orderData.billItems,
      orderData.total,
      {
        name: orderData.name,
        address: orderData.address,
        phoneNumber: orderData.phoneNumber,
      }
    );

    res.json({ message: "Order saved successfully" });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Order not saved" });
  }
}

export async function getOrder(req, res) {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Orders not found",
    });
  }
}

export async function updateOrder(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const orderId = req.params.orderId;
    const updatedOrder = await Order.findOneAndUpdate({ orderId }, req.body, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Save notification
    const notification = new Notification({
      orderId: updatedOrder.orderId,
      status: updatedOrder.status,
      userEmail: updatedOrder.email,
      message: `Order #${updatedOrder.orderId} is now ${updatedOrder.status}`,
    });

    await notification.save();

    // 💌 Send email
    await sendOrderStatusEmail(
      updatedOrder.email,
      updatedOrder.orderId,
      updatedOrder.status,
      updatedOrder.billItems,
      updatedOrder.total,
      {
        name: updatedOrder.name,
        address: updatedOrder.address,
        phoneNumber: updatedOrder.phoneNumber,
      }
    );

    res.json({ message: "Order updated, email and notification sent" });
  } catch (err) {
    console.error("Error in updateOrder:", err);
    res.status(500).json({ message: "Error updating order" });
  }
}
export async function getOrdersByUserEmail(req, res) {
  try {
    const query = { email: req.params.userEmail };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
}

export async function orderNotification(req, res) {
  try {
    const { userEmail } = req.params;
    const notifications = await Notification.find({ userEmail: userEmail })
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json(
      notifications.map((notification) => ({
        orderId: notification.orderId,
        status: notification.status,
        updatedAt: notification.updatedAt,
        message: notification.message,
      }))
    );
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ message: "Failed to get notifications" });
  }
}

export async function clearAllNotifications(req, res) {
  try {
    const { email } = req.params;
    await Notification.deleteMany({ userEmail: email });
    res.json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
}

export async function cancelOrder(req, res) {
  if (!req.user || !req.user.email) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const orderId = req.params.orderId;
    const cancelledOrder = await Order.findOneAndUpdate(
      { orderId, email: req.user.email },
      { status: "Cancelled" }, // Forcefully cancel
      { new: true }
    );
    if (!cancelledOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Save notification
    const notification = new Notification({
      orderId: cancelledOrder.orderId,
      status: cancelledOrder.status,
      userEmail: cancelledOrder.email,
      message: `Order #${cancelledOrder.orderId} is now ${cancelledOrder.status}`,
    });

    await notification.save();

    // 💌 Send email
    await sendOrderStatusEmail(
      cancelledOrder.email,
      cancelledOrder.orderId,
      cancelledOrder.status,
      cancelledOrder.billItems,
      cancelledOrder.total,
      {
        name: cancelledOrder.name,
        address: cancelledOrder.address,
        phoneNumber: cancelledOrder.phoneNumber,
      }
    );

    res.json({ message: "Order cancelled, email and notification sent" });
  } catch (err) {
    console.error("Error in cancelOrder:", err);
    res.status(500).json({ message: "Error cancelling order" });
  }
}
