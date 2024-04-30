import mongooseConnect from "@/lib/mongoose";
import categoryModel from "@/models/Category";

export default async function handler(req, res) {
    await mongooseConnect();

  try {
    const count = await categoryModel.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching product count" });
  }
}
