import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String, required: true },
  tags: { type: [String], required: true },
  posted: { type: Date, default: Date.now },
  description: { type: String, required: true },
  requirements: { type: [String], required: true }
});

export const JobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);
