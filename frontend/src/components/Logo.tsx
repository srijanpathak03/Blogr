import React from 'react';

interface LogoProps {
  className?: string; // Allow className as an optional prop
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={className}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 50"
            width="200"
            height="50"
            fill="none"
            className="bubbly-logo-svg"
          >
            <text
              x="0"
              y="35"
              fontSize="35"
              fontFamily="'Comic Sans MS', sans-serif"
              fill="#FF7F50"
              fontWeight="bold"
            >
              Blogr
            </text>
            <circle cx="110" cy="25" r="12" fill="#FF7F50" />
            <circle cx="140" cy="25" r="10" fill="#FF7F50" />
            <circle cx="165" cy="25" r="8" fill="#FF7F50" />
          </svg>
        </div>
      );
    };