const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
	plugins: [
		{
			plugin: {
				overrideCracoConfig: ({ cracoConfig }) => {
					if (typeof cracoConfig.eslint.enable !== 'undefined') {
						cracoConfig.disableEslint = !cracoConfig.eslint.enable;
					}

					delete cracoConfig.eslint;

					return cracoConfig;
				},
				overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
					return {
						...webpackConfig,
						devtool: 'source-map',
						mode: isDevelopment ? 'development' : 'production',
						plugins: [
							...webpackConfig.plugins,
							new webpack.ProvidePlugin({
								Buffer: [require.resolve('buffer/'), 'Buffer']
							}),
							new webpack.EnvironmentPlugin({
								NODE_ENV: 'development',
								II_URL: isDevelopment
									? 'http://localhost:8000?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai#authorize'
									: 'https://identity.ic0.app/#authorize'
								// II_URL: 'https://identity.ic0.app/#authorize'
							})
						],
						resolve: {
							...webpackConfig.resolve,
							extensions: [...webpackConfig.resolve.extensions, '.tsx', '.ts', '.js'],
							plugins: [
								...webpackConfig.resolve.plugins.filter(t => {
									// Removes ModuleScopePlugin
									return !Object.keys(t).includes('appSrcs');
								})
							]
						}
					};
				}
			}
		}
	]
};
