const { Schema, default: mongoose } = require("mongoose");

const Id = mongoose.Schema.Types.ObjectId;

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: Id, ref: "category", required: false },
  properties: [{ type: Object }],
});

const categoryModel =
  mongoose.models.category || mongoose.model("category", CategorySchema);
export default categoryModel;
