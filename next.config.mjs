/** @type {import("next").NextConfig} */

const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint:{
    ignoreDuringBuilds:true,
  },
  images: {
    domains:['images.unsplash.com','media.istockphoto.com', 'cdn.pixabay.com', 'images.pexels.com', 'res.cloudinary.com'],
  }
};

export default nextConfig;
