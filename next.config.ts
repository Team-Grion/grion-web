import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // AI 생성 이미지 호스트. 서브도메인이 v3b 등으로 바뀌어 와일드카드로 둔다.
      {
        protocol: "https",
        hostname: "**.fal.media",
      },
    ],
  },
};

export default nextConfig;
