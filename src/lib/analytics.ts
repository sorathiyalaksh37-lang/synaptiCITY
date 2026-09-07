// Analytics utility for tracking user behavior and performance
// Supports multiple analytics providers

export type AnalyticsProvider = 'plausible' | 'google' | 'custom';

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export interface PageViewData {
  path: string;
  title?: string;
  referrer?: string;
}

export interface UserProperties {
  userId?: string;
  theme?: 'light' | 'dark';
  networkSize?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

class Analytics {
  private enabled: boolean = true;
  private provider: AnalyticsProvider = 'plausible';
  private userId: string | null = null;
  private sessionId: string;
  private sessionStartTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.detectProvider();
    this.initProvider();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private detectProvider(): void {
    // Detect which analytics provider is available
    if (typeof window !== 'undefined') {
      if ((window as any).plausible) {
        this.provider = 'plausible';
      } else if ((window as any).gtag || (window as any).ga) {
        this.provider = 'google';
      } else {
        this.provider = 'custom';
      }
    }
  }

  private initProvider(): void {
    // Initialize analytics provider
    if (!this.enabled || typeof window === 'undefined') return;

    // Track initial page view
    this.trackPageView({
      path: window.location.pathname,
      title: document.title
    });

    // Track session duration on unload
    window.addEventListener('beforeunload', () => {
      this.trackSessionDuration();
    });
  }

  /**
   * Enable or disable analytics tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('analytics-enabled', enabled.toString());
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    const stored = localStorage.getItem('analytics-enabled');
    return stored ? stored === 'true' : this.enabled;
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string | null): void {
    this.userId = userId;
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.enabled || !this.isEnabled()) return;

    const eventData = {
      ...event,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now()
    };

    switch (this.provider) {
      case 'plausible':
        this.sendToPlausible(eventData);
        break;
      case 'google':
        this.sendToGoogle(eventData);
        break;
      case 'custom':
        this.sendToCustom(eventData);
        break;
    }

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventData);
    }
  }

  /**
   * Track a page view
   */
  trackPageView(data: PageViewData): void {
    if (!this.enabled || !this.isEnabled()) return;

    const pageViewData = {
      ...data,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now()
    };

    switch (this.provider) {
      case 'plausible':
        if ((window as any).plausible) {
          (window as any).plausible('pageview', { props: pageViewData });
        }
        break;
      case 'google':
        if ((window as any).gtag) {
          (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: data.path,
            page_title: data.title
          });
        }
        break;
      case 'custom':
        this.sendToCustom({ type: 'pageview', ...pageViewData });
        break;
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.enabled || !this.isEnabled()) return;

    if (this.provider === 'google' && (window as any).gtag) {
      (window as any).gtag('set', 'user_properties', properties);
    }

    // Store locally for custom tracking
    localStorage.setItem('user-properties', JSON.stringify(properties));
  }

  /**
   * Track timing/performance metrics
   */
  trackTiming(category: string, variable: string, value: number, label?: string): void {
    this.trackEvent({
      category: 'Performance',
      action: `${category}_${variable}`,
      label,
      value
    });
  }

  /**
   * Track session duration
   */
  private trackSessionDuration(): void {
    const duration = Date.now() - this.sessionStartTime;
    this.trackTiming('Session', 'duration', duration);
  }

  /**
   * Send event to Plausible
   */
  private sendToPlausible(event: any): void {
    if (typeof window === 'undefined' || !(window as any).plausible) return;

    (window as any).plausible(event.action, {
      props: {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.metadata
      }
    });
  }

  /**
   * Send event to Google Analytics
   */
  private sendToGoogle(event: any): void {
    if (typeof window === 'undefined') return;

    if ((window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata
      });
    } else if ((window as any).ga) {
      (window as any).ga('send', 'event', {
        eventCategory: event.category,
        eventAction: event.action,
        eventLabel: event.label,
        eventValue: event.value
      });
    }
  }

  /**
   * Send event to custom endpoint
   */
  private sendToCustom(event: any): void {
    // Send to custom analytics endpoint
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
    if (!endpoint) return;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(err => {
      console.warn('[Analytics] Failed to send event:', err);
    });
  }
}

// Singleton instance
export const analytics = new Analytics();

// Convenience methods for common events
export const trackNetworkCreated = (nodeCount: number) => {
  analytics.trackEvent({
    category: 'Network',
    action: 'created',
    value: nodeCount
  });
};

export const trackTeach = (input: string, output: string) => {
  analytics.trackEvent({
    category: 'Network',
    action: 'teach',
    label: `${input}-${output}`
  });
};

export const trackRecall = (input: string, output: string, success: boolean) => {
  analytics.trackEvent({
    category: 'Network',
    action: 'recall',
    label: `${input}-${output}`,
    value: success ? 1 : 0
  });
};

export const trackAchievementUnlocked = (achievementId: string) => {
  analytics.trackEvent({
    category: 'Achievement',
    action: 'unlocked',
    label: achievementId
  });
};

export const trackChallengeCompleted = (challengeId: string, difficulty: string) => {
  analytics.trackEvent({
    category: 'Challenge',
    action: 'completed',
    label: challengeId,
    metadata: { difficulty }
  });
};

export const trackNetworkShared = (method: 'url' | 'social' | 'screenshot') => {
  analytics.trackEvent({
    category: 'Social',
    action: 'share',
    label: method
  });
};

export const trackError = (errorType: string, errorMessage: string) => {
  analytics.trackEvent({
    category: 'Error',
    action: errorType,
    label: errorMessage
  });
};

export const trackPerformance = (metric: string, value: number) => {
  analytics.trackTiming('App', metric, value);
};
