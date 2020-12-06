import request from '@/utils/request'
import store from '@/store'

// 获取报修单接口， 派单（修改报修单）接口
export function BxdServlet(data) {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data
  })
}

// 获取申报中的报修单数量
export function getDeclareOrder() {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data: {
      op: 'bxnum', // 调用方法*，固定值
      state: 1 // 查询状态数量*，1已派单，2已维修，3撤销单。角标数量使用state=1来查询。
    }
  })
}

// 获取申报中的报修单数量并且更新vuex
export function getDeclare() {
  store.dispatch('bxd/getDeclare')
}

/**
 * 根据校区id查询区域
 * @param id
 */
export function getArea(id) {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data: {
      op: 'selallqy', // 调用方法*，固定值
      xq: id // 校区（临桂0，东城1）
    }
  })
}
