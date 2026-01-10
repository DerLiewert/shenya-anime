import React from 'react';
import Tippy from '@tippyjs/react';
import { getAnimeById, getMangaById } from '@/api';
import { useMatchMedia } from '@/hooks';
import { breakpoints } from '@/constants';
import { AnimeAndMangaOf, AnimeAndMangaType, FetchStatus, Nullable } from '@/typescript';

export type TooltipProps<T extends AnimeAndMangaType> = TooltipCommonProps<T> & {
  type: T;
  tooltipContent: TooltipContent<T>;
};

export type TooltipCommonProps<T extends AnimeAndMangaType> = {
  children: React.ReactElement;
} & ({ id: number; item?: never } | { id?: never; item: AnimeAndMangaOf<T> });

export type TooltipContent<T extends AnimeAndMangaType> = (
  props: TooltipContentProps<T>,
) => React.ReactElement;

export type TooltipContentProps<T extends AnimeAndMangaType> = {
  item: Nullable<AnimeAndMangaOf<T>>;
  status: FetchStatus | null;
};

export const Tooltip = <T extends AnimeAndMangaType>({
  type,
  children,
  item,
  id,
  tooltipContent,
}: TooltipProps<T>) => {
  const [entityItem, setEntityItem] = React.useState(item);
  const [status, setStatus] = React.useState(item ? FetchStatus.SUCCESS : null);
  const isMobile = useMatchMedia('max', breakpoints.mobile);

  const onShowTippy = () => {
    if (!id || entityItem) return;

    setStatus(FetchStatus.LOADING);

    const getAnime = async () => {
      try {
        const { data } = await (type === 'anime' ? getAnimeById(id) : getMangaById(id));
        setEntityItem(data as AnimeAndMangaOf<T>);
        setStatus(FetchStatus.SUCCESS);
      } catch (error) {
        setStatus(FetchStatus.ERROR);
      }
    };

    getAnime();
  };

  return (
    <Tippy
      content={tooltipContent({item: entityItem, status})}
      visible={isMobile ? false : undefined}
      placement="right-start"
      theme="custom"
      interactive={true}
      appendTo={document.body}
      duration={300}
      delay={600}
      animation="fade-smooth"
      onShow={onShowTippy}
      popperOptions={{
        modifiers: [
          {
            name: 'eventListeners',
            options: {
              scroll: false,
              resize: false,
            },
          },
        ],
      }}>
      {children}
    </Tippy>
  );
};
