<template>
  <div class="setting-page">
    <top-bar id="top-bar-wrap" />
    <h3 class="af_title">FAQ</h3>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="一直提示 API 超限或者 Rate Limit" name="1">可以到设置里切换 API 实例，或者直接使用 RefreshToken 或者 OAuth 方式登录</van-collapse-item>
      <van-collapse-item title="如何获取 RefreshToken" name="2">参见 <a href="https://www.nanoka.top/posts/e78ef86/" target="_blank">https://www.nanoka.top/posts/e78ef86/</a></van-collapse-item>
      <van-collapse-item title="图片加载很慢" name="3">受限于网络环境，图片加载速度可能会比较慢。可以到设置里切换图床，或者下载 Android 版本后打开图片直连功能</van-collapse-item>
      <van-collapse-item title="Cookie/SessionID 登录出错" name="4">建议使用 RefreshToken 方式登录</van-collapse-item>
      <van-collapse-item title="是否有 iOS App" name="5">目前只有 Android 与 Windows 版本，均为 Webview 套壳，下载：<a href="https://github.com/asadahimeka/pixiv-viewer/releases" target="_blank">https://github.com/asadahimeka/pixiv-viewer/releases</a></van-collapse-item>
      <van-collapse-item title="Android 版本点击下载就闪退" name="6">到系统设置里给予本应用存储权限，或者下载最新版本后再进行尝试</van-collapse-item>
      <van-collapse-item title="自建的话如何预设图床与 API 实例" name="7">
        参照 <a href="https://github.com/asadahimeka/pixiv-viewer/issues/2" target="_blank">#2</a> 与 <a href="https://github.com/asadahimeka/pixiv-viewer/issues/5" target="_blank">#5</a> 设置环境变量。可以在项目根目录下新建 `.env` 文件，按如下格式填入环境变量：
        <pre>
          <code>
            TEST="lalala"
            ABC=DEF
          </code>
        </pre>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  name: 'SettingAboutFaq',
  data() {
    return { activeNames: [] }
  },
  head() {
    return { title: 'FAQ' }
  },
}
</script>

<style lang="stylus" scoped>

</style>
