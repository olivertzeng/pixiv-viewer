<template>
  <div class="artwork">
    <TopBar />
    <div class="more_btn" @click="showSettings=!showSettings">
      <Icon class="icon" name="novel_setting" />
    </div>
    <div class="ia-cont" :class="{ isCollapseMeta }">
      <div class="ia-left">
        <van-loading v-if="loading" size="50px" style="margin-top: 3rem;" />
        <template v-else>
          <NovelView :artwork="artwork" :text-obj="novelText" :text-config="textConfig" />
          <div class="collapse-btn" @click="isCollapseMeta=!isCollapseMeta">
            <Icon class="icon" name="double_arrow_down" />
          </div>
        </template>
      </div>
      <div class="ia-right">
        <van-skeleton class="skeleton" title avatar :row="5" avatar-size="42px" :loading="loading">
          <NovelMeta is-novel :artwork="artwork" />
        </van-skeleton>
        <div v-if="!loading" class="series-btns">
          <van-button v-if="novelText.prev" color="#7232dd" size="small" plain block @click="toNovel(novelText.prev.id)">
            {{ $t('novel.series.prev') }} {{ novelText.prev.title }}
          </van-button>
          <van-button v-if="novelText.next" color="#7232dd" size="small" plain block @click="toNovel(novelText.next.id)">
            {{ $t('novel.series.next') }} {{ novelText.next.title }}
          </van-button>
          <van-button type="info" size="small" plain block @click="share">
            {{ $t('artwork.share.share') }}
          </van-button>
          <van-button type="info" size="small" plain block @click="downloadNovel">
            {{ $t('common.download') }}
          </van-button>
          <van-button type="info" size="small" plain block @click="showComments = true">
            {{ $t('user.view_comments') }}
          </van-button>
          <van-popover
            v-if="showPntBtn"
            v-model="showPntPopover"
            :actions="pntActions"
            trigger="click"
            placement="top"
            style="width: 100%;"
            @select="onPntSelect"
          >
            <template #reference>
              <van-button v-if="showPntBtn" type="info" size="small" plain block>
                翻译
              </van-button>
            </template>
          </van-popover>
        </div>
        <keep-alive>
          <AuthorNovelCard v-if="artwork.author" :id="artwork.author.id" :key="artwork.id" />
        </keep-alive>
      </div>
    </div>
    <van-divider style="margin: 0.7rem 0;" />
    <keep-alive>
      <RelatedNovel :key="artwork.id" :artwork="artwork" />
    </keep-alive>
    <van-share-sheet v-model="showShare" :title="$t('artwork.share.title')" :options="shareOptions" @select="onShareSel" />
    <van-action-sheet v-model="showSettings" class="setting-actions" :title="$t('novel.settings.title')" :overlay="false">
      <div class="configs">
        <div class="conf-title">{{ $t('novel.settings.text.size') }}</div>
        <div class="conf-inp">
          <van-slider v-model="textConfig.size" :min="12" :max="36" class="conf-slider" @change="onSizeChange">
            <template #button>
              <div class="van-slider__button">{{ textConfig.size }}</div>
            </template>
          </van-slider>
        </div>
        <div class="conf-fcont">
          <div class="conf-fitem">
            <div class="conf-title">{{ $t('novel.settings.text.font') }}</div>
            <div class="conf-inp">
              <van-radio-group v-model="textConfig.font" direction="horizontal">
                <van-radio name="inherit">LXGW</van-radio>
                <van-radio name="sans-serif" style="font-family: sans-serif;">{{ $t('novel.settings.text.sans') }}</van-radio>
                <van-radio name="serif" style="font-family: serif;">{{ $t('novel.settings.text.serif') }}</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="conf-fitem">
            <div class="conf-title">{{ $t('novel.settings.text.direction') }}</div>
            <div class="conf-inp">
              <van-radio-group v-model="textConfig.direction" direction="horizontal">
                <van-radio name="h">{{ $t('novel.settings.text.direct_h') }}</van-radio>
                <van-radio name="v">{{ $t('novel.settings.text.direct_v') }}</van-radio>
              </van-radio-group>
            </div>
          </div>
        </div>
        <div class="conf-title">{{ $t('novel.settings.text.height') }}</div>
        <div class="conf-inp">
          <van-slider v-model="textConfig.height" :min="1" :max="5" :step="0.1" class="conf-slider" @change="onSizeChange">
            <template #button>
              <div class="van-slider__button">{{ textConfig.height }}</div>
            </template>
          </van-slider>
        </div>
        <div class="conf-title">{{ $t('novel.settings.text.weight') }}</div>
        <div class="conf-inp">
          <van-slider v-model="textConfig.weight" :min="100" :max="900" :step="100" class="conf-slider" @change="onSizeChange">
            <template #button>
              <div class="van-slider__button">{{ textConfig.weight }}</div>
            </template>
          </van-slider>
        </div>
        <div class="conf-fcont">
          <div class="conf-fitem">
            <div class="conf-title">{{ $t('novel.settings.text.color') }}</div>
            <div class="conf-inp">
              <input v-model="textConfig.color" type="color">
            </div>
          </div>
          <div class="conf-fitem">
            <div class="conf-title">{{ $t('novel.settings.text.bg') }}</div>
            <div class="conf-inp">
              <input v-model="textConfig.bg" type="color">
            </div>
          </div>
        </div>
      </div>
    </van-action-sheet>
    <van-popup
      v-model="showComments"
      class="comments-popup"
      position="right"
      get-container="body"
      closeable
    >
      <template v-if="showComments">
        <p class="comments-title">{{ $t('hGqGftQ7v772prEac1hbJ') }}</p>
        <CommentsArea :id="artwork.id" is-novel :count="0" :limit="10" />
      </template>
    </van-popup>
  </div>
</template>

<script>
import _ from 'lodash'
import FileSaver from 'file-saver'
import { mapGetters } from 'vuex'
import { Dialog, ImagePreview } from 'vant'
import api from '@/api'
import { PIXIV_NEXT_URL } from '@/consts'
import { copyText, loadScript } from '@/utils'
import { getCache, setCache } from '@/utils/storage/siteCache'
import { LocalStorage } from '@/utils/storage'
import { i18n } from '@/i18n'
import TopBar from '@/components/TopBar'
import NovelView from './components/NovelView.vue'
import Meta from './components/Meta'
import AuthorNovelCard from './components/AuthorNovelCard.vue'
import RelatedNovel from './components/RelatedNovel.vue'
import CommentsArea from './components/Comment/CommentsArea.vue'
import IconLink from '@/assets/images/share-sheet-link.png'
import IconQQ from '@/assets/images/share-sheet-qq.png'
import IconQrcode from '@/assets/images/share-sheet-qrcode.png'
import IconQzone from '@/assets/images/share-sheet-qzone.png'
import IconWeb from '@/assets/images/share-sheet-web.png'
import IconWechat from '@/assets/images/share-sheet-wechat.png'
import IconWeibo from '@/assets/images/share-sheet-weibo.png'
import IconTwitter from '@/assets/images/share-sheet-twi.png'
import IconFacebook from '@/assets/images/share-sheet-facebook.png'

const textConfig = LocalStorage.get('PXV_TEXT_CONFIG', {
  size: 16,
  height: 2,
  font: 'inherit',
  weight: 400,
  direction: 'h',
  color: '#1f1f1f',
  bg: '#ffffff',
})

export default {
  name: 'NovelDetail',
  components: {
    TopBar,
    NovelMeta: Meta,
    AuthorNovelCard,
    NovelView,
    RelatedNovel,
    CommentsArea,
  },
  data() {
    return {
      loading: false,
      artwork: {},
      novelText: {},
      showShare: false,
      shareOptions: [
        { name: i18n.t('artwork.share.type.web'), icon: IconWeb },
        { name: i18n.t('artwork.share.type.copylink'), icon: IconLink },
        { name: i18n.t('artwork.share.type.qrcode'), icon: IconQrcode },
        { name: i18n.t('artwork.share.type.weibo'), icon: IconWeibo },
        { name: i18n.t('artwork.share.type.qzone'), icon: IconQzone },
        { name: 'QQ', icon: IconQQ },
        { name: i18n.t('artwork.share.type.wechat'), icon: IconWechat },
        { name: 'Twitter', icon: IconTwitter },
        { name: 'Facebook', icon: IconFacebook },
      ],
      showSettings: false,
      textConfig,
      isCollapseMeta: false,
      showComments: false,
      showPntPopover: false,
      pntActions: [
        { text: '加载沉浸式翻译 SDK', className: 'imt' },
        { text: 'SiliconCloud(glm-4-9b-chat)', className: 'sc' },
        { text: '微软翻译', className: 'ms' },
        { text: '谷歌翻译', className: 'gg' },
      ],
    }
  },
  head() {
    return this.artwork.title
      ? {
          title: this.artwork.title + ' - ' + this.artwork.author?.name,
        }
      : {}
  },
  computed: {
    ...mapGetters(['isCensored']),
    showPntBtn() {
      return i18n.locale.includes('zh') && !/中文|中国语|Chinese|中國語|中国語/.test(JSON.stringify(this.artwork.tags))
    },
  },
  watch: {
    $route() {
      if (
        this.$route.name === 'NovelDetail' &&
        this.$route.params.id != this.artwork.id
      ) {
        this.init()
      }
    },
    textConfig: {
      deep: true,
      handler(val) {
        LocalStorage.set('PXV_TEXT_CONFIG', val)
      },
    },
    showComments(val) {
      document.documentElement.style.overflowY = val ? 'hidden' : ''
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      const id = +this.$route.params.id
      this.artwork = {}
      this.novelText = {}
      Promise.all([
        this.getArtwork(id),
        this.getNovelText(id),
      ]).finally(() => {
        this.loading = false
      })
    },
    async getNovelText(id) {
      const res = await api.getNovelText(id)
      if (res.status === 0) {
        this.novelText = res.data
      } else {
        this.$toast({
          message: res.msg,
          icon: require('@/icons/error.svg'),
          duration: 3000,
        })
      }
    },
    async getArtwork(id) {
      const res = await api.getNovelDetail(id)
      if (res.status === 0) {
        this.artwork = res.data

        if (this.isCensored(this.artwork)) {
          this.$toast({
            message: this.$t('common.content.hide'),
            icon: require('@/icons/ban-view.svg'),
          })
        }

        let historyList = await getCache('novels.history', [])
        if (!Array.isArray(historyList)) historyList = []
        if (historyList.length > 100) historyList = historyList.slice(0, 100)
        historyList = _.uniqBy([res.data, ...historyList], 'id')
        setCache('novels.history', historyList)
      } else {
        this.$toast({
          message: res.msg,
          icon: require('@/icons/error.svg'),
          duration: 3000,
        })
      }
    },
    onShareSel(_, index) {
      const actions = [
        async () => {
          const shareData = {
            title: 'Pixiv Viewer',
            text: `${this.$t('artwork.share.share')} ${this.artwork.author.name} ${this.$t('artwork.share.of_art')} ${this.artwork.title} - ID: ${this.artwork.id}`,
            url: `${location.href}`,
          }
          try {
            await navigator.share(shareData)
          } catch (error) {
            console.log('error: ', error)
          }
        },
        () => {
          copyText(
            location.href,
            () => this.$toast(this.$t('tips.copylink.success')),
            err => this.$toast(this.$t('tips.copylink.error') + err)
          )
        },
        () => {
          ImagePreview({
            closeable: true,
            images: [`https://api.moedog.org/qr/?url=${encodeURIComponent(location.href)}`],
          })
        },
        () => {
          this.openUrl(`https://service.weibo.com/share/share.php?language=zh_cn&searchPic=true&url=${encodeURIComponent(location.href)}&title=${encodeURIComponent(`${this.$t('artwork.share.share')} ${this.artwork.author.name} ${this.$t('artwork.share.of_art')} ${this.artwork.title} - PID: ${this.artwork.id}`)}&summary=PID%3A${this.artwork.id}&pic=${this.artwork.images[0].l}`)
        },
        () => {
          this.openUrl(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=${this.artwork.title}&url=${encodeURIComponent(location.href)}&pics=${this.artwork.images[0].l}&summary=${encodeURIComponent(this.artwork.author.name + ' - PID: ' + this.artwork.id)}`)
        },
        () => {
          this.openUrl(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(location.href)}&title=${this.artwork.title}&source=${encodeURIComponent(location.href)}&desc=${encodeURIComponent(`${this.$t('artwork.share.share')} ${this.artwork.author.name} ${this.$t('artwork.share.of_art')} ${this.artwork.title} - PID: ${this.artwork.id}`)}&summary=${encodeURIComponent(`${this.$t('artwork.share.share')} ${this.artwork.author.name} ${this.$t('artwork.share.of_art')} ${this.artwork.title} - PID: ${this.artwork.id}`)}`)
        },
        () => {
          this.openUrl(`https://wechat-share.pwp.space/?url=${encodeURIComponent(location.href)}&title=${this.artwork.title}`)
        },
        () => {
          this.openUrl(`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.pixiv.net/novel/show.php?id=${this.artwork.id}`)}&text=${this.artwork.title}&hashtags=pixiv`)
        },
        () => {
          this.openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.pixiv.net/novel/show.php?id=${this.artwork.id}`)}`)
        },
      ]
      actions[index]?.()
    },
    openUrl(url) {
      window.open(url, '_blank', 'noopener noreferrer')
    },
    async share() {
      this.showShare = true
    },
    toNovel(id) {
      this.$router.push(`/novel/${id}`)
    },
    onSizeChange(value) {
      this.$toast(this.$t('tips.current_value') + value)
    },
    downloadNovel() {
      FileSaver.saveAs(new Blob([this.novelText.text]), `${this.artwork.id}_${this.artwork.title}.txt`)
    },
    async onPntSelect(action) {
      const fns = {
        imt: () => this.loadImtSdk(),
        sc: async () => this.fanyi('sc', await this.getNoTranslateWords()),
        ms: async () => this.fanyi('ms', await this.getNoTranslateWords()),
        gg: () => this.fanyi('gg'),
      }
      const fn = fns[action.className]
      fn && (await fn())
    },
    async getNoTranslateWords() {
      return new Promise(resolve => {
        Dialog.confirm({
          title: '填写不翻译的文本',
          message: `
          <div id="get_pnt_nots_dialog">
            <p style="margin:0.2rem 0">选择或输入不翻译的单词，以英文逗号分隔，留空跳过</p>
            <input id="get_pnt_nots_input" type="text" >
            <div style="height:1px;margin:0.2rem 0;border-bottom:1px solid #ccc"></div>
            ${this.artwork.tags.map(e => `<div class="sel_block_chks"><input type="checkbox" data-tagname="${e.name}">${e.name}</div>`).join('')}
          </div>`,
          lockScroll: false,
          closeOnPopstate: true,
          cancelButtonText: this.$t('common.cancel'),
          confirmButtonText: this.$t('common.confirm'),
          beforeClose: (action, done) => {
            if (action == 'confirm') {
              const tags = document.querySelectorAll('#get_pnt_nots_dialog input[data-tagname]:checked')
              let tagInp = document.querySelector('#get_pnt_nots_input')?.value || ''
              if (tags.length) tagInp = `${[...tags].map(e => e.getAttribute('data-tagname')).join(',')},${tagInp}`
              if (tagInp.endsWith(',')) tagInp = tagInp.slice(0, -1)
              resolve(tagInp)
            }
            done()
          },
        }).catch(() => {})
      })
    },
    async fanyi(srv, nots = '') {
      try {
        const loading = this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '加载时间较长，请耐心等待',
        })
        const cacheKey = `novel.translate.${this.artwork.id}.${srv}.${nots}`
        let res = await getCache(cacheKey)
        if (!res) {
          let url = `${PIXIV_NEXT_URL}/api/pixiv-novel-translate/${this.artwork.id}.html?srv=${srv}`
          if (nots) url += `&nots=${nots}`
          res = await fetch(url).then(r => r.text())
          if (!res.includes('Translate failed')) setCache(cacheKey, res)
        }
        this.novelText.text = res
        loading.clear()
      } catch (err) {
        console.log('fanyi err: ', err)
      }
    },
    async loadImtSdk() {
      if (!localStorage.getItem('PXV_IMT_SDK_CFMED')) {
        const res = await Dialog.confirm({
          title: '加载沉浸式翻译 SDK',
          message: '提示：如果已安装沉浸式翻译浏览器插件则无需加载沉浸式翻译 SDK',
          lockScroll: false,
          closeOnPopstate: true,
          cancelButtonText: '取消',
          confirmButtonText: '加载',
        }).catch(() => 'cancel')
        if (res != 'confirm') return
      }
      localStorage.setItem('PXV_IMT_SDK_CFMED', '1')
      if (window.immersiveTranslateConfig) return
      window.immersiveTranslateConfig = {
        pageRule: {
          selectors: ['.novel_text'],
          translationClasses: ['color-gray'],
        },
      }
      await loadScript('https://download.immersivetranslate.com/immersive-translate-sdk-latest.js')
      const style = document.createElement('style')
      style.innerHTML = `
      .imt-fb-more-buttons .btn-animate:first-child,
      .imt-fb-more-buttons .btn-animate:last-child,
      .btn-animate[title="关闭悬浮球"],
      .popup-container .popup-content > div.flex:first-child,
      .popup-container .trial-pro-container,
      .popup-container .text-sm.px-1.text-gray-2,
      .popup-container .widgets-container.mt-5,
      .popup-container footer,
      .translation-service-container select option[value="deepl"],
      .translation-service-container select option[value="openai"],
      .translation-service-container select option[value="gemini"],
      .translation-service-container select option[value="claude"],
      .translation-service-container select option[value="more"] {
        display: none !important;
      }`
      setTimeout(() => {
        document.querySelector('#immersive-translate-popup')?.shadowRoot?.appendChild(style)
      }, 800)
    },
  },
}
</script>

<style lang="stylus">
img[src*="https://api.moedog.org/qr/?url="]
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 5rem !important
  height 5rem !important

.app-main:has(.artwork)
  padding 0

  .related
    padding-left 16px
    padding-right 16px
</style>
<style lang="stylus" scoped>
.comments-title
  padding 40px 0 0 40px
  font-size 0.45rem
  font-weight bold
.artwork
  .skeleton
    margin: 30px 0;
  .more_btn
    position: fixed;
    top: 0.9rem;
    right 0.5rem;
    z-index: 99;
    font-size 0.675rem
    cursor pointer
    .svg-icon
      color: #fafafa;
      filter: drop-shadow(0.02667rem 0.05333rem 0.05333rem rgba(0,0,0,0.8));

  .series-btns
    padding 0 40px
    ::v-deep
      .van-button
        &:not(:last-child)
          margin-bottom 10px
        .van-button__text
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap

  ::v-deep .van-share-sheet
    width 10rem !important
    left 50% !important
    margin-left -5rem !important
  ::v-deep .van-share-sheet__option:first-child img
    background: #f2f3f5;
    border-radius: 50%;
  ::v-deep .van-share-sheet__options::-webkit-scrollbar
    height 0.12rem

.setting-actions
  max-width 750px
  height 600px
  overflow-y auto
  left unset
  right 0
  box-shadow 0px 0px 8px 2px #ccc;
  .configs
    padding 20px 50px 120px
  .conf-fcont
    display flex
    align-items center
  .conf-fitem
    width 50%
    flex 1
  .conf-title
    margin 20px 0 30px
    padding: 20px 16px 0 16px;
    color: #777
    font-size: 15PX;
    font-weight bold
  .conf-inp
    padding-left 20px
  .conf-slider
    margin-top 40px
    ::v-deep .van-slider__button
      display flex
      justify-content center
      align-items center
      width: auto
      padding: 0.1rem
      height: auto
      border-radius: 0.2rem
      font-family Bahnschrift, Dosis, Arial, Helvetica, sans-serif

.ia-cont
  display flex
  align-items flex-start
  min-height 100vh

  .ia-left
    position relative
    display flex
    justify-content center
    align-items center
    width 72%
    min-width 72%
    margin-top 20px
    padding 0 20px

    .collapse-btn
      position absolute
      z-index 99
      right 0
      top 200px
      display flex
      justify-content center
      align-items center
      width 60px
      height 60px
      background #f5f5f5
      border-top-left-radius 10px
      border-bottom-left-radius 10px
      cursor pointer
      .icon
        font-size 50px
        transform rotate(-90deg)

    ::v-deep .image-box
      width: 100% !important
      height: auto !important
      min-width 300px
      min-height 300px
      &:not(:last-child)
        margin-bottom 10px

      .image
        width auto
        max-width 100%
        height auto
        max-height 96vh
        margin 0 auto

  .ia-right
    max-width 28%
    margin-bottom 60px
    padding-right 40px
    box-sizing border-box
    overflow hidden
    transform translateX(0)
    opacity 1
    transition 0.2s
    ::v-deep
      .artwork-meta
        padding 20px 30px 40px
        background #f5f5f5
        border-radius 20px
      .shrink::after
        background: linear-gradient(to top, #f5f5f5, rgba(255,255,255,0));

.artwork
  ::v-deep .top-bar-wrap
    width 30vw
    background none

  .isCollapseMeta
    justify-content center
    .ia-left
      width 100%
      .collapse-btn
        position fixed
        top: 2.7rem;
        right: 0.4rem;
        border-radius 10px
        .icon
          transform: rotate(90deg);
    .ia-right
      transform translateX(100%)
      opacity 0
      width 0
      padding-right 0
      margin-bottom 0

@media screen and (max-width: 1200px)
  .ia-cont
    display block !important

  .ia-left
    width 100% !important
    margin 0 auto !important
    padding 0 !important

    .collapse-btn
      display none !important

    ::v-deep .image
      max-width: 100% !important
      max-height: 90vh !important
    ::v-deep .novel_text
      width 660px

  .ia-right
    max-width unset !important
    padding-right 0 !important
    .artwork-meta
      margin 20px 10px !important
      padding 20px 30px
    ::v-deep
      .artwork-list
        height 4.5rem !important
      .author-card .artwork-list-wrap .artwork-list .swiper-slide .image-slide
        height 4.2rem !important

</style>
