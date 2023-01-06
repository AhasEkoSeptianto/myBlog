/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MONGODB: process.env.NEXT_PUBLIC_MONGODB,
    NEXT_PUBLIC_JWTTOKEN: process.env.NEXT_PUBLIC_JWTTOKEN,
  }
}

module.exports = nextConfig
