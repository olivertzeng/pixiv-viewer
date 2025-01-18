<script>
import { loadScript } from '@/utils'

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
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.7/hls.min.js')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.27.1/DPlayer.min.js')
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
