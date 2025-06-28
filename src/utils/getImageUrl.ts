import { JikanImages } from '../models';

export const getImageUrl = (images: JikanImages | null) => {
  if (!images) return;

  let imagesCollection = images.webp ? images.webp : images.jpg;
  return imagesCollection.large_image_url
    ? imagesCollection.large_image_url
    : imagesCollection.image_url;
};

// export const getImageUrl = (item?: Anime | Manga | null, images?: JikanImages) => {
//   let newImages;
//   if (item) newImages = item.images.webp ? item.images.webp : item.images.jpg;
//   else if (images) newImages = images.webp ? images.webp : images.jpg;
//   else return;

//   if (newImages.large_image_url) return newImages.large_image_url;
//   return newImages.image_url;
// };
