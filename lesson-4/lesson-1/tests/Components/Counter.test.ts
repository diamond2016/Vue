// Counter.test.ts

import { mount } from '@vue/test-utils';
import Counter from '@/Components/Counter.vue';

describe('Counter.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Counter);
  });

  it('renders the initial count of 0', () => {
    expect(wrapper.text()).toContain('Count is 0');
  });

  it('increments the count when the increment button is clicked', async () => {
    const incrementButton = wrapper.find('#buttonUp');
    await incrementButton.trigger('click');

    expect(wrapper.text()).toContain('Count is 1');
  });

  it('decrements the count when the decrement button is clicked', async () => {
    const decrementButton = wrapper.find('#buttonDown');
    await decrementButton.trigger('click');

    expect(wrapper.text()).toContain('Count is -1');
  });

  it('shows the reset button when the count is less than 0', async () => {
    const decrementButton = wrapper.find('#buttonDown');
    await decrementButton.trigger('click');

    const resetButton = wrapper.find('#Reset');
    expect(resetButton.exists()).toBe(true);
  });

  it('resets the count to 0 when the reset button is clicked', async () => {
    const decrementButton = wrapper.find('#buttonDown');
    await decrementButton.trigger('click');

    const resetButton = wrapper.find('#Reset');
    await resetButton.trigger('click');

    expect(wrapper.text()).toContain('Count is 0');
  });
});
