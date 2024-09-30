const _langs = {
  'af': 'Afrikaans',
  'am': 'Amharic',
  'ar': 'Arabic',
  'as': 'Assamese',
  'az': 'Azerbaijani',
  'ba': 'Bashkir',
  'bg': 'Bulgarian',
  'bho': 'Bhojpuri',
  'bn': 'Bangla',
  'bo': 'Tibetan',
  'brx': 'Bodo',
  'bs': 'Bosnian',
  'ca': 'Catalan',
  'cs': 'Czech',
  'cy': 'Welsh',
  'da': 'Danish',
  'de': 'German',
  'doi': 'Dogri',
  'dsb': 'Lower Sorbian',
  'dv': 'Divehi',
  'el': 'Greek',
  'en': 'English',
  'es': 'Spanish',
  'et': 'Estonian',
  'eu': 'Basque',
  'fa': 'Persian',
  'fi': 'Finnish',
  'fil': 'Filipino',
  'fj': 'Fijian',
  'fo': 'Faroese',
  'fr': 'French',
  'fr-CA': 'French (Canada)',
  'ga': 'Irish',
  'gl': 'Galician',
  'gom': 'Konkani',
  'gu': 'Gujarati',
  'ha': 'Hausa',
  'he': 'Hebrew',
  'hi': 'Hindi',
  'hne': 'Chhattisgarhi',
  'hr': 'Croatian',
  'hsb': 'Upper Sorbian',
  'ht': 'Haitian Creole',
  'hu': 'Hungarian',
  'hy': 'Armenian',
  'id': 'Indonesian',
  'ig': 'Igbo',
  'ikt': 'Inuinnaqtun',
  'is': 'Icelandic',
  'it': 'Italian',
  'iu': 'Inuktitut',
  'iu-Latn': 'Inuktitut (Latin)',
  'ja': 'Japanese',
  'ka': 'Georgian',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'kmr': 'Kurdish (Northern)',
  'kn': 'Kannada',
  'ko': 'Korean',
  'ks': 'Kashmiri',
  'ku': 'Kurdish (Central)',
  'ky': 'Kyrgyz',
  'ln': 'Lingala',
  'lo': 'Lao',
  'lt': 'Lithuanian',
  'lug': 'Ganda',
  'lv': 'Latvian',
  'lzh': 'Chinese (Literary)',
  'mai': 'Maithili',
  'mg': 'Malagasy',
  'mi': 'M\u0101ori',
  'mk': 'Macedonian',
  'ml': 'Malayalam',
  'mn-Cyrl': 'Mongolian (Cyrillic)',
  'mn-Mong': 'Mongolian (Traditional)',
  'mni': 'Manipuri',
  'mr': 'Marathi',
  'ms': 'Malay',
  'mt': 'Maltese',
  'mww': 'Hmong Daw',
  'my': 'Myanmar (Burmese)',
  'nb': 'Norwegian',
  'ne': 'Nepali',
  'nl': 'Dutch',
  'nso': 'Sesotho sa Leboa',
  'nya': 'Nyanja',
  'or': 'Odia',
  'otq': 'Quer\xE9taro Otomi',
  'pa': 'Punjabi',
  'pl': 'Polish',
  'prs': 'Dari',
  'ps': 'Pashto',
  'pt': 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  'ro': 'Romanian',
  'ru': 'Russian',
  'run': 'Rundi',
  'rw': 'Kinyarwanda',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'sm': 'Samoan',
  'sn': 'Shona',
  'so': 'Somali',
  'sq': 'Albanian',
  'sr-Cyrl': 'Serbian (Cyrillic)',
  'sr-Latn': 'Serbian (Latin)',
  'st': 'Sesotho',
  'sv': 'Swedish',
  'sw': 'Swahili',
  'ta': 'Tamil',
  'te': 'Telugu',
  'th': 'Thai',
  'ti': 'Tigrinya',
  'tk': 'Turkmen',
  'tlh-Latn': 'Klingon (Latin)',
  'tlh-Piqd': 'Klingon (pIqaD)',
  'tn': 'Setswana',
  'to': 'Tongan',
  'tr': 'Turkish',
  'tt': 'Tatar',
  'ty': 'Tahitian',
  'ug': 'Uyghur',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek (Latin)',
  'vi': 'Vietnamese',
  'xh': 'Xhosa',
  'yo': 'Yoruba',
  'yua': 'Yucatec Maya',
  'yue': 'Cantonese (Traditional)',
  'zh-Hans': 'Chinese Simplified',
  'zh-Hant': 'Chinese Traditional',
  'zu': 'Zulu',
}

const langs = {
  __proto__: null,
  default: _langs,
}

const LANGS = _langs
function getLangCode(lang) {
  if (!lang || typeof lang !== 'string') {
    return
  }
  if (LANGS[lang]) {
    return lang
  }
  lang = lang.toLowerCase()
  const supportedLangCodes = Object.keys(LANGS)
  for (let i = 0, len = supportedLangCodes.length, code; i < len; i++) {
    code = supportedLangCodes[i]
    if (code.toLowerCase() === lang || LANGS[code].toLowerCase() === lang) {
      return code
    }
  }
}
function isSupported(lang) {
  return !!getLangCode(lang)
}

const userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 6.3; WOW64; en-US) AppleWebKit/603.43 (KHTML, like Gecko) Chrome/47.0.2805.119 Safari/603'

const API_AUTH = 'https://prks.cocomi.eu.org/https://edge.microsoft.com/translate/auth'
const API_TRANSLATE = 'https://prks.cocomi.eu.org/https://api.cognitive.microsofttranslator.com/translate'
let globalConfig
let globalConfigPromise
async function fetchGlobalConfig(userAgent$1) {
  try {
    const response = await fetch(API_AUTH, {
      headers: {
        'User-Agent': userAgent$1 || userAgent,
      },
    })
    const authJWT = await response.text()
    const jwtPayload = JSON.parse(
      // Buffer.from(authJWT.split('.')[1], 'base64').toString('utf-8')
      atob(authJWT.split('.')[1])
    )
    globalConfig = {
      token: authJWT,
      tokenExpiresAt: jwtPayload.exp * 1e3,
    }
  } catch (e) {
    console.error('Failed to fetch auth token:', e.message)
    throw new Error('Failed to fetch auth token')
  }
}
function isTokenExpired() {
  return !globalConfig || (globalConfig.tokenExpiresAt || 0) - Date.now() < 6e4
}
async function translate(text, from, to, options) {
  if (!text || !text.length) {
    return
  }
  from && from.toLowerCase() === 'auto-detect' && (from = void 0)
  from = getLangCode(from)
  if (!Array.isArray(to)) {
    to = [to]
  }
  to = to.map(toLang => getLangCode(toLang) || 'en')
  if (!to.length) {
    to = ['en']
  }
  const fromSupported = !from || isSupported(from)
  const toSupported = to.every(isSupported)
  if (!fromSupported || !toSupported) {
    throw new Error(
      `Unsupported language(s): ${!fromSupported ? `'${from}'` : !toSupported ? to.map(t => `'${t}'`).join(', ') : ''}`
    )
  }
  if (!Array.isArray(text)) {
    text = [text]
  }
  options || (options = {})
  await ensureAuthentication(options)
  const fetchConfig = {
    headers: buildHeaders(options),
    method: 'POST',
    body: JSON.stringify(text.map(txt => ({ Text: txt }))),
    ...options?.fetchOptions ?? {},
  }
  try {
    const searchParams = new URLSearchParams([
      ...to.map(toLang => ['to', toLang]),
      ...Object.entries({
        'api-version': '3.0',
        from,
        ...options.translateOptions || {},
      }).filter(([_, val]) => val != null && val !== ''),
    ])
    const response = await fetch(
      `${API_TRANSLATE}?${searchParams}`,
      fetchConfig
    )
    if (!response.ok) {
      const responseBody = await response.json()
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}
${JSON.stringify(responseBody, null, 2)}`
      )
    }
    return response.json()
  } catch (e) {
    console.error(`[ERROR] Failed to translate: ${e.message}`)
    throw e
  }
}
async function ensureAuthentication(options) {
  if (!options || !options.authenticationHeaders) {
    if (!globalConfigPromise) {
      globalConfigPromise = fetchGlobalConfig(options?.userAgent)
    }
    await globalConfigPromise
    if (isTokenExpired()) {
      globalConfigPromise = fetchGlobalConfig(options?.userAgent)
      await globalConfigPromise
    }
  }
}
function buildHeaders(options) {
  const headers = {
    'User-Agent': userAgent,
    'Content-Type': 'application/json',
  }
  if (options && options.authenticationHeaders) {
    headers.Authorization = options.authenticationHeaders
  } else {
    headers.Authorization = 'Bearer ' + globalConfig.token
  }
  if (options && options.fetchOptions && options.fetchOptions.headers) {
    Object.assign(headers, options.fetchOptions.headers)
  }
  return headers
}

export { LANGS, buildHeaders, ensureAuthentication, fetchGlobalConfig, getLangCode, isSupported, isTokenExpired, langs, translate }
