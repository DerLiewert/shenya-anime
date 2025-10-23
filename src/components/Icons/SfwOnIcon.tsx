export const SfwOnIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-labelledby="adultBlockedTitle"
      role="img">
      <title id="adultBlockedTitle">Adult content blocked</title>

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

      <circle cx="17.5" cy="17.5" r="5" fill="#FFF0F0" stroke="#C62828" strokeWidth="1.3" />

      <path d="M20.9 14.1L14.1 20.9" stroke="#C62828" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
};
