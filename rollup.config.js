import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/openscale-card.ts',
  output: {
    file: 'openscale-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [resolve(), typescript(), terser()],
};
