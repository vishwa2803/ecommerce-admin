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
    try {
      await upload.array('images')(req, res, async (err) => {
        if (err) {
          console.error('Error uploading images:', err);
          res.status(500).json({ error: 'Error uploading images' });
          return;
        }
        
        const { title, category, description, price, properties, id } = req.body;
        const images = req.files.map((file) => `/uploads/${file.originalname}`);
  
        // Construct the update object
        const updateObject = {
          title,
          description,
          price,
          images,
          properties,
          category
        };
  
        // Update the product
        const updatedProduct = await productModel.findOneAndUpdate(
          { id },
          updateObject,
          { new: true } // Return the updated document
        );
  
        if (!updatedProduct) {
          // Handle case where no document was found with the given _id
          res.status(404).json({ error: 'Product not found' });
          return;
        }
  
        res.json(updatedProduct);
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Error updating product' });
    }
  }
  
  if (method === "DELETE") {
    if (req.query?.id) {
      await productModel.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
