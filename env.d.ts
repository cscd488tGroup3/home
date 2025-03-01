/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly API_KEY: string;
  readonly USR_DB: string;
  readonly USR_DB_W: string;
  readonly USR_DB_W_ADMIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface DBConfig {
  DB: string;
  DBW: string;
  DBWA: string;
}

declare global {
  interface Window {
    dbConfig: DBConfig;
  }
}

export {};
