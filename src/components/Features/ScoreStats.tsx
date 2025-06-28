import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { useAbortableDispatch, useFetchStatus } from '@/hooks';
import { fetchAnimeScoreStats } from '@/store/anime/animeFullByIdSlice';
import { animeEmptyValueMessages } from '@/variables/emptyValueMessages';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { EmptyValueMessage, Loading } from '../UI';

const ScoreStats: React.FC<{ id: number; isShowEmpryMessage?: boolean }> = ({
  id,
  isShowEmpryMessage = true,
}) => {
  const { scoreStats, status } = useAppSelector((state) => state.animeFullById);
  const { isLoading, isSuccess } = useFetchStatus(status.scoreStats);

  useAbortableDispatch(fetchAnimeScoreStats, id, scoreStats.length === 0 && !isSuccess);

  if (scoreStats.length === 0) {
    return isLoading ? (
      <Loading />
    ) : isShowEmpryMessage ? (
      <EmptyValueMessage message={animeEmptyValueMessages.scoreStats} />
    ) : null;
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
