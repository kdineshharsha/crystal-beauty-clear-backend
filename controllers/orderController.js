import Order from "../models/order.js";

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
    };

    const lastBill = await Order.findOne().sort({ date: -1 });

    if (!lastBill) {
      orderData.orderId = "ORD0001";
    } else {
      const lastOrderNumber = parseInt(lastBill.orderId.replace("ORD", ""), 10);
      const newOrderNumberStr = (lastOrderNumber + 1)
        .toString()
        .padStart(4, "0");
      orderData.orderId = "ORD" + newOrderNumberStr;
    }

    const order = new Order(orderData);
    await order.save();

    res.json({ message: "Order saved successfully" });
  } catch (error) {
    console.error(error);
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
