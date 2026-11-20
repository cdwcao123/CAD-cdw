import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig, mergeConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { createMcHostPreset } from './src/utils/mcHostPreset.mjs';

export default defineConfig(({ command }) => {
  const hostPreset = createMcHostPreset({
    appRoot: fileURLToPath(new URL('.', import.meta.url)),
    distRootRelative: './public',
    outDirRelative: './dist',
    isBuild: command === 'build',
  });

  return mergeConfig(hostPreset, {
    base: './',
    publicDir: false,
    plugins: [
      vue(),
      viteStaticCopy({
        targets: [
          { src: 'public/lib/*', dest: 'lib' },
          { src: 'public/packages.json', dest: '.' },
          { src: 'public/menuConfig.js', dest: '.' },
          { src: 'public/config.js', dest: '.' },
        ],
      }),
    ],
    resolve: { 
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
     },
    build: { 
      copyPublicDir: false,
    },
    server: { 
      open: false, 
      host: '127.0.0.1', 
      port: 5188, 
      strictPort: true
     },
  });
});
