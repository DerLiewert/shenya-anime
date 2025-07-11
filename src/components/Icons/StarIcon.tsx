import React from 'react';

export const StarIcon: React.FC<{ color?: string }> = React.memo(({ color = '#ffffff' }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.08 0.575195L10.4159 5.45333L15.64 6.23554L11.86 10.0326L12.7521 15.3943L8.08 12.8629L3.40764 15.3943L4.30003 10.0326L0.52002 6.23554L5.74382 5.45333L8.08 0.575195Z"
        fill={color}
      />
    </svg>
  );
});
