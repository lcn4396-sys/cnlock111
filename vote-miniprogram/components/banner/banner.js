Component({
  properties: {
    list: { type: Array, value: [] }
  },
  methods: {
    onTap(e) {
      const url = e.currentTarget.dataset.url
      if (url) this.triggerEvent('tap', { linkUrl: url })
    }
  }
})
