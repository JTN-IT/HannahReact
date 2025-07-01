import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdPlugin from 'vite-plugin-markdown';

export default defineConfig({
  plugins: [
    react(),
    mdPlugin.plugin({ mode: ['html', 'toc', 'react'] })
  ]
});