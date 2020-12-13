import request from '@/utils/request'

/**
 * 接口
 * @param data
 * @constructor
 */
export function Dict(data) {
  return request({
    url: '/dict/getDictByCode',
    method: 'post',
    data
  })
}
