import dotenv from 'dotenv';
dotenv.config();

interface IVariables {
  port: number;
  mongoUrl: string;
}

const variables: IVariables = {
  port: Number(process.env.PORT) || 5000,
  mongoUrl: process.env.MONGO_URL || '',
};

export default variables;
