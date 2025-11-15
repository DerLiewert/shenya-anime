import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils';
import { BookmarkButton, Score, SfwImage, Status } from '@/components';
import clsx from 'clsx';
import './CardItem.scss';
import { AnimeAndMangaOf, AnimeAndMangaType } from '@/typescript';
import { useAppSelector } from '@/app/hooks';

// interface CardItemProps {
//   linkPath: string;
//   images: JikanImages;
//   title: string;
//   type?: string | null;
//   year?: number | null;
//   status?: AnimeStatus | MangaStatus | null;
//   score?: number | null;
//   className?: string;
//   ref?: React.Ref<HTMLAnchorElement>;
//   cardType: 'anime' | 'manga';
// }

// const CardItem = React.forwardRef<HTMLAnchorElement, CardItemProps>(
//   (
//     {
//       linkPath,
//       images,
//       title,
//       type = null,
//       year = null,
//       status = null,
//       score = null,
//       cardType,
//       className,
//       // ref,
//     },
//     ref,
//   ) => {
//     return (
//       <Link
//         to={linkPath}
//         ref={ref}
//         className={clsx(className, 'card-item border-opacity _title-parent')}>
//         <div className="card-item__image bg ">
//           <Status className="card-item__status" status={status} isShadow />
//           {/* <BookmarkButton className='card-item__bookmark'
//             item={{ linkPath, images, title, type, year, status, score }}
//             type={cardType}
//           /> */}
//           <img src={getImageUrl(images)} alt="Poster" loading="lazy" />
//           <Score className="card-item__score" score={score} isShadow />
//         </div>
//         <div className="card-item__content">
//           <h3 className="card-item__title title title--fz-14 visible-line" title={title}>
//             {title}
//           </h3>
//           <p className="card-item__text fz-13">
//             <span>{type}</span>
//             <span>{year}</span>
//           </p>
//         </div>
//       </Link>
//     );
//   },
// );

// export default CardItem;

interface CardItemProps<T extends AnimeAndMangaType = AnimeAndMangaType> {
  linkPath: string;
  item: AnimeAndMangaOf<T> & { year: number | null };
  className?: string;
  nsfw: boolean;
  cardType: T;
  ref?: React.Ref<HTMLDivElement>;
}

const CardItem = React.forwardRef<HTMLDivElement, CardItemProps>(
  (
    {
      linkPath,
      item,
      cardType,
      className,
      nsfw
    },
    ref,
  ) => {
    const { images, title, type, year, status, score } = item;
    return (
      <div className={clsx(className, 'card-item border-opacity _title-parent')} ref={ref}>
        <BookmarkButton
          className="card-item__bookmark btn btn--icon btn--stroke"
          bookmarkedClassName=" btn--stroke"
          noBookmarkedClassName="btn--white"
          type={cardType}
          item={item}
          withText={false}
        />
        <Link to={linkPath} className="card-item__inner">
          <div className="card-item__image bg ">
            <Status className="card-item__status" status={status} isShadow />
            <SfwImage
              src={getImageUrl(images)}
              alt="Poster"
              loading="lazy"
              nsfw={nsfw}
            />
            <Score className="card-item__score" score={score} isShadow />
          </div>
          <div className="card-item__content">
            <h3 className="card-item__title title title--fz-14 visible-line" title={title}>
              {title}
            </h3>
            <p className="card-item__text fz-13">
              <span>{type}</span>
              <span>{year}</span>
            </p>
          </div>
        </Link>
      </div>
    );
  },
);

export default CardItem;

// interface CardItemProps2 {
//   linkPath: string;
//   images: JikanImages;
//   title: string;
//   type?: string | null;
//   year?: number | null;
//   status?: AnimeStatus | MangaStatus | null;
//   score?: number | null;
//   className?: string;
//   ref?: React.Ref<HTMLDivElement>;
//   cardType: 'anime' | 'manga';
// }
// const CardItem2 = React.forwardRef<HTMLDivElement, CardItemProps2>(
//   (
//     {
//       linkPath,
//       images,
//       title,
//       type = null,
//       year = null,
//       status = null,
//       score = null,
//       cardType,
//       className,
//       // ref,
//     },
//     ref,
//   ) => {
//     return (
//       <div className={clsx(className, 'card-item border-opacity _title-parent')} ref={ref}>
//         <BookmarkButton
//           className="card-item__bookmark"
//           type={cardType}
//           item={{ linkPath, images, title, type: type as any, year, status, score }}
//         />
//         <Link to={linkPath} className={'card-item__inner'}>
//           <div className="card-item__image bg ">
//             <Status className="card-item__status" status={status} isShadow />

//             <img src={getImageUrl(images)} alt="Poster" loading="lazy" />
//             <Score className="card-item__score" score={score} isShadow />
//           </div>
//           <div className="card-item__content">
//             <h3 className="card-item__title title title--fz-14 visible-line" title={title}>
//               {title}
//             </h3>
//             <p className="card-item__text fz-13">
//               <span>{type}</span>
//               <span>{year}</span>
//             </p>
//           </div>
//         </Link>
//       </div>
//     );
//   },
// );
