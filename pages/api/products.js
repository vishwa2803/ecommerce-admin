// import mongooseConnect from "@/lib/mongoose";
// import { Product } from "@/models/Product";

// export async function handle(req,res){
// const {method} = req ;
// await mongooseConnect();
// if(method === 'POST'){
//     const {title, description, price} = req.body;
//     const productDoc = Product.create({
//         title, description, price
//     })
//     res.json(productDoc);
// }
// }


import mongooseConnect from "@/lib/mongoose";
import productModel from "@/models/Product";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  

if(method === 'GET') {
  if(req.query?.id){
    res.json(await productModel.findOne({_id:req.query.id}));
  } else {
  res.json(await productModel.find());
  }
}

  if (method === 'POST') {
    
      const { title, description, price } = req.body;
      const productDoc = await productModel.create({
        title,
        description,
        price
      });
      res.json(productDoc);
    } 

  if( method === 'PUT') {
    const { title, description, price, _id } = req.body;
    await productModel.updateOne({_id}, {title, description, price});
    res.json(true);
  }

  if(method === 'DELETE') {
    if(req.query?.id){
      await productModel.deleteOne({_id:req.query?.id});
      res.json(true);

    }

  }
}


