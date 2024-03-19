<script>
function loadScript(src) {
  return new Promise(resolve => {
    const script = document.createElement('script')
    script.src = src
    script.addEventListener('load', () => { resolve() }, false)
    document.head.appendChild(script)
  })
}

export default {
  props: {
    options: {
      type: Object,
    },
  },
  data() {
    return {
      dp: null,
    }
  },
  async mounted() {
    if (!window.DPlayer) {
      await loadScript('https://lib.baomitu.com/hls.js/1.5.7/hls.min.js')
      await loadScript('https://lib.baomitu.com/dplayer/1.27.1/DPlayer.min.js')
    }
    await this.$nextTick()
    this.initPlayer()
  },
  beforeDestroy() {
    this.dp.destroy()
    this.dp = null
  },
  methods: {
    initPlayer() {
      this.dp = new window.DPlayer({ ...this.options, container: this.$el })
      const events = this.dp.events
      Object.keys(events).forEach(item => {
        if (item === 'events') {
          return false
        } else {
          events[item].forEach(event => {
            this.dp.on(event, () => this.$emit(event))
          })
        }
      })
    },
  },
  render(h) {
    return h('div', {
      class: 'dplayer',
    }, [])
  },
}
</script>
