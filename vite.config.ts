import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
	resolve: {
		alias: {
			components: path.resolve('./src/components'),
			'ui-components': path.resolve('./src/ui-components'),
			declarations: path.resolve('./src/declarations'),
			pages: path.resolve('./src/pages'),
			api: path.resolve('./src/api'),
			lib: path.resolve('./src/lib')
		}
	},
	plugins: [
		react(),
		NodeGlobalsPolyfillPlugin({
			buffer: true,
			process: true
		})
	],
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			}
		}
	},
	define: {
		'process.env': {}
	},
	build: {
		minify: true,
		rollupOptions: {
			plugins: [
				inject({
					modules: { Buffer: ['buffer', 'Buffer'] }
				})
			]
		}
	},
	server: {
		port: 3000
	}
});
