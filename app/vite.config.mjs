import { fileURLToPath, URL } from 'node:url';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import removeConsole from 'vite-plugin-remove-console';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        optimizeDeps: {
            noDiscovery: true,
            include: ['frappe-gantt']
        },
        plugins: [
            vue(),
            commonjs(),
            removeConsole({
                includes: ['log', 'warn', 'error', 'info'],
                custom: ['debugger', 'console.log()', 'console.error()', 'console.warn()', 'console.info()', 'console.debug()', 'console.clear()']
            }),
            Components({
                resolvers: [PrimeVueResolver()]
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                'frappe-gantt': 'node_modules/frappe-gantt/dist/frappe-gantt.es.js'
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler', // or "modern"
                    silenceDeprecations: ['legacy-js-api']
                }
            }
        },
        esbuild: {
            drop: mode === 'production' ? ['console', 'debugger'] : [],
            pure: mode === 'production' ? ['console.log'] : []
        },
        build: { sourcemap: true }
    };
});
