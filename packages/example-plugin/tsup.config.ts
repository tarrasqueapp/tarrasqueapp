import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.tsx'],
  dts: true,
  sourcemap: true,
  format: ['cjs', 'esm'],
  minify: !options.watch,
  target: 'es5',
  external: ['react', '@tarrasque/sdk', '@mui/material', '@mui/icons-material'],
}));
