import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);