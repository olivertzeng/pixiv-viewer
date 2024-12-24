import store from '@/store'
import { Dialog } from 'vant'
import _ from 'lodash'
import dayjs from 'dayjs'

export async function fetchAppNotice() {
  try {
    const notices = await fetch('https://pxve-notice.nanoka.top').then(r => r.json())
    const today = dayjs().startOf('day')
    const notice = notices.filter(e => e.pnt.length == 0 || e.pnt.includes('web') || e.pnt.includes(location.hostname)).find(e =>
      today.isAfter(dayjs(e.start).startOf('day') - 1) &&
      today.isBefore(dayjs(e.end).endOf('day'))
    )
    console.log('notice: ', notice)
    if (!notice) return
    if (!notice.alert) {
      store.commit('setAppNotice', notice)
    } else if (localStorage.PXV_NOTICE_READ_REC != notice.id) {
      Dialog.alert({
        width: '8rem',
        title: notice.title,
        message: notice.text,
      }).then(() => {
        localStorage.PXV_NOTICE_READ_REC = notice.id
      })
    }
    if (notice.style) {
      document.head.insertAdjacentHTML('beforeend', `<style>${notice.style}</style>`)
    }
    if (notice.addClass) {
      document.documentElement.className += notice.addClass
    }
    if (Array.isArray(notice.randomClass)) {
      document.documentElement.classList.add(_.sample(notice.randomClass))
    }
  } catch (err) {
    console.log('err: ', err)
  }
}
