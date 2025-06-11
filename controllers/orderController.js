import Order from "../models/order.js";
import Product from "../models/product.js";
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

    for (let i = 0; i < body.billItems.length; i++) {
      const product = await Product.findOne({
        productId: body.billItems[i].productId,
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      orderData.billItems[i] = {
        productId: product.productId,
        productName: product.name,
        image: product.image[0],
        quantity: body.billItems[i].quantity,
        price: product.price,
      };
      orderData.total += product.price * body.billItems[i].quantity;
    }

    const order = new Order(orderData);
    await order.save();
    console.log(order);
    console.log(orderData);

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

export async function updateOrder(req, res) {
  try {
    if (req.user == null) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (req.user.role != "admin") {
      res.status(403).json({
        message: "You are not authorized to update an order",
      });
      return;
    }

    const orderId = req.params.orderId;
    const order = await Order.findOneAndUpdate({ orderId: orderId }, req.body);

    res.json({
      message: "Order updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Order not updated",
    });
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
