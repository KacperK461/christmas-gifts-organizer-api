import { Schema, model, InferSchemaType, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import configVariables from '../config/variables';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must be provided.'],
    },
    email: {
      type: String,
      required: [true, 'Email must be provided.'],
      unique: true,
      validate: {
        validator: validator.isEmail as (str: string) => boolean,
        message: 'Please provide valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Password must be provided.'],
      minLength: [8, 'Password must be at least 8 characters long.'],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const salt = await bcrypt.genSalt(configVariables.saltWorkFactor);
  this.password = await bcrypt.hash(this.password, salt);

  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type User = InferSchemaType<typeof userSchema>;
export type UserModel = Model<User, {}, IUserMethods>;

export default model<User, UserModel>('User', userSchema);
