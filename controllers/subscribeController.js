import Subscriber from "../models/subscriber.js";
import nodemailer from "nodemailer";
export async function subscribe(req, res) {
  try {
    const { email } = req.body;
    console.log("Received subscription request:", email);
    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if the email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    // Create a new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res
      .status(201)
      .json({ message: "Subscription successful", subscriber: newSubscriber });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSubscribers(req, res) {
  try {
    const subscribers = await Subscriber.find(
      {},
      { email: 1, subscribedAt: 1 }
    );
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function sendNewsLetter(req, res) {
  const { subject, message } = req.body;

  try {
    const subscribers = await Subscriber.find({});
    const emails = subscribers.map((s) => s.email);

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

    const mailOptions = {
      from: `"Crystal Beauty Clear" <${process.env.EMAIL}>`,
      bcc: emails,
      subject,
      html: `<p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Newsletter sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Sending failed" });
  }
}
