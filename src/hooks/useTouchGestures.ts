import { useEffect, useRef, type RefObject } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  threshold?: number;
}

export const useTouchGestures = (
  ref: RefObject<HTMLElement>,
  options: TouchGestureOptions
) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const pinchStartRef = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const threshold = options.threshold || 50;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now()
        };
      } else if (e.touches.length === 2 && options.onPinch) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        pinchStartRef.current = distance;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && options.onPinch && pinchStartRef.current) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = distance / pinchStartRef.current;
        options.onPinch(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now()
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const deltaTime = touchEnd.time - touchStartRef.current.time;

      // Check for double tap
      if (options.onDoubleTap && deltaTime < 300) {
        const timeSinceLastTap = touchEnd.time - lastTapRef.current;
        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
          options.onDoubleTap();
          lastTapRef.current = 0;
          return;
        }
        lastTapRef.current = touchEnd.time;
      }

      // Check for swipes
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > threshold || absDeltaY > threshold) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && options.onSwipeRight) {
            options.onSwipeRight();
          } else if (deltaX < 0 && options.onSwipeLeft) {
            options.onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && options.onSwipeDown) {
            options.onSwipeDown();
          } else if (deltaY < 0 && options.onSwipeUp) {
            options.onSwipeUp();
          }
        }
      }

      touchStartRef.current = null;
      pinchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, options]);
};
