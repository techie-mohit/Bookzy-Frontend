import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains:['images.unsplash.com','media.istockphoto.com', 'cdn.pixabay.com', 'images.pexels.com', 'res.cloudinary.com'],
  }
};

export default nextConfig;
