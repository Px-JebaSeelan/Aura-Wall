import React from 'react';

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 14v4" />
    <path d="M8.5 14.5A5.5 5.5 0 0 1 12 3a5.5 5.5 0 0 1 3.5 11.5" />
  </svg>
);

export default LightbulbIcon;
