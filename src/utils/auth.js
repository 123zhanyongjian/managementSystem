import Cookies from 'js-cookie'

const TokenKey = 'TOKEN_6PL_E3'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expires = 1) {
  return Cookies.set(TokenKey, token, { expires })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getCookies(Key) {
  return Cookies.get(Key)
}

export function setCookies(key, data) {
  return Cookies.set(key, data)
}

export function removeCookies(key) {
  return Cookies.remove(key)
}

