'use client';

import { config } from '@tarrasque/common';

interface Props {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Supabase storage image loader for Next.js Image component
 * @param src - The image path
 * @param width - The image width
 * @param quality - The image quality (default: 75)
 * @returns The transformed image URL
 */
export function storageImageLoader({ src, width, quality }: Props) {
  return `${config.SUPABASE_URL}/storage/v1/render/image/public/tarrasqueapp/${src}?width=${width}&quality=${
    quality || 75
  }`;
}
