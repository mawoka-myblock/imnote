const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import');

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer,
		atImport()
	]
};

module.exports = config;
