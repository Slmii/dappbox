import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

let localCanisters, prodCanisters, canisters;

let localEnv = true;
let dfxNetwork = 'local';

function initCanisterIds() {
	try {
		localCanisters = require(path.resolve('.dfx', 'local', 'canister_ids.json'));
	} catch (error) {
		console.log('No local canister_ids.json found. Continuing production');
	}

	try {
		prodCanisters = require(path.resolve('canister_ids.json'));
		localEnv = false;
	} catch (error) {
		console.log('No production canister_ids.json found. Continuing with local');
	}

	dfxNetwork = 'ic'; // process.env.NODE_ENV === 'production' && !localEnv ? 'ic' : 'local';

	canisters = dfxNetwork === 'local' || localEnv ? localCanisters : prodCanisters;
}

const isDevelopment = process.env.NODE_ENV !== 'production' || localEnv;

initCanisterIds();

// Generate canister ids, required by the generated canister code in .dfx/local/canisters/*
const canisterDefinitions = Object.entries(canisters).reduce(
	(acc, [key, val]) => ({
		...acc,
		[`process.env.${key.toUpperCase()}_CANISTER_ID`]: JSON.stringify((val as any).ic)
	}),
	{}
);

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
	plugins: [react()],
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			}
		}
	},
	define: {
		...canisterDefinitions,
		'process.env.DFX_NETWORK': dfxNetwork,
		'process.env.NODE_ENV': isDevelopment
	},
	server: {
		port: 3000
	}
});
