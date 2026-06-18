/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/types/**',
        'src/components/**',
        'src/App.tsx',
        'src/context/**',
        'src/db/**',
        '*.config.*',
      ],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 85,
        lines: 90,
      },
    },
  },
});
