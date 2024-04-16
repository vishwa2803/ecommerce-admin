import mongooseConnect from "@/lib/mongoose";
import orderModel from "@/models/Order";

export default async function handler(req,res){
    await mongooseConnect();
    res.json(await orderModel.find().sort({createdAt:-1}));
}