import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  candidateLinkedin: { type: String, required: true },
  candidateResume: { type: String }, // TODO: add resume file upload
  candidateCoverLetter: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobTitle: { type: String, required: true },
  jobCompany: { type: String, required: true },
  role: { type: String, required: true },
  aiScore: { type: Number, required: true },
  status: {
    type: String,
    enum: ["SUBMITTED", "REVIEW", "SHORTLIST", "INTERVIEW", "REJECTED"],
    required: true,
  },
  appliedDate: { type: Date, default: Date.now },
  coverLetter: { type: String },
});

export const ApplicationModel =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
