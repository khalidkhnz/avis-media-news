import mongoose, { Schema } from "mongoose";

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
});

export default mongoose.model<any>("categories", CategorySchema);
