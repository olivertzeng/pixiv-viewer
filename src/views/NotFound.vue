<template>
  <div class="NotFound">
    <img src="/img/404.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  head: {
    title: '404 Not Found',
  },
  created() {
    const url = Object.keys(this.$route.query).find(e => e.startsWith('http'))
    if (url) location.assign(url)
  },
}
</script>

<style lang="stylus" scoped>
.NotFound
  padding-top 1rem
  text-align center

  img
    max-width 80%

</style>
