import { configure } from '@testing-library/vue';

configure({
  testIdAttribute: 'data-test-id',
});

// Auto cleanup after each test made from vitest
