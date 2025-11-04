
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="m12 3-1.5 3L7 7.5l3 1.5L12 12l1.5-3L17 7.5l-3-1.5z" />
    <path d="M5 13.5 3 12l-2 1.5" />
    <path d="M21 13.5 23 12l2 1.5" />
    <path d="m12 21 1.5-3 3-1.5-3-1.5-1.5-3-1.5 3-3 1.5 3 1.5z" />
  </svg>
);

export default SparklesIcon;
