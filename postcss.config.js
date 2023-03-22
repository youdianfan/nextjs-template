module.exports = {
	plugins: {
		'postcss-pxtorem': {
			rootValue: 39,
			unitPrecision: 8,
			propList: ["*"],
			selectorBlackList: [/^\.html/], //排除html样式
			replace: true,
			mediaQuery: false,
			minPixelValue: 2,
			exclude: /node_modules/
		},
		'autoprefixer': {
			overrideBrowserslist: [
				'> 1%',
				'last 2 versions',
				'not dead',
			],
			grid: true
		},
	}
}
