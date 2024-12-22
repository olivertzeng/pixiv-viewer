// import 'swiper/css/swiper.css'
import '@/assets/style/base.styl'
import '@/assets/style/theme.styl'

import '@vant/touch-emulator'
import './polyfill'
import './registerServiceWorker'

import { init } from 'console-ban'
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueMasonry from 'vue-masonry-css'
import VueMeta from 'vue-meta'
import Vant, { Dialog, ImagePreview, Lazyload, Notify, Toast } from 'vant'

import SvgIcon, { loadingSvg } from './icons'
import ImageLayout from './components/ImageLayout.vue'
import TopBar from './components/TopBar.vue'
import Pximg from './components/DirectPximg.vue'
import App from './App.vue'
import router from './router'
import store from './store'
import longpress from './directives/longpress'
import { LocalStorage } from './utils/storage'
import { getSelectedLang, i18n, initLocale } from './i18n'
import { getActionMap } from './api/client/action'
import { initBookmarkCache } from './utils/storage/siteCache'
import { isProduction } from './consts'

setupApp()

async function setupApp() {
  await checkWechat()
  await checkBrowser()
  await initSetting()
  await initLocalApi()
  await initLocale()

  Vue.use(Toast)
  Vue.use(ImagePreview)
  Vue.use(Lazyload, {
    observer: true,
    lazyComponent: true,
    loading: localStorage.PXV_ACT_COLOR ? loadingSvg(localStorage.PXV_ACT_COLOR) : require('@/icons/loading.svg'),
    preload: 1.3,
  })
  Vue.use(Vant)
  Vue.use(VueAwesomeSwiper)
  Vue.use(VueMasonry)
  Vue.use(VueMeta, { keyName: 'head' })
  Vue.use(SvgIcon)
  Vue.use(longpress)

  Vue.component('WfCont', ImageLayout)
  Vue.component('TopBar', TopBar)
  Vue.component('Pximg', Pximg)

  Vue.config.productionTip = false

  new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
  }).$mount('#app')

  if (isProduction) {
    init()
  }
}

async function initLocalApi() {
  const config = LocalStorage.get('PXV_CLIENT_CONFIG', {})
  window.APP_CONFIG = config
  if (!config.useLocalAppApi) return
  window.__localApiMap__ = await getActionMap()
  await initBookmarkCache()
}

async function initSetting() {
  let flag = false
  const setting = LocalStorage.get('PXV_CNT_SHOW', {})
  const isOn = () => LocalStorage.get('PXV_NSFW_ON', null)
  if (isOn() == null && (setting.r18 || setting.r18g)) {
    LocalStorage.set('PXV_NSFW_ON', 1)
  }
  try {
    if (!isOn() || getSelectedLang() != 'zh-Hans') return true
    document.documentElement.innerHTML = ''
    location.replace('/zq39i1hjru.html')
    flag = true
  } catch (error) {
    return true
  }
  if (flag) throw new Error('BLOCKED.')
}

async function checkWechat() {
  if (/MicroMessenger|QQ/i.test(navigator.userAgent)) {
    document.body.innerHTML = '<h1 style="margin:10px;font-size:32px">FUCK WECHAT</h1>'
    Dialog.alert({
      message: i18n.t('tip.browser_tip'),
      theme: 'round-button',
    })
    throw new Error('BLOCKED.')
  }
  return true
}

async function checkBrowser() {
  if (/Quark|QQBrowser|baidu|NewsArticle|UCBrowser|Huawei|HeyTap|Miui|Vivo|Oppo|360se|Sogou/i.test(navigator.userAgent)) {
    document.body.innerHTML = ''
    Dialog.alert({
      message: i18n.t('tip.browser_tip'),
      theme: 'round-button',
    })
    throw new Error('BLOCKED.')
  }
  const chromeVer = parseInt(navigator.userAgent.match(/Chrome\/([\d.]+)/)?.[1])
  if (chromeVer && chromeVer < 106) {
    Notify({
      message: i18n.t('tip.browser_latest'),
      color: '#fff',
      background: localStorage.PXV_ACT_COLOR || '#f1c25f',
      duration: 2500,
    })
  }
  return true
}

// async function checkIncognito() {
//   let flag = false
//   try {
//     const { quota } = await navigator.storage.estimate()
//     if (quota.toString().length > 10) return true
//     document.body.innerHTML = ''
//     Dialog.alert({
//       message: 'Please use a normal tab to continue browsing.',
//       confirmButtonText: 'OK',
//     })
//     flag = true
//   } catch (error) {
//     return true
//   }
//   if (flag) throw new Error('BLOCKED.')
// }
