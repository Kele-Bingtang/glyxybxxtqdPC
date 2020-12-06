import Cookies from 'js-cookie'

const LOGIN_TOKEN = 'GYBX_LOGIN_TOKEN'
const DECLARER = 'GYBX_DECLARER_TOKEN'
const EXPIRES = 30

// cookie LOGIN_INFO
export function setCookie(token, checked) {
  return Cookies.set(LOGIN_TOKEN, token, { expires: checked ? EXPIRES : '' })
}

export function getCookie() {
  return Cookies.get(LOGIN_TOKEN)
}

export function removeCookie() {
  return Cookies.remove(LOGIN_TOKEN)
}

export function setDeclarerCookie(token) {
  return Cookies.set(DECLARER, token, { expires: '' })
}

export function getDeclarerCookie() {
  return Cookies.get(DECLARER)
}
