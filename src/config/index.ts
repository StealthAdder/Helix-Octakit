/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';
dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV!,
  APP_PRIVATE_KEY: process.env.APP_PRIVATE_KEY!,
  APP_ID: process.env.APP_ID!,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET!,
  BASE_REF: 'refs/heads/staging',
  RESTRICTED_BRANCHES: ['development', 'staging', 'main', 'master']
}

export default config;