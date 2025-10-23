import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { fetchMangaScoreStats, fetchAnimeScoreStats } from '@/store';
import { animeEmptyValueMessages, mangaEmptyValueMessages } from '@/constants';
import { EmptyValueMessage, Loading } from '@/components';
import { AnimeAndMangaType } from '@/typescript';
import './ScoreStats.scss';

interface ScoreStatsProps<T extends AnimeAndMangaType> {
  type: T;
}

const ScoreStats = <T extends AnimeAndMangaType>({ type }: ScoreStatsProps<T>) => {
  const isAnime = type === 'anime';
  const abortableDispatch = useAbortableDispatch();
  const { scoreStats, status } = useAppSelector((state) =>
    isAnime ? state.animeFullById : state.mangaFullById,
  );
  const { isLoading, isSuccess, isError, isIdle } = useFetchStatus(status.scoreStats);

  React.useEffect(() => {
    if (!isSuccess) abortableDispatch(isAnime ? fetchAnimeScoreStats : fetchMangaScoreStats);
  }, []);

  if (isIdle) return null;
  if (isLoading) return <Loading />;
  if (isError) return <EmptyValueMessage message="Something went wrong" />;
  if (isSuccess && scoreStats.length === 0) {
    return (
      <EmptyValueMessage
        message={isAnime ? animeEmptyValueMessages.scoreStats : mangaEmptyValueMessages.scoreStats}
      />
    );
  }

  const barHeight = 20;
  const gap = 8;
  const chartHeight = scoreStats.length * (barHeight + gap);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={scoreStats} layout="vertical" barCategoryGap={gap}>
        <XAxis dataKey="votes" type="number" hide={true} />
        <YAxis
          dataKey="score"
          type="category"
          reversed
          tick={{ fontSize: 12, fill: '#fff' }}
          tickLine={false}
          width={24}
        />
        <Bar
          dataKey="votes"
          fill="#136fe8"
          barSize={barHeight}
          maxBarSize={barHeight}
          label={({ x, y, width, height, index, value }) => {
            const text = `${value} (${scoreStats[index].percentage}%)`;
            const approxTextWidth = text.length * (12 * 0.6);
            const inside = width > approxTextWidth + 8;
            const textX = inside ? x + width - 8 : x + width + 8;
            const textAnchor = inside ? 'end' : 'start';
            const textColor = '#fff';
            return (
              <text
                x={textX}
                y={y + (height - 12 / 2)}
                fill={textColor}
                fontSize={12}
                textAnchor={textAnchor}>
                {text}
              </text>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreStats;
