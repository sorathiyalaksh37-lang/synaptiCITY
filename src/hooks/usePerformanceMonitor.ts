import { useEffect, useRef } from 'react';
import { trackPerformance } from '../lib/analytics';

interface PerformanceMetrics {
  fps: number;
  memory?: {
    used: number;
    total: number;
    limit: number;
  };
  loadTime: number;
  renderTime: number;
}

export const usePerformanceMonitor = (componentName: string, enabled: boolean = true) => {
  const mountTimeRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());
  const fpsRef = useRef<number>(60);

  useEffect(() => {
    if (!enabled) return;

    const mountTime = mountTimeRef.current;
    const renderTime = Date.now() - mountTime;

    // Track initial render time
    trackPerformance(`${componentName}_render`, renderTime);

    // FPS monitoring
    let rafId: number;
    const measureFPS = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        // Calculate FPS
        fpsRef.current = Math.round((frameCountRef.current * 1000) / delta);
        
        // Track FPS if it drops below 30 (performance issue)
        if (fpsRef.current < 30) {
          trackPerformance(`${componentName}_low_fps`, fpsRef.current);
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      frameCountRef.current++;
      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    // Memory monitoring (if available)
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (memoryUsage > 0.9) {
        trackPerformance(`${componentName}_high_memory`, memoryUsage * 100);
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [componentName, enabled]);

  // Measure component unmount
  useEffect(() => {
    return () => {
      const lifetime = Date.now() - mountTimeRef.current;
      trackPerformance(`${componentName}_lifetime`, lifetime);
    };
  }, [componentName]);

  return {
    fps: fpsRef.current
  };
};

/**
 * Monitor Web Vitals
 */
export const monitorWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    trackPerformance('LCP', lastEntry.renderTime || lastEntry.loadTime);
  });
  
  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      trackPerformance('FID', entry.processingStart - entry.startTime);
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // CLS not supported
  }

  // Report CLS on page unload
  window.addEventListener('beforeunload', () => {
    trackPerformance('CLS', clsValue);
  });

  // Navigation Timing
  if (performance.timing) {
    const timing = performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
    const ttfb = timing.responseStart - timing.navigationStart;

    trackPerformance('PageLoad', pageLoadTime);
    trackPerformance('DOMReady', domReadyTime);
    trackPerformance('TTFB', ttfb);
  }

  // Resource Timing
  if (performance.getEntriesByType) {
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((acc: number, resource: any) => {
      return acc + (resource.transferSize || 0);
    }, 0);

    trackPerformance('TotalResourceSize', totalSize);
  }
};

/**
 * Track long tasks (> 50ms on main thread)
 */
export const monitorLongTasks = () => {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 50) {
          trackPerformance('LongTask', entry.duration);
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task monitoring not supported
  }
};

/**
 * Get current performance metrics
 */
export const getCurrentMetrics = (): PerformanceMetrics => {
  const now = performance.now();
  
  let memory;
  if ((performance as any).memory) {
    const mem = (performance as any).memory;
    memory = {
      used: mem.usedJSHeapSize,
      total: mem.totalJSHeapSize,
      limit: mem.jsHeapSizeLimit
    };
  }

  return {
    fps: 60, // Would need actual measurement
    memory,
    loadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0,
    renderTime: now
  };
};
