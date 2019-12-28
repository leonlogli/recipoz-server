/* eslint-disable @typescript-eslint/camelcase */
import dotenv from 'dotenv'
import logger from './logger'

logger.debug('Using .env file to supply config environment variables')
dotenv.config()

const {
  JWT_SECRET,
  JWT_EXPIRATION,
  APP_DEFAULT_LANGUAGE,
  NODE_ENV
} = process.env

/** Default items number per page */
const DEFAULT_PAGE_SIZE = Number(process.env.DEFAULT_PAGE_SIZE)

/** Indicates whether to use mongoose in-memory databse for test instead of real database */
const USE_MEMORY_TEST_DB = process.env.USE_MEMORY_TEST_DB === 'true'

/** Indicates whether NODE_ENV is test */
const TEST_ENV = NODE_ENV === 'test'

/** Indicates whether NODE_ENV is production */
const PROD_ENV = NODE_ENV === 'production'

/** Indicates whether NODE_ENV is development */
const DEV_ENV = NODE_ENV === 'development'

const PORT = TEST_ENV ? process.env.TEST_PORT : process.env.PORT

/** Mongo db config */
const MONGO = {
  URI: (TEST_ENV
    ? process.env.MONGO_URI_TESTS
    : process.env.MONGO_URI) as string
}

/** Firebase configs */
const FIREBASE = {
  /** Firebase database url */
  DB_URL: process.env.FIREBASE_DB_URL,
  /** Firebase service account configs */
  SERVICE_ACCOUNT: {
    type: process.env.FIREBASE_SERVICE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CRT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }
}

/** JWT configs */
const JWT = {
  /** jwt secret or key */
  SECRET: JWT_SECRET as string,
  /** jwt expiration */
  EXPIRATION: JWT_EXPIRATION
}

export {
  /** Node process env */
  NODE_ENV,
  PORT,
  JWT,
  TEST_ENV,
  PROD_ENV,
  DEV_ENV,
  /** App default language */
  APP_DEFAULT_LANGUAGE,
  USE_MEMORY_TEST_DB,
  DEFAULT_PAGE_SIZE,
  MONGO,
  FIREBASE
}
