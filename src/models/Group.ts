import { HydratedDocument, InferSchemaType, Schema, Types, model } from 'mongoose';

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    accessLink: {
      type: String,
      required: true,
    },
    members: [
      {
        user: {
          type: Types.ObjectId,
          ref: 'User',
          required: true,
        },
        isAdmin: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export type GroupType = InferSchemaType<typeof GroupSchema> & { createdAt: Date; updatedAt: Date };
export type GroupDocument = HydratedDocument<GroupType>;

export default model<GroupType>('Group', GroupSchema);
