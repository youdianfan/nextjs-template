/** @type {import('next').NextConfig} */
const path = require('path')
const { i18n } = require('./next-i18next.config.js')

const nextConfig = {
	i18n,
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	experimental: {
		transpilePackages: ['antd-mobile']
	}
}

module.exports = nextConfig
