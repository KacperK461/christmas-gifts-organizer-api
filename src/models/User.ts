import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name must be provided'],
    },
    email: {
      type: String,
      required: [true, 'Email must be provided'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password must be provided'],
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', userSchema);
