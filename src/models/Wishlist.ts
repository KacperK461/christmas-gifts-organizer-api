import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

const wishlistSchema = new Schema(
  {
    event: {
      type: Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
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
              required: true,
            },
            amount: {
              type: Number,
              required: true,
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

export type wishlistType = InferSchemaType<typeof wishlistSchema>;
export type wishlistDocument = HydratedDocument<Omit<wishlistType, 'products'>> & {
  products: Array<{ id?: any; _id?: Types.ObjectId } & wishlistType['products'][0]>;
};

export default model<wishlistType>('Wishlist', wishlistSchema);
