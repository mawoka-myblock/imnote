import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true
		})
		/*
		vite: {
			optimizeDeps: {
				include: ['@uppy/compressor', '@uppy/core', '@uppy/svelte', '@uppy/xhr-upload']
			}
		}
		*/
	}
};

export default config;
