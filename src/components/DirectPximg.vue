<template>
  <img :class="{'fadeIn':!loading}" :src="directSrc" :style="bgStyle" :lazy="lazy" :alt="alt">
</template>

<script>
import { randomBg } from '@/utils'

const loadingSvg = require('@/icons/loading.svg')
const defSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

export default {
  name: 'DirectPximg',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
    nobg: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      localSrc: '',
    }
  },
  computed: {
    lazy() {
      return this.nobg && this.loading ? 'loading' : undefined
    },
    bgStyle() {
      return { background: !this.nobg && this.loading ? randomBg() : 'none' }
    },
    directSrc() {
      return this.loading
        ? (this.nobg ? loadingSvg : defSrc)
        : this.localSrc
    },
  },
  mounted() {
    this.setObserver()
  },
  destroyed() {
    if (this.localSrc?.startsWith('blob:')) {
      URL.revokeObjectURL(this.localSrc)
    }
  },
  methods: {
    setObserver() {
      const options = {
        rootMargin: '0px 50px 50px 0px',
        threshold: [0],
      }
      const ob = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && this.loading) {
          this.setImgSrc()
          ob.disconnect()
        }
      }, options)
      ob.observe(this.$el)
    },
    async setImgSrc() {
      try {
        const url = new URL(this.src)
        if (!window.__httpRequest__ || url.host == 's.pximg.net') {
          this.localSrc = this.src
          this.loading = false
          return
        }
        url.protocol = 'http:'
        url.host = '210.140.139.130'
        const { data } = await window.__httpRequest__(url.href, JSON.stringify({
          responseType: 'blob',
          headers: { Host: 'i.pximg.net', Referer: 'https://www.pixiv.net/' },
        }))
        this.localSrc = URL.createObjectURL(data)
        this.loading = false
      } catch (error) {
        console.log('error: ', error)
      }
    },
  },
}
</script>
