/**
 * 耗材管理接口
 */
import request from '@/utils/request'
export function HcServlet(data) {
  return request({
    url: '/HcServlet',
    method: 'post',
    data
  })
}
