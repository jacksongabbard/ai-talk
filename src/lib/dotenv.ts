import dotenv from 'dotenv';
import { hasOwnProperty } from './hasOwnProperty';

const config = dotenv.config().parsed;

// This is a type-preserving assert
function assertHasKey(config: object, keyName: string) {
  if (hasOwnProperty(config, keyName)) {
    return true;
  } else {
    throw new Error(`Config is missing key "${keyName}".`);
  }
}

function getDotEnv() {
  try {
    if (!config || typeof config !== 'object') {
      throw new Error('no .env configuration found');
    }

    if (
      assertHasKey(config, 'AES_KEY') &&
      assertHasKey(config, 'SERVER_HOST') &&
      assertHasKey(config, 'SERVER_PORT') &&
      assertHasKey(config, 'POSTGRES_HOST') &&
      assertHasKey(config, 'POSTGRES_PORT') &&
      assertHasKey(config, 'POSTGRES_USER') &&
      assertHasKey(config, 'POSTGRES_PASSWORD') &&
      assertHasKey(config, 'POSTGRES_DB')
    ) {
      const { SERVER_PORT, POSTGRES_PORT } = config;
      if (!SERVER_PORT.match(/^\d{4,}$/)) {
        throw new Error(
          'invalid SERVER_PORT: should be a positive integer value over 8000',
        );
      }

      if (!POSTGRES_PORT.match(/^\d{4,}$/)) {
        throw new Error(
          'invalid POSTGRES_PORT: should be a positive integer value (usually 5432)',
        );
      }

      // If there is other junk in the config, we exclude it from the extracted
      // configuration.  This is a preventative measure against silly security
      // vulnerability caused by crufty old, undocmunted config stuff lingering
      // in the system.
      return {
        AES_KEY: config.AES_KEY,
        SERVER_HOST: config.SERVER_HOST,
        SERVER_PORT,
        POSTGRES_HOST: config.POSTGRES_HOST,
        POSTGRES_PORT: config.POSTGRES_PORT,
        POSTGRES_USER: config.POSTGRES_USER,
        POSTGRES_PASSWORD: config.POSTGRES_PASSWORD,
        POSTGRES_DB: config.POSTGRES_DB,
      };
    }

    throw new Error('invalid configuration');
  } catch (e) {
    let msg = 'unknown error';
    if (e && hasOwnProperty(e, 'message') && typeof e.message === 'string') {
      msg = e.message;
    } else if (e) {
      // This is ugly, but meh. All of this code is just here to be
      // developer friendly.
      msg = JSON.stringify(e);
    }
    throw new Error('invalid .env file: ' + msg);
  }
}

export default getDotEnv;
