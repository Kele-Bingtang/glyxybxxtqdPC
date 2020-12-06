import axios from 'axios'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_CONFIG,
  withCredentials: true,  // `withCredentials` 表示跨域请求时是否需要使用凭证
  headers :{
    'Access-Control-Allow-Origin': '*',
  },
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
    return res
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default service
