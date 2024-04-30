import mongooseConnect from "@/lib/mongoose";
import orderModel from "@/models/Order";


export default async function handler(req, res) {
    await mongooseConnect();

  try {
    const count = await orderModel.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching product count" });
  }
}
