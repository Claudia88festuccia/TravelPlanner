 import mongoose from "mongoose";

const ItineraryDaySchema = new mongoose.Schema({
  day: Number,
  activities: [String],
});

const TripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  notes: String,
  checklist: [
  {
    item: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
],

  itinerary: [ItineraryDaySchema],
  documents: [String],     
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Trip", TripSchema);
