<template>
  <div class="setting-page">
    <top-bar id="top-bar-wrap" />
    <h3 class="af_title">{{ $t('psoXLFqv51j1SeKjTbnms') }}</h3>
    <div class="color-list">
      <div v-for="c in colors" :key="c.name" class="color-item" @click="saveActColor(c)">
        <div class="color-bg" :style="{background:c.color}">{{ c.color }}</div>
        <div class="color-name" :style="{color:c.color}">
          <span v-if="c.color == actColor">✅</span>
          <span>{{ c.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const colors = [
  { name: 'MyGO!!!!!', color: '#3388BB', cname: 'MyGO' },
  { name: 'Tomori', color: '#77BBDD' },
  { name: 'Anon', color: '#FF8899' },
  { name: 'Soyo', color: '#FFDD88' },
  { name: 'Taki', color: '#7777AA' },
  { name: 'Rana', color: '#77DD77' },
]

export default {
  name: 'SettingAccentColor',
  components: {
  },
  data() {
    return {
      colors,
      actColor: localStorage.PXV_ACT_COLOR,
    }
  },
  head() {
    return { title: this.$t('psoXLFqv51j1SeKjTbnms') }
  },
  methods: {
    saveActColor(c) {
      window.umami?.track('set_act_color', { name: c.name })
      localStorage.PXV_THEME = c.cname || c.name
      localStorage.PXV_ACT_COLOR = c.color
      setTimeout(() => {
        location.reload()
      }, 500)
    },
  },
}
</script>

<style lang="stylus" scoped>
.color-list
  display flex
  gap 0.2rem
  flex-wrap wrap
  padding 20px
  .color-item
    flex: 0 0 31.8%;
    max-width: 31.8%;
    font-size 0.3rem
    border-radius 0.15rem
    cursor pointer
  .color-bg
    display flex
    justify-content center
    align-items center
    width 100%
    height 1.1rem
    color #fff
    border-radius 0.15rem
  .color-name
    margin-top 10px
    text-align center

</style>
