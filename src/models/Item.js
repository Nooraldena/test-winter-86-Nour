import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  username: { type: String, required: true },
  count: { type: Number, default: 0 },
  Like: { type: Number, default: 0 },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
