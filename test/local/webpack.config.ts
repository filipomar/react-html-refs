import 'dotenv/config';
import Dotenv from 'dotenv-webpack';
import { realpathSync } from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration as WebpackConfiguration, DefinePlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

// App directory
const appDirectory = realpathSync(process.cwd());

// Gets absolute path of file within app directory
const resolveAppPath = (relativePath: string): string => resolve(appDirectory, relativePath);

const devServer: WebpackDevServerConfiguration = {
	contentBase: resolveAppPath('public'),
	compress: true,
	hot: true,
	host: "0.0.0.0",
	disableHostCheck: true,
	port: 8081,
};

const configuration: WebpackConfiguration = {
	mode: "development",
	devtool: 'source-map',

	// Entry point of app
	entry: './test/local/index.tsx',

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
	},
	output: {
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				use: [
					{
						loader: 'ts-loader',
						options: { transpileOnly: false },
					},
				],
				exclude: resolveAppPath('node_modules'),
				include: [resolveAppPath('test')],
			},
			{
				test: /\.js(x?)$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env']],
					},
				},
			},
		],
	},
	devServer,
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: resolveAppPath('./test/local/index.html'),
		}),

		new Dotenv(),
		new DefinePlugin({}),
	],
};

export default configuration;
