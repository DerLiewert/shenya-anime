import React from 'react';
import { Link } from 'react-router-dom';
import { FreeMode, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/free-mode';
import './Breadcrumbs.scss';

interface BreadcrumbsProps {
  className?: string;
  items: Array<{
    label: string;
    url: string;
  }>;
  isCurrentLast?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className,
  items,
  isCurrentLast = true,
}) => {
  const containerRef = React.useRef<HTMLUListElement>(null);

  return (
    <Swiper
      ref={containerRef}
      wrapperTag="ul"
      wrapperClass="breadcrumbs__wrapper"
      className={`${className} breadcrumbs`}
      modules={[FreeMode, Scrollbar]}
      slidesPerView="auto"
      freeMode={true}
      grabCursor={true}
      scrollbar={{
        draggable: true,
        className: '_draggable',
        // hide: true,
      }}>
      {items.map((item, index, arr) => (
        <SwiperSlide tag="li" className="breadcrumbs__item" key={item.label}>
          {isCurrentLast && index === arr.length - 1 ? (
            <p
              className={`breadcrumbs__text ${
                index === arr.length - 1 ? 'breadcrumbs__text--current' : ''
              }`}>
              {item.label}
            </p>
          ) : (
            <Link to={item.url} className="breadcrumbs__text">
              {item.label}
            </Link>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Breadcrumbs;
