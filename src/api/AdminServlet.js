/**
 * 接口
 */
import request from '@/utils/request'
export function AdminServlet(data) {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data
  })
}
