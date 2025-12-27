/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  [key: string]: any;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

