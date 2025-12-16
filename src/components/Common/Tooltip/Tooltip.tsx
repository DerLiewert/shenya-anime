import React from 'react';
import Tippy from '@tippyjs/react';
import { getAnimeById, getMangaById } from '@/api';
import { useMatchMedia } from '@/hooks';
import { breakpoints } from '@/constants';
import { AnimeAndMangaMap, AnimeAndMangaType, EntityMap, FetchStatus } from '@/typescript';

type CommonTooltipProps<T extends AnimeAndMangaType> = {
  type: T;
  children: React.ReactElement;
  tooltipContent: (
    item: AnimeAndMangaMap[T] | undefined,
    status: FetchStatus | null,
  ) => React.ReactElement;
};

type TooltipProps<T extends AnimeAndMangaType> = CommonTooltipProps<T> &
  ({ id: number; item?: never } | { id?: never; item: AnimeAndMangaMap[T] });

export const Tooltip = <T extends AnimeAndMangaType>({
  type,
  children,
  item,
  id,
  tooltipContent,
}: TooltipProps<T>) => {
  const [entityItem, setEntityItem] = React.useState(item);
  const [status, setStatus] = React.useState<FetchStatus | null>(item ? FetchStatus.SUCCESS : null);
  const isMobile = useMatchMedia('max', breakpoints.mobile);

  const onShowTippy = () => {
    if (!id || entityItem) return;

    setStatus(FetchStatus.LOADING);

    const getAnime = async () => {
      try {
        const { data } = type === 'anime' ? await getAnimeById(id) : await getMangaById(id);
        setEntityItem(data as AnimeAndMangaMap[T]);
        setStatus(FetchStatus.SUCCESS);
      } catch (error) {
        setStatus(FetchStatus.ERROR);
      }
    };

    getAnime();
  };

  return (
    <Tippy
      content={tooltipContent(entityItem, status)}
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
