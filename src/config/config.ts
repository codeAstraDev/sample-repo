import { config as conf } from "dotenv";
conf();

const _conf = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};

export const config = Object.freeze(_conf);
