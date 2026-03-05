import img2 from "../../public/assets/uploads/0b4a647c5c0d72c3c555e4c453eaecf1-1-2.jpg";
import img7 from "../../public/assets/uploads/17c0fa49f6b4bb9827425433e5b4caf0-1-7.jpg";
// Static image map — importing these ensures the build pipeline
// includes the files and does not prune them from the output.
import img1 from "../../public/assets/uploads/37d8a4c6025d30a6af840bbcc01c255a-1.jpg";
import img3 from "../../public/assets/uploads/728ed3a7056f6d549e4713cb5a9fdc99-3.jpg";
import img4 from "../../public/assets/uploads/c06bd491e629cc58123c67f059c56864-1-4.jpg";
import img5 from "../../public/assets/uploads/cf3429abf00a319ded6cafd12786af20-5.jpg";
import img6 from "../../public/assets/uploads/e69659b53c59b7ce39b555473713f573-1-6.jpg";

export const IMAGE_MAP: Record<string, string> = {
  "/assets/uploads/37d8a4c6025d30a6af840bbcc01c255a-1.jpg": img1,
  "/assets/uploads/0b4a647c5c0d72c3c555e4c453eaecf1-1-2.jpg": img2,
  "/assets/uploads/728ed3a7056f6d549e4713cb5a9fdc99-3.jpg": img3,
  "/assets/uploads/c06bd491e629cc58123c67f059c56864-1-4.jpg": img4,
  "/assets/uploads/cf3429abf00a319ded6cafd12786af20-5.jpg": img5,
  "/assets/uploads/e69659b53c59b7ce39b555473713f573-1-6.jpg": img6,
  "/assets/uploads/17c0fa49f6b4bb9827425433e5b4caf0-1-7.jpg": img7,
};

/**
 * Resolves a product image URL from the backend to a bundled asset.
 * Falls back to the original URL if no mapping is found.
 */
export function resolveProductImage(url: string): string {
  return IMAGE_MAP[url] ?? url;
}

// Export individual images so they are always included in the bundle
export { img1, img2, img3, img4, img5, img6, img7 };
