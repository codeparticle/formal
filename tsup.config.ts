import { defineConfig } from 'tsup'

const baseConfig: object = {
  bundle: true,
  clean: true,
  entry: [`src/**/*`],
  format: [`cjs`, `esm`],
  minify: false,
  name: `build`,
  platform: `browser`,
  skipNodeModulesBundle: false,
  sourcemap: true,
  splitting: true,
  silent: true,
  tsconfig: `./tsconfig.json`,
  dts: {
    resolve: true,
  },
}

export default defineConfig(baseConfig)
