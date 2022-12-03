import dotenv from 'dotenv';
dotenv.config();

interface iVariables {
  port: number;
  mongoUrl: string;
}

const variables: iVariables = {
  port: Number(process.env.PORT) || 5000,
  mongoUrl: process.env.MONGO_URL || '',
};

export default variables;
