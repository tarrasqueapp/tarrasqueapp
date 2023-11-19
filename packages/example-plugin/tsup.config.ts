import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.tsx'],
  dts: true,
  sourcemap: true,
  format: ['cjs'],
  minify: !options.watch,
  target: 'es5',
  external: ['react', 'react-dom', '@tarrasque/sdk'],
}));
