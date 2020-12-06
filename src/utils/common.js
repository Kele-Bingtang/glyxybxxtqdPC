/**
 * Created by Lct on 190805.
 */
import { Message  } from 'element-ui'

export function randomKey(length) {
  length = length || 8
  let str = ''
  for (let i = 0; i < length; i++) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}

export function copyObj(obj) {
  return obj && JSON.parse(JSON.stringify(obj))
}

export function message(result, text) {
  text = text || '请求成功！'
  if (result.status) {
    if (result.status == 'false') {
      let info = Number(result.info)
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
    } else {
      Message.success(text)
    }
  } else {
    Message.success(text)
  }
  return result.status == 'success'
}

/**
 * 过滤参数，空值的不传递，0传递
 * @param params
 */
export function filterParams(params) {
  const resultParams = {}
  for (const key in params) {
    if (params[key] || params[key] === 0) {
      resultParams[key] = params[key]
    }
  }
  return resultParams
}
