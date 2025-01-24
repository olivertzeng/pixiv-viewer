<p align="center"><img src="https://api.moedog.org/count/@himeka-pxve-github-en" alt="pixiv-viewer"></p>

<h1 align="center">Pixiv Viewer <sup><small>Kai</small></sup></h1>
<p align="center">Yet Another Pixiv Illust&Novel Viewer.</p>

![](https://img.shields.io/github/package-json/v/asadahimeka/pixiv-viewer)
![](https://img.shields.io/badge/license-MIT-green)
![](https://api.netlify.com/api/v1/badges/84d224a8-1630-4f47-94c2-ffb0e6da920a/deploy-status)
![](https://img.shields.io/github/package-json/dependency-version/asadahimeka/pixiv-viewer/vue)
![](https://img.shields.io/github/package-json/dependency-version/asadahimeka/pixiv-viewer/dev/@vue/cli-service)
![](https://img.shields.io/github/package-json/dependency-version/asadahimeka/pixiv-viewer/vant)

Demo: 🔗 [pixiv.pictures](https://pixiv.pictures)

Download: ⏬ [GitHub Releases](https://github.com/asadahimeka/pixiv-viewer/releases)

## Features
- [x] Home
  - [x] Illustrations/Mangas/Novels/Lives
  - [x] Rankings/Spotlights/Recommended/Discover/New Artworks
  - [x] Random Artworks
- [x] Searching (Illustrations·Mangas/Novels/Users)
  - [x] Search Hotwords (Long-press to view tags covers)
  - [x] Search Auto-complete
  - [x] Preview of Popular Artworks
  - [x] Search Params Support
  - [x] Image Search
- [x] Rankings
  - [x] Overall/Illustrations/Manga/AnimeGifs/Novels Rankings
  - [x] R18/AI Rankings
  - [x] View Rankings by Date
- [x] Feeds
  - [x] New Artworks Following
  - [x] My Bookmarks
  - [x] Followed Users
  - [x] Latest from Entire Site
- [x] Settings
  - [x] Login (RefreshToken/OAuth/Cookie)
  - [x] History
  - [x] Toggle for R18 and AI Artworks
  - [x] Local Blacklist
  - [x] Clear Cache
  - [x] Multi-language Support
  - [x] Image Waterfull Layout Selection
  - [x] Image Quality Selection for Image Details
  - [x] Dark Mode
  - [x] App Theme Color
  - [x] Swipe Left/Right to Browse Artworks
  - [x] Multiple Image proxy Selection
  - [x] Multiple API Instance Selection
  - [x] Export RefreshToken
  - [x] Proxy Service for AppAPI
  - [x] Long-press to Download Images from Lists
  - [x] Long-press to Block Images from Lists
  - [x] Download via File System Access API
  - [x] Download via Tampermonkey User Script
  - [x] Format for Downloaded File Names
- [x] Artwork Detail Page
  - [x] Bookmark/Download/View Comments/Share
  - [x] Source Site Link/ID Copy
  - [x] Ugoira Play
  - [x] Ugoira Download (ZIP/GIF/WebM/APNG/MP4)
  - [x] Novel Download
  - [x] Novel Reading Settings (Font/Colors/Direction etc.)
- [x] Author Detail Page
  - [x] Follow/Unfollow
  - [x] View Author’s Illustrations/Mangas/Bookmarks/Novels
  - [x] View Manga Series/Novel Series
  - [x] Author Illustration Tags
  - [x] Related Users

- [x] Local IndexedDB Cache Storage
- [x] Multi-end Style Adaptation
- [x] PWA Support
- [x] Android/Windows Version
- [x] iOS/macOS Version

## Feedback

https://github.com/asadahimeka/pixiv-viewer/discussions

## Preview

- Mobile

<kbd><img src="ea1.jpg" width="390"></kbd>  <kbd><img src="ea2.jpg" width="390"></kbd>

<kbd><img src="ea3.jpg" width="390"></kbd>  <kbd><img src="ea4.jpg" width="390"></kbd>

- Desktop

<kbd><img src="ew1.png" width="390"></kbd>  <kbd><img src="ew2.png" width="390"></kbd>

<kbd><img src="ew3.png" width="390"></kbd>  <kbd><img src="ew4.png" width="390"></kbd>

## Alternatives

- [Pixiviz](https://pixiviz.cocomi.eu.org/)
- [Pixivel](https://pxelk.cocomi.eu.org/)
- [PixivNow](https://pxnow.cocomi.eu.org/)
- [PixivMoe](https://pixivmoe.cocomi.eu.org/)
- [PixivLxns](https://pixivlxns.cocomi.eu.org/)
- [pixivic](https://pixivic.com)
- [vilipix](https://www.vilipix.com/ranking)
- [moeview](https://moeview.cocomi.eu.org/)
- [booruwf](https://booru.cocomi.eu.org/)
- [RankTop50](https://www.nanoka.top/illust/pixiv/)

## Project setup
```
pnpm install
```

### Compiles and hot-reloads for development
```
pnpm serve
```

### Compiles and minifies for production
```
pnpm build
```

### Lints and fixes files
```
pnpm lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## FAQ

### How to preset the image proxy and API instance if you build it yourself?

Refer to [#10](https://github.com/asadahimeka/pixiv-viewer/discussions/10) and [#13](https://github.com/asadahimeka/pixiv-viewer/discussions/13) to set up the environment variable. You can create a new `.env` file in the project root directory and fill in the environment variables in the following format:

```env
TEST="lalala"
ABC=DEF
```

### Some artworks cannot be viewed using US/UK IP

See pixiv official announcement: https://www.pixiv.net/info.php?id=10837

It is recommended to log in to this site with your own account before using it, and select a non-US/UK region in the official web page [settings](https://www.pixiv.net/setting_user.php). It is best to select the Japan region.

### List and details do not match or repeat, search results do not match the search label

It is caused by the CDN cache of the self -built API, you can switch other API instances in the settings or use it after logging in.

### Keep prompting that the API exceeds the limit or Rate Limit

You can switch the API instance in the settings, or directly use RefreshToken or OAuth to log in.

### How to get RefreshToken

See https://www.nanoka.top/posts/e78ef86/

### Image loading is very slow

Due to the network environment, the image loading speed may be slow. You can switch to the image proxy in the settings, or download the Android version and turn on the image direct connection function.

### Cookie/SessionID login error

It is recommended to use RefreshToken to log in

### Is there an iOS App?

You can download it from [Github Releases](https://github.com/asadahimeka/pixiv-viewer/releases). Note that the iOS installation package is not signed, so you need to sign it yourself. Tutorials: [AltStore](https://faq.AltStore.io)

### Android version crashes after clicking download

Go to the system settings to give this application storage permissions, or download the latest version and try again.

## Contribute

This project uses [Vue I18n](https://kazupon.github.io/vue-i18n/) for internationalization, other language translations are mainly from machine translation, if there is anything wrong, welcome [contribute translation](https://github.com/asadahimeka/pixiv-viewer/tree/master/src/locales)

## Credits
- [pixiv-viewer](https://github.com/journey-ad/pixiv-viewer)
- [Vue](https://vuejs.org/)
- [Vant UI](https://vant-ui.github.io/vant/v2/)
- [Vue I18n](https://kazupon.github.io/vue-i18n/)
- [HibiAPI](https://github.com/mixmoe/HibiAPI)
- [Pixiv.cat](https://pixiv.re)
- [PixivNow](https://github.com/FreeNowOrg/PixivNow)
- [SauceNAO](https://saucenao.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Netlify](https://netlify.com/)

## Disclaimer

This project has no affiliation with pixiv.net(ピクシブ株式会社).

The copyright of all artworks presented in this project(Website/APP) belongs to Pixiv or its original authors.

This project is for communication and learning only and may not be used for any commercial purposes.

## LICENSE

[![MIT License](https://img.shields.io/github/license/asadahimeka/pixiv-viewer)](https://github.com/asadahimeka/pixiv-viewer/blob/master/LICENSE)
