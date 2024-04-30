import mongooseConnect from "@/lib/mongoose";
import categoryModel from "@/models/Category";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
await isAdminRequest(req,res);
  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    try {
      let parentCategoryId = null;
      if (parentCategory && mongoose.isValidObjectId(parentCategory)) {
        parentCategoryId = parentCategory;
      }
      const categoryDoc = await categoryModel.create({
        name,
        parent: parentCategoryId,
        properties,
      });

      res.json(categoryDoc);
    } catch (error) {
      console.error("Error while creating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  if (method === "GET") {
    res.json(await categoryModel.find().populate("parent"));
  }
  if (method === "PUT") {
    try {
      const { name, parentCategory, properties, _id } = req.body;
  
      const updateObject = {
        name,
        properties,
      };
  
      if (parentCategory !== "") {
        updateObject.parent = parentCategory;
      }
      else {
        updateObject.parent = null;
      }
  
      const categoryDoc = await categoryModel.updateOne(
        { _id },
        updateObject
      );
  
      res.json(categoryDoc);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  }
  

  if (method === "DELETE") {
    const { _id } = req.query;
    await categoryModel.deleteOne({ _id });
    res.json("delete");
  }
}
