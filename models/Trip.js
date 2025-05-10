import { Schema, model } from 'mongoose';

const tripSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

export default model('Trip', tripSchema);