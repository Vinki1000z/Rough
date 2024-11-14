import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  completionDate: Date | undefined;
  status: string;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  completionDate: { type: Date },
  status: { type: String, default: 'pending' },
});

// Check if the model already exists in the mongoose models registry
const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
