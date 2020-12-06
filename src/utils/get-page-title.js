import defaultSettings from '@/settings'
import store from '@/store'


export default function getPageTitle(pageTitle) {
  const title = (store.getters.config && store.getters.config.title) || defaultSettings.title
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
