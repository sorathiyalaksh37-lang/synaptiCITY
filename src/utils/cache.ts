/**
 * Caching system for neural network performance optimization
 * 
 * Implements intelligent caching of recall results and forward pass computations
 * with TTL-based invalidation and size limits.
 * 
 * @module cache
 */

import { RecallResult, CacheEntry, NetworkState } from '../types/network.types';

/**
 * Cache statistics for monitoring
 */
export interface CacheStats {
  /** Total cache hits */
  hits: number;
  /** Total cache misses */
  misses: number;
  /** Current cache size */
  size: number;
  /** Cache hit rate (0-1) */
  hitRate: number;
  /** Total entries ever added */
  totalAdded: number;
  /** Total entries evicted */
  totalEvicted: number;
}

/**
 * Neural network prediction cache
 * 
 * Caches recall results to avoid redundant forward pass computations.
 * Uses LRU eviction and TTL-based invalidation.
 * 
 * @example
 * ```typescript
 * const cache = new NetworkCache({ maxSize: 100, ttl: 5000 });
 * 
 * // Cache a result
 * cache.set(state, 0, result);
 * 
 * // Retrieve from cache
 * const cached = cache.get(state, 0);
 * if (cached) {
 *   console.log('Cache hit!', cached);
 * }
 * 
 * // Check statistics
 * const stats = cache.getStats();
 * console.log('Hit rate:', stats.hitRate);
 * ```
 */
export class NetworkCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl: number; // Time-to-live in milliseconds
  private accessOrder: string[]; // For LRU tracking
  
  // Statistics
  private hits: number = 0;
  private misses: number = 0;
  private totalAdded: number = 0;
  private totalEvicted: number = 0;

  /**
   * Create a new network cache
   * 
   * @param options - Cache configuration
   * @param options.maxSize - Maximum number of entries (default: 100)
   * @param options.ttl - Time-to-live in milliseconds (default: 5000)
   */
  constructor(options: { maxSize?: number; ttl?: number } = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize ?? 100;
    this.ttl = options.ttl ?? 5000; // 5 seconds default
    this.accessOrder = [];
  }

  /**
   * Generate cache key from state and input index
   * 
   * Key includes a hash of the weight matrix to detect state changes.
   * 
   * @param state - Network state
   * @param inputIndex - Input node index
   * @returns Cache key string
   */
  private generateKey(state: NetworkState, inputIndex: number): string {
    // Create a simple hash of the weights matrix
    // This ensures cache invalidation when weights change
    const weightsHash = this.hashWeights(state.weights);
    return `${weightsHash}_${inputIndex}`;
  }

  /**
   * Hash the weights matrix for cache key generation
   * 
   * Uses a simple but fast hashing algorithm.
   * Not cryptographically secure, but sufficient for cache invalidation.
   * 
   * @param weights - Weight matrix
   * @returns Hash string
   */
  private hashWeights(weights: number[][]): string {
    let hash = 0;
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights[i].length; j++) {
        // Simple hash combining position and value
        const value = Math.round(weights[i][j] * 1000); // 3 decimal precision
        hash = ((hash << 5) - hash + value) | 0; // Bitwise OR for 32-bit integer
      }
    }
    return hash.toString(36); // Base-36 for shorter string
  }

  /**
   * Check if a cache entry is still valid (not expired)
   * 
   * @param entry - Cache entry to check
   * @returns Whether entry is valid
   */
  private isValid(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }

  /**
   * Update access order for LRU tracking
   * 
   * @param key - Cache key that was accessed
   */
  private updateAccessOrder(key: string): void {
    // Remove from current position
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    // Add to end (most recently used)
    this.accessOrder.push(key);
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;
    
    const lruKey = this.accessOrder.shift()!;
    this.cache.delete(lruKey);
    this.totalEvicted++;
  }

  /**
   * Clean expired entries
   * 
   * Removes all entries that have exceeded their TTL.
   */
  private cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if ((now - entry.timestamp) >= entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.totalEvicted++;
    });
  }

  /**
   * Get a cached recall result
   * 
   * @param state - Network state
   * @param inputIndex - Input node index
   * @returns Cached result if available and valid, null otherwise
   */
  get(state: NetworkState, inputIndex: number): RecallResult | null {
    const key = this.generateKey(state, inputIndex);
    const entry = this.cache.get(key);

    if (entry && this.isValid(entry)) {
      this.hits++;
      this.updateAccessOrder(key);
      return entry.result;
    }

    // Entry doesn't exist or expired
    if (entry) {
      this.cache.delete(key); // Remove expired entry
      this.totalEvicted++;
    }
    
    this.misses++;
    return null;
  }

  /**
   * Store a recall result in cache
   * 
   * @param state - Network state
   * @param inputIndex - Input node index
   * @param result - Recall result to cache
   */
  set(state: NetworkState, inputIndex: number, result: RecallResult): void {
    // Clean expired entries periodically
    if (this.cache.size > this.maxSize * 0.9) {
      this.cleanExpired();
    }

    // Evict LRU if at capacity
    while (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const key = this.generateKey(state, inputIndex);
    const entry: CacheEntry = {
      result,
      timestamp: Date.now(),
      ttl: this.ttl,
    };

    this.cache.set(key, entry);
    this.updateAccessOrder(key);
    this.totalAdded++;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    // Don't reset statistics - they track lifetime metrics
  }

  /**
   * Get current cache size
   * 
   * @returns Number of entries in cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if cache has a valid entry for given state and input
   * 
   * @param state - Network state
   * @param inputIndex - Input node index
   * @returns Whether valid entry exists
   */
  has(state: NetworkState, inputIndex: number): boolean {
    return this.get(state, inputIndex) !== null;
  }

  /**
   * Get cache statistics
   * 
   * @returns Cache performance statistics
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;

    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRate,
      totalAdded: this.totalAdded,
      totalEvicted: this.totalEvicted,
    };
  }

  /**
   * Reset cache statistics
   * 
   * Clears statistical counters without clearing cached entries.
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    this.totalAdded = 0;
    this.totalEvicted = 0;
  }

  /**
   * Update TTL for all existing entries
   * 
   * @param newTTL - New time-to-live in milliseconds
   */
  setTTL(newTTL: number): void {
    if (newTTL <= 0) {
      throw new Error('TTL must be positive');
    }
    
    this.ttl = newTTL;
    
    // Update existing entries
    this.cache.forEach((entry, key) => {
      entry.ttl = newTTL;
      this.cache.set(key, entry);
    });
  }

  /**
   * Update maximum cache size
   * 
   * If new size is smaller, evicts LRU entries to fit.
   * 
   * @param newMaxSize - New maximum size
   */
  setMaxSize(newMaxSize: number): void {
    if (newMaxSize < 1) {
      throw new Error('Max size must be at least 1');
    }
    
    this.maxSize = newMaxSize;
    
    // Evict if over new limit
    while (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
  }

  /**
   * Get all cached keys (for debugging)
   * 
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get detailed cache information (for debugging)
   * 
   * @returns Detailed cache state
   */
  inspect(): {
    entries: Array<{ key: string; timestamp: number; ttl: number; age: number }>;
    stats: CacheStats;
    config: { maxSize: number; ttl: number };
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      timestamp: entry.timestamp,
      ttl: entry.ttl,
      age: now - entry.timestamp,
    }));

    return {
      entries,
      stats: this.getStats(),
      config: {
        maxSize: this.maxSize,
        ttl: this.ttl,
      },
    };
  }
}

/**
 * Global cache instance
 * 
 * Shared cache for application-wide use.
 * Can be replaced with a custom instance if needed.
 */
export const globalCache = new NetworkCache({
  maxSize: 100,
  ttl: 5000, // 5 seconds
});

/**
 * Cached recall function
 * 
 * Wrapper around recall that uses caching for performance.
 * Automatically falls back to computation on cache miss.
 * 
 * @param state - Network state
 * @param inputIndex - Input node index
 * @param recallFn - Recall function to use on cache miss
 * @param cache - Cache instance to use (defaults to global)
 * @returns Recall result (cached or computed)
 * 
 * @example
 * ```typescript
 * import { cachedRecall } from './cache';
 * import { recallFromState } from './recall';
 * 
 * const result = cachedRecall(state, 0, recallFromState);
 * ```
 */
export function cachedRecall(
  state: NetworkState,
  inputIndex: number,
  recallFn: (state: NetworkState, inputIndex: number) => RecallResult,
  cache: NetworkCache = globalCache
): RecallResult {
  // Try cache first
  const cached = cache.get(state, inputIndex);
  if (cached) {
    return cached;
  }

  // Cache miss - compute and cache
  const result = recallFn(state, inputIndex);
  cache.set(state, inputIndex, result);
  
  return result;
}

/**
 * Create a memoized recall function
 * 
 * Returns a recall function that automatically uses caching.
 * 
 * @param recallFn - Base recall function
 * @param cacheOptions - Cache configuration
 * @returns Memoized recall function
 * 
 * @example
 * ```typescript
 * import { createMemoizedRecall } from './cache';
 * import { recallFromState } from './recall';
 * 
 * const memoizedRecall = createMemoizedRecall(recallFromState, {
 *   maxSize: 200,
 *   ttl: 10000
 * });
 * 
 * const result = memoizedRecall(state, 0);
 * ```
 */
export function createMemoizedRecall(
  recallFn: (state: NetworkState, inputIndex: number) => RecallResult,
  cacheOptions?: { maxSize?: number; ttl?: number }
): (state: NetworkState, inputIndex: number) => RecallResult {
  const cache = new NetworkCache(cacheOptions);
  
  return (state: NetworkState, inputIndex: number) => {
    return cachedRecall(state, inputIndex, recallFn, cache);
  };
}

/**
 * Batch cache warming
 * 
 * Pre-populates cache with results for multiple inputs.
 * Useful for pre-computing common queries.
 * 
 * @param state - Network state
 * @param inputIndexes - Array of input indexes to warm
 * @param recallFn - Recall function to use
 * @param cache - Cache instance to warm
 * 
 * @example
 * ```typescript
 * warmCache(state, [0, 1, 2, 3], recallFromState, globalCache);
 * // Now all recalls for inputs 0-3 will be cached
 * ```
 */
export function warmCache(
  state: NetworkState,
  inputIndexes: number[],
  recallFn: (state: NetworkState, inputIndex: number) => RecallResult,
  cache: NetworkCache = globalCache
): void {
  for (const inputIndex of inputIndexes) {
    const result = recallFn(state, inputIndex);
    cache.set(state, inputIndex, result);
  }
}

export default NetworkCache;
