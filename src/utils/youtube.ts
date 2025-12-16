export const isYoutubePlaceholder = (img: HTMLImageElement): boolean => {
  if (!img.src.includes('img.youtube.com')) return false;
  return img.naturalWidth === 120 && img.naturalHeight === 90;
};

export const getYoutubeImageUrls = (embedUrl: string) => {
  const videoId = embedUrl.replace('https://www.youtube-nocookie.com/embed/', '').split('?')[0];

  return {
    maximum_image_url: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null,
    large_image_url: videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : null,
  };
};
