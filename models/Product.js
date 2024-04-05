const { Schema, default: mongoose } = require("mongoose"); 

const Id = mongoose.Schema.Types.ObjectId;
const ProductSchema = new mongoose.Schema({
  title: {type:String, required:true},
  description:  { type: String, required: true },
  category: {type: Id ,ref: 'productModel', required: true},
  price: {type: Number, required: true},

  images: [{ type: String }],
  properties: {type: Object},
})


const productModel =mongoose.models.products || mongoose.model('products', ProductSchema);
export default productModel;


