import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

const EventSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    group: {
      type: Types.ObjectId,
      ref: 'Group',
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true }
);

export type EventType = InferSchemaType<typeof EventSchema> & { createdAt: Date; updatedAt: Date };
export type EventDocument = HydratedDocument<EventType>;

export default model<EventType>('Event', EventSchema);
