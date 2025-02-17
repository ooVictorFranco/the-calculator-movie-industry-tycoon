"use client";

import React from "react";

type EuroCupIconProps = {
  className?: string;
};

const EuroCupIcon: React.FC<EuroCupIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 8L15.8043 10.7639M12 8L8.1958 10.7639M12 8V5M15.8043 10.7639L14.3512 15.2361M15.8043 10.7639L18.5 9.5M14.3512 15.2361H9.64889M14.3512 15.2361L16 17.5M9.64889 15.2361L8.1958 10.7639M9.64889 15.2361L8 17.5M8.1958 10.7639L5.5 9.5M5.5 9.5L2.04938 13M5.5 9.5L4.5 5.38544M18.5 9.5L21.9506 13M18.5 9.5L19.5 5.38544M12 5L8.62434 2.58409M12 5L15.3757 2.58409M8 17.5L3.33782 17M8 17.5L10.5 21.8883M16 17.5L20.6622 17M16 17.5L13.5 21.8883M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
  </svg>
);

export default EuroCupIcon;