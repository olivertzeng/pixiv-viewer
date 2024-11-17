import axios from 'axios'
import FileSaver from 'file-saver'

export function throttleScroll(el, downFn, upFn) {
  let position = el.scrollTop
  let ticking = false
  return function (arg) {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(() => {
      const scroll = el.scrollTop
      scroll > position ? downFn?.(scroll, arg) : upFn?.(scroll, arg)
      position = scroll
      ticking = false
    })
  }
}

function fallbackCopyTextToClipboard(text, cb, errCb) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    successful ? cb?.() : errCb?.()
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
    errCb?.(err)
  }

  document.body.removeChild(textArea)
}

export function copyText(text, cb, errCb) {
  try {
    navigator.clipboard.writeText(text).then(cb, errCb)
  } catch (error) {
    fallbackCopyTextToClipboard(text, cb, errCb)
  }
}

export function setCookieOnce(key, val) {
  document.cookie = `${key}=${val}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;Secure`
}

export function resetCookieOnce(key) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure`
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function setCookie(name, value, days) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/;Secure'
}

export function getCookie(cname) {
  const name = cname + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export function removeCookie(key) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure`
}

export function objectToQueryString(queryParameters) {
  return queryParameters
    ? Object.entries(queryParameters).reduce(
      (queryString, [key, val]) => {
        const symbol = queryString.length === 0 ? '?' : '&'
        queryString += `${symbol}${key}=${val}`
        return queryString
      },
      ''
    )
    : ''
}

export function isURL(s) {
  return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/i.test(s)
}

export async function checkImgAvailable(src) {
  return new Promise((resolve, reject) => {
    let img = document.createElement('img')
    img.referrerPolicy = 'no-referrer'
    img.src = src
    img.onload = () => {
      resolve(true)
      img = null
    }
    img.onerror = () => {
      reject(new Error('Network error.'))
      img = null
    }
  })
}

export async function checkUrlAvailable(url) {
  const res = await axios.get(url, { timeout: 5000 })
  if (res.data) return true
  throw new Error('Resp not ok.')
}

export async function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function loadScript(src) {
  return new Promise(resolve => {
    const script = document.createElement('script')
    script.src = src
    script.addEventListener('load', () => { resolve() }, false)
    document.head.appendChild(script)
  })
}

export function isSafari() {
  const ua = navigator.userAgent
  if (!/Chrome/i.test(ua) && /Safari/i.test(ua)) return true
  return false
}

export function randomBg() {
  const getRandomRangeNum = (min, max) => min + Math.floor(Math.random() * (max - min))
  const leftHue = getRandomRangeNum(0, 360)
  const bottomHue = getRandomRangeNum(0, 360)
  return `linear-gradient(to right bottom,hsl(${leftHue}, 100%, 90%) 0%,hsl(${bottomHue}, 100%, 90%) 100%)`
}

export async function fancyboxShow(artwork, index = 0, getSrc = e => e.o) {
  if (!window.Fancybox) {
    document.head.insertAdjacentHTML('beforeend', '<link href="https://lib.baomitu.com/fancyapps-ui/5.0.36/fancybox/fancybox.min.css" rel="stylesheet">')
    await loadScript('https://lib.baomitu.com/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js')
  }
  const isMobile = navigator.userAgent.includes('Mobile')
  window.Fancybox.show(artwork.images.map(e => ({
    src: getSrc(e),
    thumb: e.m,
  })), {
    compact: isMobile,
    backdropClick: 'close',
    contentClick: isMobile ? 'close' : 'toggleZoom',
    startIndex: index,
    hideScrollbar: false,
    placeFocusBack: false,
    trapFocus: false,
    Hash: false,
    Thumbs: { showOnStart: false },
    Carousel: { infinite: false },
    Toolbar: {
      display: {
        left: ['infobar'],
        middle: [],
        right: ['toggleZoom', 'thumbs', 'myDownload', 'rotateCW', 'flipX', 'flipY', 'close'],
      },
      items: {
        myDownload: {
          tpl: '<button class="f-button"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"></path></svg></button>',
          click: ev => {
            console.log('ev: ', ev)
            const { page } = ev.instance.carousel
            const item = artwork.images[page]
            const fileName = `${artwork.author.name}_${artwork.title}_${artwork.id}_p${page}.${item.o.split('.').pop()}`
            FileSaver.saveAs(item.o, fileName)
          },
        },
      },
    },
  })
}

export function tryURL(url) {
  try {
    return new URL(url)
  } catch (_err) {
    return null
  }
}
