import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: number;
}

export const EnhancedTooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  maxWidth = 250,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const offset = 10;

        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top - offset;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom + offset;
            break;
          case 'left':
            x = rect.left - offset;
            y = rect.top + rect.height / 2;
            break;
          case 'right':
            x = rect.right + offset;
            y = rect.top + rect.height / 2;
            break;
        }

        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={`enhanced-tooltip enhanced-tooltip-${position}`}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            maxWidth: `${maxWidth}px`,
          }}
          role="tooltip"
        >
          <div className="tooltip-content">{content}</div>
          <div className="tooltip-arrow" />
        </div>
      )}
    </>
  );
};

// Helper component for inline tooltips with icons
export const TooltipIcon: React.FC<{ content: string | React.ReactNode }> = ({ content }) => {
  return (
    <EnhancedTooltip content={content} position="top">
      <button className="tooltip-icon-button" aria-label="More information">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10V7M7 4.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </EnhancedTooltip>
  );
};
