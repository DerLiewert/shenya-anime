export const SfwOffIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-labelledby="adultAllowedTitle"
      role="img">
      <title id="adultAllowedTitle">Adult content allowed</title>

      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="5"
        ry="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <g
        transform="translate(3,4)"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fill="currentColor"
        fontSize="8">
        <text x="0" y="7">
          18+
        </text>
      </g>

      <circle cx="17.5" cy="17.5" r="5" fill="#E6FBF0" stroke="#05884A" strokeWidth="1.3" />

      <path
        d="M14.9 18.2l1.6 1.6 3.6-3.8"
        fill="none"
        stroke="#05884A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* <path
        d="M14.9 17.5l1.6 1.6 3.6-3.8"
        fill="none"
        stroke="#05884A"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      /> */}
    </svg>
  );
};
