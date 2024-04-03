const { Schema, default: mongoose } = require("mongoose"); 


const ProductSchema = new mongoose.Schema({
  title: {type:String, required:true},
  description:  { type: String, required: true },
  price: {type: Number, required: true}
});


const productModel =mongoose.models.products || mongoose.model('products', ProductSchema);
export default productModel;


