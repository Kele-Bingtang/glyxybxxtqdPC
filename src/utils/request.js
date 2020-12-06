import axios from 'axios'
import qs from 'qs'
import {Message} from "element-ui";

// create an axios instance
const service = axios.create({
  // baseURL:  process.env.VUE_APP_BASE_API, // serverConfig.baseURL, // process.env.VUE_APP_BASE_API,
  // withCredentials: true,  // `withCredentials` 表示跨域请求时是否需要使用凭证
  transformRequest: [function(data) {
    return qs.stringify(data)
  }],
  timeout: 30 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // status === 'success' 表示请求成功， === 'false' 表示请求错误
    if (res.status === 'false') {
      message(res.info)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
function message(info) {
  info = Number(info)
  switch (info) {
    case 0:
      Message.error('未登录授权或无权限！')
      break
    case 1:
      Message.error('程序错误请刷新！')
      break
    case 2:
      Message.error('无效参数！')
      break
    case 3:
      Message.error('缺少传递必要参数！')
      break
    default:
      Message.error('接口异常，请重试！')
  }
}

export default service
