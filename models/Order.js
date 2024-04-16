const { Schema, default: mongoose } = require("mongoose"); 

const OrderSchema = new mongoose.Schema({
  line_items:Object,
  name:String,
  email:String,
  city:String,
  postalCode:String,
  streetAddress:String,
  country:String,
  paid:Boolean,
}, {
  timestamps: true,
});


const orderModel =mongoose.models?.Order || mongoose.model('Order', OrderSchema);
export default orderModel;


