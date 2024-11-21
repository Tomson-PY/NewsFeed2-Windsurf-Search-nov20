import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <img
      src="https://ottomator.ai/wp-content/uploads/2024/11/OttomatorIcon-fullcolor-square.png"
      alt="Ottomator Logo"
      className={className}
    />
  );
};