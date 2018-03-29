import plane from '../mixins/plane'

export default {
  name: 'LaCartesian',

  mixins: [plane],

  /**
   * @todo Need to optimize. The Props changes will call update even if it does not need.
   * https://github.com/vuejs/vue/issues/5727
   */
  render(h) {
    const {viewWidth, height, autoresize} = this
    const slots = this.$slots.default || []

    /**
     * Reset snap
     */
    this.snap = {}

    const props = []
    const cartesians = []
    const objects = []
    const widgets = []
    const others = []

    slots.forEach(slot => {
      const options = slot.componentOptions
      if (!options) {
        others.push(slot)
        return
      }
      const sealed = options.Ctor.sealedOptions
      if (!sealed) {
        return
      }
      const {propsData} = options
      const {prop} = propsData

      switch (sealed.type) {
        case 'cartesian':
          if (prop && props.indexOf(prop) < 0) {
            props.push(prop)
          }
          slot.index = cartesians.length
          cartesians.push(slot)
          break
        case 'object':
          this.addSpace(sealed.space)
          objects.push(slot)
          break
        case 'widget':
          widgets.push(slot)
          break
        default:
          break
      }
      if (sealed.preload) {
        sealed.preload({data: propsData, parent: this, index: slot.index})
      }
    })

    this.props = props

    return h(
      'div',
      {
        style: {
          position: 'relative',
          width: autoresize ? '100%' : viewWidth + 'px'
        }
      },
      [
        h(
          'svg',
          {
            attrs: {
              width: viewWidth,
              height,
              viewBox: `0 0 ${viewWidth} ${height}`
            }
          },
          [others, cartesians, objects]
        ),
        widgets
      ]
    )
  }
}