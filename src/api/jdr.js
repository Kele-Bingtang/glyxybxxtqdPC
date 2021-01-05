import request from '@/utils/request'

/**
 * 获取接单人列表
 * { op: "selalljdr" }
 */
export function getJdr() {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data: {
      op: 'selalljdr'
    }
  })
}

export function getOptimalJdr(data) {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data
  })
}

/**
 * 获取审核员列表
 * { op: 'selallshy' }
 */
export function getChecker() {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data: {
      op: 'selallshy'
    }
  })
}

/**
 * 新增或修改接单人信息
 * @param data
 *  params: { // 参数
        op: '', // 固定参数* newpeople或uppeople
        xm: '', // 姓名*（审核员、接单人）
        ybid: '', // 易班id*（审核员、接单工人）
        gh: '', // 工号*（审核员、接单人）
        ywfw: '', // 业务范围*（接单人）
        sj: '', // 手机（接单人）
        yx: '', // 邮箱（接单人）
        state: '' // 在职状态（接单人），1在职，2休假，3离职
        del: '' // 传递1或者不传递。优先级最高，如果传递了，则直接删除接单人或者审核员
      },
 */
export function updateJdr(data) {
  return request({
    url: '/AdminServlet',
    method: 'post',
    data
  })
}
