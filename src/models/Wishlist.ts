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
          set: (v: number) => Math.round(v * 100),
          get: (v: number) => v / 100,
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
              unique: true,
            },
            amount: {
              type: Number,
              required: true,
              set: (v: number) => Math.round(v * 100),
              get: (v: number) => v / 100,
            },
            outdated: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export type wishlistType = InferSchemaType<typeof wishlistSchema>;
export type wishlistDocument = HydratedDocument<wishlistType>;
export type wishlistDocumentWithIds = HydratedDocument<Omit<wishlistType, 'products'>> & {
  products: Array<{ id?: any; _id?: Types.ObjectId } & wishlistType['products'][0]>;
};

export default model<wishlistType>('Wishlist', wishlistSchema);
