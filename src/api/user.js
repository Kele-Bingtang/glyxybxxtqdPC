import request from '@/utils/request'

// 用户登录接口
export function login(data) {
  return request({
    url: '/AdminLogin',
    method: 'post',
    data
  })
}

// 请求用户信息，实际跟登录接口一样
export function getInfo(data) {
  return request({
    url: '/AdminLogin',
    method: 'post',
    data
  })
}
