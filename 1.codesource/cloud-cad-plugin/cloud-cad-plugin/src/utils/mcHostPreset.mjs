import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const normalizePath = (value) => value.replace(/\\/g, '/');

const SINGLETON_EXTERNALS = [
  'McCore',
  'McEditor',
  'vue',
  'element-plus',
  '@element-plus/icons-vue',
];

/**
 * 沿用 standardCAD 的静态资源复制、开发路径映射和生产 import map 配置。
 * @param {import('./mcHostPreset.mjs').McHostPresetOptions} options 项目路径、资源路径和构建模式。
 * @returns {import('vite').UserConfig} 可与页面配置合并的 SDK 宿主配置。
 * @throws npm 框架入口缺失时抛出文件读取错误。
 */
export const createMcHostPreset = (options) => {
  const distRootRelative = options.distRootRelative ?? '../../dist';
  const outputDirName = options.outputDirName ?? 'app';
  const outDirRelative = options.outDirRelative ?? `${distRootRelative}/${outputDirName}`;
  const injectImportMap = options.injectImportMap ?? true;
  const workspaceDistPath = normalizePath(resolve(options.appRoot, distRootRelative));
  const packageDistPath = `${workspaceDistPath}/package`;
  const coreDistPath = `${workspaceDistPath}/core`;
  const editorDistPath = `${workspaceDistPath}/editor`;
  const vendorVuePath = normalizePath(realpathSync(resolve(options.appRoot, 'node_modules/vue/dist/vue.runtime.esm-browser.prod.js')));
  const vendorElementPlusPath = normalizePath(realpathSync(resolve(options.appRoot, 'node_modules/element-plus/dist/index.full.min.mjs')));
  const vendorIconsPath = normalizePath(realpathSync(resolve(options.appRoot, 'node_modules/@element-plus/icons-vue/dist/index.js')));

  const runtimeImportMap = options.importMap ?? {
    imports: {
      vue: './vendor/vue.runtime.esm-browser.prod.js',
      'element-plus': './vendor/element-plus/index.full.min.mjs',
      '@element-plus/icons-vue': './vendor/element-plus-icons/index.js',
      McCore: './core/index.js',
      McEditor: './editor/index.js',
    },
  };

  const rewriteRuntimePathsInDevPlugin = {
    name: 'rewrite-runtime-paths-in-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const requestUrl = req.url;
        if (!requestUrl) { next(); return; }

        const [pathname, queryString = ''] = requestUrl.split('?');
        const search = queryString ? `?${queryString}` : '';

        const rewritePrefixToFs = (prefix, absoluteBasePath) => {
          if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
            req.url = `/@fs/${absoluteBasePath}${pathname.slice(prefix.length)}${search}`;
            return true;
          }
          return false;
        };

        if (rewritePrefixToFs('/package', packageDistPath)) { next(); return; }
        if (rewritePrefixToFs('/dist', workspaceDistPath)) { next(); return; }
        if (rewritePrefixToFs('/core', coreDistPath)) { next(); return; }
        if (rewritePrefixToFs('/editor', editorDistPath)) { next(); return; }
        next();
      });
    },
  };

  const injectImportMapPlugin = {
    name: 'inject-mc-importmap',
    enforce: 'pre',
    transformIndexHtml(html) {
      if (!injectImportMap || !options.isBuild) return html;
      if (/<script\s+type=["']importmap["']/.test(html)) return html;
      const importMapScript = `<script type="importmap">\n${JSON.stringify(runtimeImportMap, null, 2)}\n</script>`;
      return html.includes('</head>')
        ? html.replace('</head>', `${importMapScript}\n</head>`)
        : `${importMapScript}\n${html}`;
    },
  };

  return {
    plugins: [
      injectImportMapPlugin,
      rewriteRuntimePathsInDevPlugin,
      viteStaticCopy({
        targets: [
          // 整目录复制，保持 app 产物结构与 workspace dist 一致。
          { src: `${workspaceDistPath}/package`, dest: '.', flatten: false },
          { src: `${workspaceDistPath}/core`, dest: '.', flatten: false },
          { src: `${workspaceDistPath}/editor`, dest: '.', flatten: false },
          { src: vendorVuePath, dest: 'vendor' },
          { src: vendorElementPlusPath, dest: 'vendor/element-plus' },
          { src: vendorIconsPath, dest: 'vendor/element-plus-icons' },
        ],
      }),
    ],
    server: {
      open: true,
      port: 5111,
      host: '0.0.0.0',
      fs: { allow: ['.', distRootRelative] },
    },
    build: {
      outDir: resolve(options.appRoot, outDirRelative),
      minify: 'terser',
      rollupOptions: {
        external: SINGLETON_EXTERNALS,
      },
    },
    resolve: {
      dedupe: [
        'vue',
        'element-plus',
        '@element-plus/icons-vue',
      ],
      alias: {
        '@': resolve(options.appRoot, 'src'),
        ...(!options.isBuild ? {
          McCore: resolve(options.appRoot, `${distRootRelative}/core`),
          McEditor: resolve(options.appRoot, `${distRootRelative}/editor`),
        } : {}),
      },
    },
    optimizeDeps: !options.isBuild ? {
      exclude: ['McCore', 'McEditor'],
      include: ['vue', 'element-plus', '@element-plus/icons-vue'],
    } : undefined,
  };
};
