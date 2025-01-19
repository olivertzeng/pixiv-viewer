import Mint from 'mint-filter'
import store from '@/store'
import { getCache, setCache } from './storage/siteCache'
import { COMMON_PROXY } from '@/consts'

const re1 = /漫画|描き方|お絵かきTIPS|manga|BL|スカラマシュ|散兵|雀魂|じゃんたま/i
const re2 = /R-?18|恋童|ペド|幼女|萝莉|loli|小学生|BL|腐|スカラマシュ|散兵|雀魂|じゃんたま/i

const blockedUserIds = [24517, 14002767, 16776564, 33333, 423251, 27526, 13150573]
export function filterHomeIllust(e) {
  if (e.type == 'manga') return false
  if (e.images.length != 1) return false
  if (e.illust_ai_type == 2) return false
  if (blockedUserIds.includes(+e.author.id)) return false
  return !re1.test(JSON.stringify(e.tags))
}

export function filterRecommIllust(e) {
  if (e.illust_ai_type == 2) return false
  return !re2.test(JSON.stringify(e.tags))
}

export function filterHomeNovel(e) {
  if (e.novel_ai_type == 2) return false
  return !re2.test(JSON.stringify(e.tags))
}

export function filterCensoredIllust(artwork) {
  if (store.state.blockUids.length && store.state.blockUids.includes(`${artwork?.author?.id}`)) {
    return false
  }
  if (store.state.blockTags.length) {
    const tags = JSON.stringify(artwork?.tags || [])
    if (store.state.blockTags.some(e => tags.includes(e))) {
      return false
    }
  }

  if (artwork.x_restrict == 1) {
    if (artwork.illust_ai_type == 2) {
      return store.state.contentSetting.r18 && store.state.contentSetting.ai
    }
    return store.state.contentSetting.r18
  }
  if (artwork.x_restrict == 2) {
    if (artwork.illust_ai_type == 2) {
      return store.state.contentSetting.r18g && store.state.contentSetting.ai
    }
    return store.state.contentSetting.r18g
  }
  if (artwork.illust_ai_type == 2) {
    return store.state.contentSetting.ai
  }
  return true
}

export function filterCensoredIllusts(list = []) {
  console.log('list: ', list)
  return list.filter(filterCensoredIllust)
}

const aiTags = ['AI', 'AI生成', 'AI生成作品', 'AI作画', 'AIイラスト', 'AIgenerated', 'AI-generated', 'AI-assisted', 'AI辅助', 'AIアシスタンス'].map(e => e.toLowerCase())
export function isAiIllust(artwork) {
  return artwork.illust_ai_type == 2 || !!artwork.tags?.some(e => aiTags.includes(e.name?.toLowerCase()))
}

/** @type {Mint} */
let mint
const presetWords = ['vpn', 'VPN', '推荐', '好用', '梯子']
export async function mintVerify(word = '', forceCheck = false) {
  if (!forceCheck && (store.state.contentSetting.r18 || store.state.contentSetting.r18g)) {
    return true
  }
  if (presetWords.some(e => word.includes(e))) {
    return false
  }
  word = word.replace(/[A-Za-z\d\s~`!@#$%^&*()_+\-=[\]{};':"\\|,./<>?]+/g, '')
  try {
    if (!mint) {
      let filterWords = await getCache('s.filter.words')
      if (!filterWords) {
        const resp = await fetch(`${COMMON_PROXY}https://unpkg.com/@dragon-fish/sensitive-words-filter@2.0.1/lib/words.txt`)
        filterWords = (await resp.text()).split(/\s+/)
        setCache('s.filter.words', filterWords, -1)
      }
      mint = new Mint(filterWords)
    }
    return mint.verify(word)
  } catch (error) {
    return true
  }
}
