import { InferSchemaType, Schema, Types, model, HydratedDocument } from 'mongoose';

const TokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export type TokenType = InferSchemaType<typeof TokenSchema>;
export type TokenDocument = HydratedDocument<TokenType>;

export default model<TokenType>('Token', TokenSchema);
