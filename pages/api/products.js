import mongooseConnect from "@/lib/mongoose";
import productModel from "@/models/Product";
import multer from "multer";
import { isAdminRequest } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await productModel.findOne({ _id: req.query.id }));
    } else {
      res.json(await productModel.find());
    }
  }
  if (method === "POST") {
    await upload.array('images')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading images:', err);
        res.status(500).json({ error: 'Error uploading images' });
        return;
      }

      const { title, category, description, price, properties } = req.body;
      
    
      const images = req.files.map((file) => `/uploads/${file.originalname}`);
      const productDoc = await productModel.create({
        title,
        category,
        description,
        price,
        images,
        properties,
      });
      res.status(200).json(productDoc);
    });
  }

  if (method === "PUT") {
    await upload.array('images')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading images:', err);
        res.status(500).json({ error: 'Error uploading images' });
        return;
      }

      const { title, category, description, price, properties, _id} = req.body;
      const images = req.files
        ? req.files.map((file) => `/uploads/${file.originalname}`)
        : undefined;
      const updatedProduct = await productModel.updateOne(
        {_id},
        { title, category, description, price, images ,properties },
      );

      res.json(updatedProduct);

      
    })
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await productModel.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
