import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

const wishlistSchema = new Schema(
  {
    event: {
      type: Types.ObjectId,
      ref: 'Event',
      require: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      require: true,
    },
    products: [
      {
        name: {
          type: String,
          require: true,
        },
        price: {
          type: Number,
          require: true,
          set: (v: number) => v * 100,
          get: (v: number) => (v / 100).toFixed(2),
        },
        isClosed: {
          type: Boolean,
          default: false,
        },
        contributions: [
          {
            user: {
              type: Types.ObjectId,
              ref: 'User',
              require: true,
            },
            amount: {
              type: Number,
              require: true,
              set: (v: number) => v * 100,
              get: (v: number) => (v / 100).toFixed(2),
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export type wishlistType = InferSchemaType<typeof wishlistSchema> & { createdAt: Date; updatedAt: Date };
export type wishlistDocument = HydratedDocument<wishlistType>;

export default model<wishlistType>('Wishlist', wishlistSchema);
