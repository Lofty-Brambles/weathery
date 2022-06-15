const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
		assetModuleFilename: "assets/[name][ext]",
		clean: true
	},
	plugins: [
		new HtmlWebpackPlugin(
			{
				title: "To-do!",
				meta: {
					viewport: "width=device-width, initial-scale=1, shrink-to-fit=no"
				}
			}
		)
	],
	module: {
		rules: [
			{
				test: /\.(svg|png|gif|webp|jpe?g)/i,
				type: "asset/resource"
			}
		]
	}
}