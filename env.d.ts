/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly API_KEY: string;
  readonly USR_DB: string;
  readonly USR_DB_W: string;
  readonly USR_DB_W_ADMIN: string;
  readonly USR_SESSION: string;
  readonly USR_POST: string;
  readonly TREFLE_API_KEY: string;
  readonly RAPIDAPI_KEY: string;
  readonly PERENUAL_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface DBConfig {
  USR_DB: string;
  USR_DB_W: string;
  USR_DB_W_ADMIN: string;
}

declare global {
  interface Window {
    dbConfig: DBConfig;
  }

  namespace App {
    interface Locals {
      session: import("./pages/api/authenticate").Session | null;
      user: import("./pages/api/authenticate").User | null;
    }
  }
}

export {};
