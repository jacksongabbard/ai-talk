import dotenv from 'dotenv';
import { hasOwnProperty } from '../../lib/hasOwnProperty';

const config = dotenv.config().parsed;

function getDotEnv() {
  if (
    config &&
    typeof config === 'object' &&
    hasOwnProperty(config, 'AES_KEY') &&
    typeof config.AES_KEY === 'string'
  ) {
    return {
      AES_KEY: config.AES_KEY,
    };
  }
  throw new Error('Invalid .env file');
}

export default getDotEnv;
