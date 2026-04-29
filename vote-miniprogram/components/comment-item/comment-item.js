Component({
  properties: {
    item: { type: Object, value: {} }
  },
  methods: {
    onLike() {
      const id = this.properties.item.id
      if (id) this.triggerEvent('like', { commentId: id })
    }
  }
})
