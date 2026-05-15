import { mount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App', () => {
  it('renders correctly', () => {
    const wrapper = mount(App as any);
    expect(wrapper.exists()).toBe(true);
  });
});
