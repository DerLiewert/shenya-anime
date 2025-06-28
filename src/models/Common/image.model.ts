// export interface JikanImages {
// 	jpg: JikanImagesCollection
// 	webp?: JikanImagesCollection
// }

// export interface JikanImagesCollection {
//   image_url: string;
//   small_image_url?: string;
//   medium_image_url?: string;
//   large_image_url?: string;
//   maximum_image_url?: string;
// }

export interface JikanImagesCollection {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface JikanImages {
  jpg: JikanImagesCollection;
  webp?: JikanImagesCollection;
}

export interface TrailerImagesCollection {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  maximum_image_url: string | null;
}

// export interface ImageUrlOnly  {
//   image_url: string | null;
// }

// export interface ImageUrlOnlySet {
//   jpg: ImageUrlOnly ;
//   webp?: ImageUrlOnly ;
// }

// export interface BaseImageFormat extends ImageUrlOnly  {
//   small_image_url: string | null;
//   large_image_url: string | null;
// }

// export interface BaseImageSet {
//   jpg: BaseImageFormat;
//   webp?: BaseImageFormat;
// }

// export interface TrailerImages extends BaseImageFormat {
//   medium_image_url: string | null;
//   maximum_image_url: string | null;
// }

// export interface CharacterImageFormat extends ImageUrlOnly  {
//   small_image_url: string | null;
// }

// export interface CharacterImageSet {
//   jpg: CharacterImageFormat;
//   webp?: CharacterImageFormat;
// }

// export interface SimpleImageFormat {
//   image_url: string | null;
// }

// export interface SimpleImageSet {
//   jpg: SimpleImageFormat;
//   webp?: SimpleImageFormat;
// }

// export interface BaseImageSet {
//   jpg: BaseImageFormat;
//   webp?: BaseImageFormat;
// }

// // Базовые форматы изображений
// export interface BaseImageFormat {
//   image_url: string | null;
//   small_image_url: string | null;
//   large_image_url: string | null;
// }

// export interface TrailerImages extends BaseImageFormat {
//   medium_image_url: string | null;
//   maximum_image_url: string | null;
// }

// // 👤 Character
// export interface CharacterImageFormat {
//   image_url: string;
//   small_image_url: string;
// }

// export interface CharacterImageSet {
//   jpg: CharacterImageFormat;
//   webp?: CharacterImageFormat;
// }

// // 🎙️ Person (озвучка, персонал)
// export type PersonImageSet = {
//   jpg: {
//     image_url: string;
//   };
// };

// export type Picture = {
//   jpg: {
//     image_url: string;
//   };
//   webp?: {
//     image_url: string;
//   };
// };
