import chart from './chart'

export default {
  mixins: [chart],

  computed: {
    curPoints() {
      if (this.points) {
        return this.points
      }

      const {gap, xRatio, yRatio, low, canvas} = this.Artboard
      const {x0, y1} = canvas

      return this.values.map((value, i) => {
        let [start, end] = value

        if (start < 0) {
          [end, start] = value
        }

        start = Math.max(low, start)

        const y = isNaN(end) ? null : y1 - (end - low) * yRatio
        const y0 = isNaN(start) ? null : y1 - (start - low) * yRatio
        const x = x0 + xRatio * i + gap

        return [x, y, y0]
      })
    },

    pointSlot() {
      const scoped = this.$scopedSlots.default

      return (
        scoped &&
        this.curPoints.map((p, i) =>
          scoped({
            x: p[0],
            y: p[1],
            value: this.raws[i],
            index: i,
            style: {
              transition: this.trans
            }
          })
        )
      )
    },

    valueSlot() {
      const h = this.$createElement

      return (
        this.showValue &&
        h(
          'g',
          {
            attrs: {
              fill: this.curColor
            }
          },
          this.curPoints.map((point, i) => {
            return h(
              'text',
              {
                attrs: {
                  x: point[0],
                  y: point[1],
                  dy: '-0.31em',
                  'text-anchor': 'middle'
                }
              },
              this.raws[i]
            )
          })
        )
      )
    }
  }
}