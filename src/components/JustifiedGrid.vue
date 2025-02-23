<template>
  <justified-grid
    ref="grid"
    class="justified-grid"
    default-direction="end"
    :gap="10"
    :column-range="[1, 6]"
    :row-range="0"
    :size-range="[200, 1000]"
    :is-cropped-size="false"
    :displayed-row="-1"
    :stretch="false"
    :stretch-range="[144,320]"
    :pass-unstretch-row="true"
    :use-transform="true"
    :use-resize-observer="true"
    :observe-children="true"
    :auto-resize="true"
  >
    <slot></slot>
  </justified-grid>
</template>
<script>
import { JustifiedGrid } from '@egjs/vue-grid'
export default {
  components: { JustifiedGrid },
  updated() {
    this.$refs.grid?.syncElements()
  },
}
</script>
