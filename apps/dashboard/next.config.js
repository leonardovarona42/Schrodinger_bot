/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@schrodinger/shared", "@schrodinger/database", "@schrodinger/auth"],
}

module.exports = nextConfig
