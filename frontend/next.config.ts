import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false
};
module.exports = withPWA(nextConfig);

export default withFlowbiteReact(nextConfig);