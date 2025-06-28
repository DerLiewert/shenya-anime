import React from 'react';

export const PlayCircleIcon = React.memo(() => {
  return (
    <svg
      fill="#ffffff"
      height="24px"
      width="24px"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xmlSpace="preserve">
      <path
        d="M256,0C114.608,0,0,114.608,0,256s114.608,256,256,256s256-114.608,256-256S397.392,0,256,0z M256,496
			C123.664,496,16,388.336,16,256S123.664,16,256,16s240,107.664,240,240S388.336,496,256,496z"
      />

      <polygon points="189.776,141.328 189.776,370.992 388.672,256.16 		" />
    </svg>
  );
});
