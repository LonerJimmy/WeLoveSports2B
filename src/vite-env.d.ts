/// <reference types="vite/client" />

declare module '*.scss' {
  const content: { className: string }
  export default content
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
