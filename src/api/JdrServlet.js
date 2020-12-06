/**
 * 接单人接口
 */
import request from '@/utils/request'
export function JdrServlet(data) {
  return request({
    url: '/JdrServlet',
    method: 'post',
    data
  })
}
