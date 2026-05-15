// Counter.test.ts
// =============================================================================
// Comprehensive test suite for Counter component
// Purpose: Learn Vue 3 component testing with props and refs
// =============================================================================

import { mount } from '@vue/test-utils';
import Counter from '@/Components/Counter.vue';

describe('Counter.vue', () => {
  // 'wrapper' stores the component instance created by mount()
  // Each test gets a fresh wrapper via beforeEach()
  let wrapper;

  beforeEach(() => {
    // Mount the component with default props
    // This creates a fresh instance before each test
    wrapper = mount(Counter as any, {
      props: {
        initialCount: 0, // Start count at 0
        label: 'Counter', // Use default label
      },
    });
  });

  // =============================================================================
  // Test 1: Default Props - Component renders with initial values
  // =============================================================================
  it('renders with default props (initialCount: 0, label: "Counter")', () => {
    // Check that the component renders correctly with default props
    // wrapper.text() returns the entire text content, but we need just the counter text
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 0');
  });

  // =============================================================================
  // Test 2: Custom Initial Count - Props are properly passed
  // =============================================================================
  it('renders with custom initialCount prop', () => {
    // Create a new wrapper with a different initialCount value
    wrapper = mount(Counter as any, {
      props: {
        initialCount: 10, // Start count at 10 instead of 0
        label: 'Counter',
      },
    });

    // The count should start at the custom initialCount value
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 10');
  });

  // =============================================================================
  // Test 3: Custom Label - Optional props work correctly
  // =============================================================================
  it('renders with custom label prop', () => {
    // Create a new wrapper with a custom label
    wrapper = mount(Counter as any, {
      props: {
        initialCount: 5,
        label: 'My Counter', // Custom label instead of 'Counter'
      },
    });

    // The label should appear in the rendered text
    expect((wrapper.find('.counter') as any).text()).toBe('My Counter 5');
  });

  // =============================================================================
  // Test 4: Increment - Button click increases count
  // =============================================================================
  it('increments count when increment button is clicked', async () => {
    // Mount with initialCount: 0
    wrapper = mount(Counter as any, {
      props: {
        initialCount: 0,
        label: 'Counter',
      },
    });

    // Find the increment button by its id attribute
    const incrementButton = (wrapper.find('#buttonUp') as any).element;
    expect(incrementButton).toBeDefined();

    // Trigger the click event on the increment button
    await (wrapper.find('#buttonUp') as any).trigger('click');

    // The count should now be 1 (0 + 1)
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 1');
  });

  // =============================================================================
  // Test 5: Decrement - Button click decreases count
  // =============================================================================
  it('decrements count when decrement button is clicked', async () => {
    // Mount with initialCount: 5
    wrapper = mount(Counter as any, {
      props: {
        initialCount: 5,
        label: 'Counter',
      },
    });

    // Find and click the decrement button
    const decrementButton = (wrapper.find('#buttonDown') as any).element;
    expect(decrementButton).toBeDefined();

    await (wrapper.find('#buttonDown') as any).trigger('click');

    // The count should now be 4 (5 - 1)
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 4');
  });

  // =============================================================================
  // Test 6: Reset - Button click resets to initialCount
  // =============================================================================
  it('resets count to initialCount when reset button is clicked', async () => {
    // Mount with initialCount: 1
    wrapper = mount(Counter as any, {
      props: {
        initialCount: 1,
        label: 'Counter',
      },
    });

    // First, increment the count a few times
    await (wrapper.find('#buttonUp') as any).trigger('click');
    await (wrapper.find('#buttonUp') as any).trigger('click');
    await (wrapper.find('#buttonUp') as any).trigger('click');

    // Count should now be 4 (1 + 3)
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 4');

    // Decrement until Reset button is visible (v-if="count < 0")
    for (let i = 0; i < 5; i++) {
      await (wrapper.find('#buttonDown') as any).trigger('click');
    }

    // Find and click the reset button
    const resetButton = (wrapper.find('#Reset') as any).element;
    expect(resetButton).toBeDefined();

    await (wrapper.find('#Reset') as any).trigger('click');

    // The count should reset to the initialCount value (1)
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 1');
  });

  // =============================================================================
  // Test 7: Multiple Resets - Reset always goes to initialCount
  // =============================================================================
  it('always resets to initialCount regardless of current value', async () => {
    // Mount with initialCount: 0
    wrapper = mount(Counter as any, {
      props: {
        initialCount: 0,
        label: 'Counter',
      },
    });

    // Increment to 5
    for (let i = 0; i < 5; i++) {
      await (wrapper.find('#buttonUp') as any).trigger('click');
    }
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 5');

    // Decrement to make Reset button visible (v-if="count < 0")
    for (let i = 0; i < 6; i++) {
      await (wrapper.find('#buttonDown') as any).trigger('click');
    }

    // Find and click the reset button
    const resetButton = (wrapper.find('#Reset') as any).element;
    expect(resetButton).toBeDefined();

    await (wrapper.find('#Reset') as any).trigger('click');
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 0');

    // Increment again to 3
    for (let i = 0; i < 3; i++) {
      await (wrapper.find('#buttonUp') as any).trigger('click');
    }
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 3');

    // Decrement to make Reset button visible (v-if="count < 0")
    for (let i = 0; i < 4; i++) {
      await (wrapper.find('#buttonDown') as any).trigger('click');
    }

    await (wrapper.find('#Reset') as any).trigger('click');
    expect((wrapper.find('.counter') as any).text()).toBe('Counter 0');
  });
});
