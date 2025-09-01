import React from 'react';
import { FreeMode, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import type { Swiper as ISwiper } from 'swiper';
import clsx from 'clsx';
import './TabList.scss';
import { TabRoute } from '@/typescript';

interface TabListProps {
  tabs: Array<TabRoute | { value: string, label: string }>;
  activeTab: string;
  className?: string;
  onTabTrigger: (value: string) => void;
}

const TabList: React.FC<TabListProps> = React.memo(
  ({ tabs, activeTab, onTabTrigger, className }) => {
    const tabRefs = React.useRef<Array<HTMLDivElement | null>>([]);
    const swiperRef = React.useRef<SwiperProps>(null);

    const focusTab = (index: number) => {
      const tab = tabRefs.current[index];
      if (tab) tab.focus();
    };

    const updateSwiper = (wrapper: HTMLElement, swiper: ISwiper, left: number) => {
      wrapper.style.transition = 'transform 0.3s ease 0s';
      wrapper.dataset.left = left.toString();
      swiper.setTranslate(left);
      // Обновить состояние и прогресс
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
      // Триггернуть нужные события (если нужны)
      swiper.emit('setTranslate', left);
      swiper.emit('transitionStart');
      swiper.emit('slideChangeTransitionStart');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onTabTriggerClick(e);
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
      const swiperEl = swiper.el;
      const wrapper = swiperEl.querySelector('.swiper-wrapper');
      if (!wrapper) return;
      const nextSlide = swiperEl.querySelectorAll('.swiper-slide')[nextIndex] as HTMLElement;
      if (!nextSlide) return;

      const slideRect = nextSlide.getBoundingClientRect();
      const swiperRect = swiperEl.getBoundingClientRect();
      const swiperWrapperRect = wrapper.getBoundingClientRect();

      if (slideRect.left <= swiperRect.left) {
        updateSwiper(wrapper, swiper, swiperWrapperRect.left - slideRect.left);
      } else if (slideRect.right >= swiperWrapperRect.right) {
        updateSwiper(wrapper, swiper, swiperWrapperRect.right - slideRect.right);
      }
    };

    const onTabTriggerClick = (
      e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      const value = (e.currentTarget as HTMLElement).dataset.value;
      if (!value) return;

      onTabTrigger(value);
    };

    React.useEffect(() => {
      const index = tabs.findIndex((tab) => tab.value === activeTab);
      if (swiperRef.current && index !== -1) {
        swiperRef.current.slideTo(index, 300);
      }
    }, [activeTab]);

    return (
      <Swiper
        className={clsx('tab-list', className)}
        role="tablist"
        aria-orientation="horizontal"
        modules={[FreeMode, Scrollbar]}
        slidesPerView="auto"
        scrollbar={{ draggable: true }}
        onSwiper={(swiper: ISwiper) => {
          swiperRef.current = swiper;
        }}
        freeMode>
        {tabs.map((tab, index) => (
          <SwiperSlide
            key={tab.value}
            className={clsx('tab-list__trigger-wrapper', {
              'tab-list__trigger-wrapper--active': activeTab === tab.value,
            })}>
            <div
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className="tab-list__trigger"
              role="tab"
              tabIndex={activeTab === tab.value ? 0 : -1}
              aria-selected={activeTab === tab.value}
              data-value={tab.value}
              onClick={onTabTriggerClick}
              onKeyDown={(e) => handleKeyDown(e, index)}>
              {/* {tab.label.charAt(0).toUpperCase() + tab.label.slice(1)} */}
              {tab.label}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  },
);

export default TabList;
