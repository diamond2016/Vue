import { vi } from 'vitest';

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(
    (
      query
    ): {
      matches: boolean;
      media: string;
      onchange: null;
      addListener: () => void;
      removeListener: () => void;
      addEventListener: () => void;
      removeEventListener: () => void;
      dispatchEvent: () => void;
    } => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn() as unknown as (typeof window)['addListener'],
      removeListener: vi.fn() as unknown as (typeof window)['removeListener'],
      addEventListener: vi.fn() as unknown as (typeof window)['addEventListener'],
      removeEventListener: vi.fn() as unknown as (typeof window)['removeEventListener'],
      dispatchEvent: vi.fn() as unknown as (typeof window)['dispatchEvent'],
    })
  ),
});
