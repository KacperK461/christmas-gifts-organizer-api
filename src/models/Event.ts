import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    group: {
      type: Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export type EventType = InferSchemaType<typeof EventSchema>;
export type EventDocument = HydratedDocument<EventType>;

export default model<EventType>('Event', EventSchema);
