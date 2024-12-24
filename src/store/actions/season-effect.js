import store from '@/store'
import dayjs from 'dayjs'

export async function fetchSeasonEffects() {
  try {
    const effects = await fetch('https://pxve-notice.nanoka.top/season-effects.json').then(r => r.json())
    const today = dayjs().startOf('day')
    const act = effects.filter(e =>
      today.isAfter(dayjs(e.start).startOf('day') - 1) &&
      today.isBefore(dayjs(e.end).endOf('day'))
    )
    console.log('active effects: ', act)
    if (!act) return
    store.commit('setSeasonEffects', act)
  } catch (err) {
    console.log('err: ', err)
  }
}
