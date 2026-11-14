// /** @type {import('next').NextConfig} */
// const config = {};

// export default config;

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    // Las pruebas e2e levantan su propio servidor en otra carpeta para no chocar con `pnpm dev`.
    distDir: process.env.NEXT_DIST_DIR || '.next',
    // reactStricMode: false,
    // Otras configuraciones que necesites
  };
  
  export default config;
  