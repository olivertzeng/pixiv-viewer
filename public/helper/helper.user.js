// ==UserScript==
// @name         Pxve HTTP Helper
// @namespace    https://www.nanoka.top
// @version      0.5
// @description  HTTP helper for Pixiv-Viewer.
// @author       asadahimeka
// @license      MIT
// @match        https://www.pixiv.pics/*
// @match        https://pixiv.pics/*
// @match        https://pxve.cc/*
// @match        https://pixiv.nets.hk/*
// @match        https://pixiv.orgs.hk/*
// @match        https://pxvek.cocomi.eu.org/*
// @match        https://pxvek.169889.xyz/*
// @match        https://pixiv-viewer.netlify.app/*
// @match        https://pixiv-viewer.zeabur.app/*
// @match        https://pixiv-viewer.vercel.app/*
// @match        https://pksbv.pages.dev/*
// @connect      pixiv.net
// @connect      210.140.92.180
// @connect      210.140.139.130
// @connect      pixiv.pics
// @connect      cocomi.eu.org
// @connect      pxve.cc
// @connect      169889.xyz
// @grant        unsafeWindow
// @grant        window.close
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict'

  unsafeWindow.__closeWindow__ = () => window.close()
  unsafeWindow.__httpRequest__ = (url, configStr) => {
    const config = JSON.parse(configStr)
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        ...config,
        anonymous: true,
        responseType: config.responseType || 'json',
        onload: resp => resolve({ data: resp.response }),
        onerror: err => {
          reject(new Error(err.error || err.responseText))
        },
      })
    })
  }
})()
