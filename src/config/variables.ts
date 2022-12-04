import dotenv from 'dotenv';
dotenv.config();

export interface IVariables {
  port: number;
  mongoUrl: string;
  saltWorkFactor: number;
}

const variables: IVariables = {
  port: Number(process.env.PORT) || 5000,
  mongoUrl: process.env.MONGO_URL || '',
  saltWorkFactor: 10,
};

export default variables;
