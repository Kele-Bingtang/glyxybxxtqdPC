import request from '@/utils/request'

/**
 * 请求方法
 * @param data
 * @constructor
 */
export function AdminServlet(data) {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data
  })
}

/**
 * 获取区域
 * { op: "selallqy", xq: '' }
 */
export function getRegion(xq) {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data: {
      op: 'selallqy',
      xq: xq // 校区（临桂0，东城1）
    }
  })
}

/**
 * 查询报修单
 * @param bid 报修单号
 */
export function getBxdDetail(bid) {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data: {
      op: 'selbxdbyadmin',
      bid: bid
    }
  })
}

