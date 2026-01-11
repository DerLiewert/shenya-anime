import React from 'react';
import { FreeMode, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as ISwiper } from 'swiper';
import type { TabRoute } from '@/typescript';
import clsx from 'clsx';
import './TabList.scss';

interface TabListProps {
  tabs: Array<TabRoute | { value: string; label: string }>;
  activeTab: string;
  onTabClick: (value: string) => void;
  gap?: number;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({
  tabs,
  activeTab,
  onTabClick,
  className,
  gap = 0,
}) => {
  const tabRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const swiperRef = React.useRef<ISwiper | null>(null);

  const focusTab = (index: number) => {
    const tab = tabRefs.current[index];
    if (tab) tab.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick(e);
      return;
    }

    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    const lastIndex = tabs.length - 1;
    let nextIndex = index;

    if (e.key === 'ArrowRight') {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else {
      nextIndex = index === 0 ? lastIndex : index - 1;
    }

    focusTab(nextIndex);

    if (!swiperRef.current) return;

    const swiper = swiperRef.current;
    const swiperEl = swiper.el as HTMLElement;
    const wrapper = swiperEl.querySelector<HTMLElement>('.swiper-wrapper');
    if (!wrapper) return;

    const nextSlide = swiperEl.querySelectorAll<HTMLElement>('.swiper-slide')[nextIndex];
    if (!nextSlide) return;

    const slideRect = nextSlide.getBoundingClientRect();
    const swiperRect = swiperEl.getBoundingClientRect();
    const swiperWrapperRect = wrapper.getBoundingClientRect();

    if (slideRect.left <= swiperRect.left) {
      updateTabListSwiper(wrapper, swiper, swiperWrapperRect.left - slideRect.left);
    } else if (slideRect.right >= swiperWrapperRect.right) {
      updateTabListSwiper(wrapper, swiper, swiperWrapperRect.right - slideRect.right);
    }
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    const value = (e.currentTarget as HTMLElement).dataset.value;
    if (!value) return;

    onTabClick(value);
  };

  React.useEffect(() => {
    const index = tabs.findIndex((tab) => tab.value === activeTab);
    if (swiperRef.current && index !== -1) {
      swiperRef.current.slideTo(index, 300);
    }
  }, [activeTab]);

  return (
    <Swiper
      className={clsx('swiper-tab-list', className)}
      role="tablist"
      aria-orientation="horizontal"
      modules={[FreeMode, Scrollbar]}
      spaceBetween={gap}
      slidesPerView="auto"
      observeParents={true}
      observeSlideChildren={true}
      scrollbar={true}
      onSwiper={(swiper: ISwiper) => {
        swiperRef.current = swiper;
      }}
      freeMode>
      {tabs.map((tab, index) => (
        <SwiperSlide key={tab.value} className="swiper-tab-list__trigger-wrapper">
          <div
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className="swiper-tab-list__trigger"
            role="tab"
            tabIndex={activeTab === tab.value ? 0 : -1}
            aria-selected={activeTab === tab.value}
            data-value={tab.value}
            onClick={onClick}
            onKeyDown={(e) => handleKeyDown(e, index)}>
            {tab.label}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

function updateTabListSwiper(wrapper: HTMLElement, swiper: ISwiper, left: number) {
  wrapper.style.transition = 'transform 0.3s ease 0s';
  wrapper.dataset.left = left.toString();
  swiper.setTranslate(left);
  // Обновление состояния и прогресса
  swiper.updateProgress();
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  // Триггер событий
  swiper.emit('setTranslate', left);
  swiper.emit('transitionStart');
  swiper.emit('slideChangeTransitionStart');
}
