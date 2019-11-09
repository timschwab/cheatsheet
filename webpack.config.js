const {VueLoaderPlugin} = require('vue-loader')
const path = require('path')

module.exports = {
	target: 'electron-renderer',
	mode: 'production',
	entry: ['./src/client/app.js'],
	output: {
		path: path.resolve(__dirname, './src/client/dist')
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader'
			}
		]
	},
	plugins: [new VueLoaderPlugin()]
}
