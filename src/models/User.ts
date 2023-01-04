import { Schema, model, InferSchemaType, Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import configVariables from '../config/variables';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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

export type UserType = InferSchemaType<typeof userSchema> & { createdAt: Date; updatedAt: Date };
export type UserModel = Model<UserType, {}, IUserMethods>;
export type UserDocument = HydratedDocument<UserType>;

export default model<UserType, UserModel>('User', userSchema);
