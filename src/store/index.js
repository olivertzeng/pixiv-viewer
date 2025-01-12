import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import { LocalStorage } from '@/utils/storage'

Vue.use(Vuex)

/**
 * @template T
 * @param {string} key
 * @param {T} def
 * @returns {T}
 */
function getSettingDef(key, def) {
  return LocalStorage.get(key, def)
}

export default new Vuex.Store({
  state: {
    /** @type {number[]} */
    galleryList: [],
    /** @type {string[]} */
    searchHistory: getSettingDef('PIXIV_SearchHistory', []),
    contentSetting: getSettingDef('PXV_CNT_SHOW', {
      r18: false,
      r18g: false,
      ai: false,
    }),
    /** @type {object|null} */
    user: null,
    blockTags: getSettingDef('PXV_B_TAGS', '').split(',').filter(Boolean),
    blockUids: getSettingDef('PXV_B_UIDS', '').split(',').filter(Boolean),
    isNovelViewShrink: true,
    isMobile: navigator.userAgent.includes('Mobile'),
    /** @type {any[]|null} */
    appNotice: null,
    /** @type {any[]|null} */
    seasonEffects: null,
    appSetting: getSettingDef('PXV_APP_SETTING', {
      /** @type {boolean} */
      enableSwipe: LocalStorage.get('PXV_IMG_DTL_SWIPE', false),
      preferDownloadByFsa: true,
      preferDownloadByTm: false,
      dlSubDirByAuthor: false,
    }),
  },
  getters: {
    isLoggedIn(state) {
      return !!state.user
    },
    isCensored: state => artwork => {
      if (state.blockUids.length && state.blockUids.includes(`${artwork?.author?.id}`)) {
        return true
      }
      if (state.blockTags.length) {
        const tags = JSON.stringify(artwork?.tags || [])
        if (state.blockTags.some(e => tags.includes(e))) {
          return true
        }
      }

      if (artwork.x_restrict == 1) {
        if (artwork.illust_ai_type == 2) {
          return !state.contentSetting.r18 || !state.contentSetting.ai
        }
        return !state.contentSetting.r18
      }
      if (artwork.x_restrict == 2) {
        if (artwork.illust_ai_type == 2) {
          return !state.contentSetting.r18g || !state.contentSetting.ai
        }
        return !state.contentSetting.r18g
      }
      if (artwork.illust_ai_type == 2) {
        return !state.contentSetting.ai
      }
      return false
    },
    wfProps: () => ({
      gutter: '8px',
      cols: {
        300: 1,
        600: 2,
        900: 3,
        1200: 4,
        1600: 5,
        1920: 6,
        2400: 7,
        2700: 8,
        3000: 9,
        default: 6,
      },
    }),
    novelMyProps: () => ({
      gutter: '8px',
      cols: {
        600: 1,
        1200: 2,
        1600: 3,
        default: 4,
      },
    }),
  },
  mutations: {
    setGalleryList(state, list = []) {
      if (state.appSetting.enableSwipe) state.galleryList = list.map(e => e.id)
    },
    setSearchHistory(state, obj) {
      if (obj === null) {
        state.searchHistory = []
        LocalStorage.remove('PIXIV_SearchHistory')
      } else {
        if (state.searchHistory.includes(obj)) return false
        if (state.searchHistory.length >= 20) state.searchHistory.pop()
        state.searchHistory.unshift(obj)
        LocalStorage.set('PIXIV_SearchHistory', state.searchHistory)
      }
    },
    saveContentSetting(state, obj) {
      state.contentSetting = obj
      LocalStorage.set('PXV_CNT_SHOW', obj)
    },
    setUser(state, user) {
      state.user = user
    },
    setBlockTags(state, arr) {
      if (Array.isArray(arr)) {
        state.blockTags = _.uniq([...state.blockTags, ...arr])
        LocalStorage.set('PXV_B_TAGS', state.blockTags.join(','))
      }
    },
    setBlockUids(state, arr) {
      if (Array.isArray(arr)) {
        state.blockUids = _.uniq([...state.blockUids, ...arr])
        LocalStorage.set('PXV_B_UIDS', state.blockUids.join(','))
      }
    },
    setIsNovelViewShrink(state, val) {
      state.isNovelViewShrink = val
    },
    setAppNotice(state, val) {
      state.appNotice = val
    },
    setSeasonEffects(state, val) {
      state.seasonEffects = val
    },
    setAppSetting(state, obj) {
      const setting = { ...state.appSetting, ...obj }
      state.appSetting = setting
      LocalStorage.set('PXV_APP_SETTING', setting)
    },
  },
  actions: {
    setGalleryList({ commit }, list) {
      commit('setGalleryList', list)
    },
    setSearchHistory({ commit }, value) {
      commit('setSearchHistory', value)
    },
    appendBlockTags({ commit }, value) {
      commit('setBlockTags', value)
    },
    appendBlockUids({ commit }, value) {
      commit('setBlockUids', value)
    },
  },
})
