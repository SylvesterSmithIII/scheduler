// models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    fileNumber: { type: String, required: true },
    closingDate: { type: Date, required: true },
    sellingAgent: { type: String, required: true },
    listingAgent: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String },
    actions: [
      {
        action: { type: String, required: true },
        status: { type: String, enum: ["Unstarted", "Started", "Completed"], default: "Unstarted" },
        notes: { type: String }
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
export default Transaction;