import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { FreeMode, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/free-mode';
import './Breadcrumbs.scss';

interface BreadcrumbsProps {
  items: Array<{
    label: string | number;
    url: string;
  }>;
  isCurrentLast?: boolean;
  className?: string;
}

export const Breadcrumbs = ({ className, items, isCurrentLast = true }: BreadcrumbsProps) => {
  if (items.length === 0) return null;
  return (
    <Swiper
      className={clsx(className, 'breadcrumbs')}
      wrapperClass="breadcrumbs__wrapper"
      wrapperTag="ul"
      modules={[FreeMode, Scrollbar]}
      slidesPerView="auto"
      freeMode={true}
      grabCursor={true}
      scrollbar={true}>
      {items.map((item, index, arr) => (
        <SwiperSlide className="breadcrumbs__item" tag="li" key={item.label + '_' + item.url}>
          {isCurrentLast && index === arr.length - 1 ? (
            <p className="breadcrumbs__text breadcrumbs__text--current visible-line">
              {item.label}
            </p>
          ) : (
            <Link to={item.url} className="breadcrumbs__text visible-line">
              {item.label}
            </Link>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
