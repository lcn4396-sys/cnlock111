Component({
  properties: {
    show: { type: Boolean, value: false }
  },
  data: {
    title: '',
    desc: '',
    extra: ''
  },
  methods: {
    onClose() {
      this.triggerEvent('close')
    },
    onBoxTap() {
      // 阻止点击弹窗内容时冒泡到蒙层，避免误关且保证输入框可点击
    },
    onTitleInput(e) { this.setData({ title: e.detail.value }) },
    onDescInput(e) { this.setData({ desc: e.detail.value }) },
    onExtraInput(e) { this.setData({ extra: e.detail.value }) },
    onSubmit() {
      this.triggerEvent('submit', { title: this.data.title, desc: this.data.desc, extra: this.data.extra })
    }
  }
})
