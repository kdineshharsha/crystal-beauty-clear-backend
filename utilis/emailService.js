import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOrderStatusEmail = async (
  to,
  orderId,
  status,
  orderItems = [],
  total = 0,
  customerInfo = {} // name, address, phoneNumber
) => {
  const productRows = orderItems
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px; vertical-align: middle;">
            <img src="${item.image}" alt="${
        item.productName
      }" width="60" height="60" style="border-radius: 8px; object-fit: cover; margin-right: 10px;" />
          </td>
          <td style="padding: 10px; vertical-align: middle;">
            <strong>${item.productName}</strong><br/>
            Qty: ${item.quantity}
          </td>
          <td style="padding: 10px; vertical-align: middle; text-align: right;">
            Rs.${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  const { name, address, phoneNumber } = customerInfo;

  const mailOptions = {
    from: '"Crystal Beauty Clear" <dineshharsha182@gmail.com>',
    to,
    subject: `Update on your order #${orderId}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background: #f9f9f9; padding: 10px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #e91e63; text-align: center;">💌 Crystal Beauty Clear</h2>
          <p style="font-size: 16px;">Hi <strong>${
            name || "there"
          }</strong>,</p>
          <p style="font-size: 16px;">Your order <strong>#${orderId}</strong> is now <span style="color: green; font-weight: bold; text-transform: capitalize;">${status}</span>.</p>

          <h3 style="margin-top: 30px; font-size: 18px; color: #333;">📦 Shipping Details</h3>
          <p style="font-size: 14px; line-height: 1.6;">
            <strong>Name:</strong> ${name || "-"}<br/>
            <strong>Address:</strong> ${address || "-"}<br/>
            <strong>Phone:</strong> ${phoneNumber || "-"}
          </p>

          <h3 style="margin-top: 30px; font-size: 18px; color: #333;">🛍️ Order Summary</h3>
          <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
            <thead>
              <tr style="background: #f3f3f3;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px;">Details</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
              <tr>
                <td colspan="2" style="padding-top: 20px; font-weight: bold; text-align: right;">Grand Total:</td>
                <td style="padding-top: 20px; font-weight: bold; text-align: right;">Rs.${total.toFixed(
                  2
                )}</td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 30px; font-size: 15px;">Thank you for choosing Crystal Beauty Clear 💖<br/>We’re so excited to be part of your beauty journey ✨</p>

          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: gray; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};
