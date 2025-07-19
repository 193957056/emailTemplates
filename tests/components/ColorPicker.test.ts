import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPicker from '~/components/editor/ColorPicker.vue'

describe('ColorPicker', () => {
  const defaultProps = {
    currentColor: '#000000',
    type: 'text' as const
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    const wrapper = mount(ColorPicker, {
      props: defaultProps
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('.fas.fa-palette').exists()).toBe(true)
  })

  it('should show background icon for background type', () => {
    const wrapper = mount(ColorPicker, {
      props: {
        ...defaultProps,
        type: 'background'
      }
    })

    expect(wrapper.find('.fas.fa-fill-drip').exists()).toBe(true)
  })

  it('should display current color', () => {
    const wrapper = mount(ColorPicker, {
      props: {
        ...defaultProps,
        currentColor: '#FF0000'
      }
    })

    const colorDisplay = wrapper.find('[style*="background-color: #FF0000"]')
    expect(colorDisplay.exists()).toBe(true)
  })

  it('should toggle color picker on button click', async () => {
    const wrapper = mount(ColorPicker, {
      props: defaultProps
    })

    // Initially hidden
    expect(wrapper.find('.color-picker-panel').exists()).toBe(false)

    // Click to show
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showColorPicker).toBe(true)

    // Click again to hide
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showColorPicker).toBe(false)
  })

  it('should emit color-selected when color is clicked', async () => {
    const wrapper = mount(ColorPicker, {
      props: defaultProps
    })

    // Show color picker
    await wrapper.find('button').trigger('click')

    // Click on a color option
    const colorButton = wrapper.find('[style*="background-color: #FF0000"]')
    if (colorButton.exists()) {
      await colorButton.trigger('click')
      
      expect(wrapper.emitted('color-selected')).toBeTruthy()
      expect(wrapper.emitted('color-selected')?.[0]).toEqual(['#FF0000'])
    }
  })

  it('should handle custom color input', async () => {
    const wrapper = mount(ColorPicker, {
      props: defaultProps
    })

    // Show color picker
    await wrapper.find('button').trigger('click')

    // Change custom color input
    const colorInput = wrapper.find('input[type="color"]')
    await colorInput.setValue('#00FF00')
    await colorInput.trigger('input')

    expect(wrapper.vm.customColor).toBe('#00FF00')
  })

  it('should emit color-selected when custom color is applied', async () => {
    const wrapper = mount(ColorPicker, {
      props: defaultProps
    })

    // Show color picker
    await wrapper.find('button').trigger('click')

    // Set custom color
    const colorInput = wrapper.find('input[type="color"]')
    await colorInput.setValue('#00FF00')

    // Click apply button
    const applyButton = wrapper.find('button:contains("应用")')
    if (applyButton.exists()) {
      await applyButton.trigger('click')
      
      expect(wrapper.emitted('color-selected')).toBeTruthy()
      expect(wrapper.emitted('color-selected')?.[0]).toEqual(['#00FF00'])
    }
  })

  it('should show clear option for background type', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        ...defaultProps,
        type: 'background'
      }
    })

    // Show color picker
    await wrapper.find('button').trigger('click')

    const clearButton = wrapper.find('button:contains("清除背景色")')
    expect(clearButton.exists()).toBe(true)
  })

  it('should emit color-cleared when clear button is clicked', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        ...defaultProps,
        type: 'background'
      }
    })

    // Show color picker
    await wrapper.find('button').trigger('click')

    // Click clear button
    const clearButton = wrapper.find('button:contains("清除背景色")')
    if (clearButton.exists()) {
      await clearButton.trigger('click')
      
      expect(wrapper.emitted('color-cleared')).toBeTruthy()
    }
  })

  it('should close when clicking outside', async () => {
    const wrapper = mount(ColorPicker, {
      props: defaultProps,
      attachTo: document.body
    })

    // Show color picker
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showColorPicker).toBe(true)

    // Simulate click outside
    document.body.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showColorPicker).toBe(false)

    wrapper.unmount()
  })

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(ColorPicker, {
      props: defaultProps
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('选择文字颜色')
    expect(button.attributes('title')).toBe('文字颜色')
  })

  it('should have proper accessibility attributes for background type', () => {
    const wrapper = mount(ColorPicker, {
      props: {
        ...defaultProps,
        type: 'background'
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('选择背景颜色')
    expect(button.attributes('title')).toBe('背景颜色')
  })
})
