import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String},
    address: { type: String, required: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    creator: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Place", placeSchema);
