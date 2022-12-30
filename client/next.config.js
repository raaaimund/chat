/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}
const withPWA = require('next-pwa')({
    dest: 'public',
    runtimeCaching: require('./pwa-cache.config.js'),
})
module.exports = withPWA(nextConfig)
