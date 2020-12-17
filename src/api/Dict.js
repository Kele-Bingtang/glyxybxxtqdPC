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

//报修类别、耗材类别、接单人业务范围
export function DictListServlet() {
  return request({
    url: '/dict/getAllWxlb',
    method: 'get',
  })
}
