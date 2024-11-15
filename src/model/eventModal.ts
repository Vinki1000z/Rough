import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  completionDate: Date | undefined;
  status: string;
  userId:  mongoose.Schema.Types.ObjectId;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  completionDate: { type: Date },
  status: { type: String, default: 'pending' },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Ensure this is correct and matches the User model
  },
});

// Check if the model already exists in the mongoose models registry
const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
