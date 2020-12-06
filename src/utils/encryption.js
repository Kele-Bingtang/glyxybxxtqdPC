/**
 * 电话号码部分字符加密
 * @param phone
 * @returns {*}
 */
export function encryPhoneNumber(phone) {
  return phone.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
}

/**
 * 学号部分字符加密
 * @param id
 * @returns {*}
 */
export function encryStudentID(id) {
  let gap
  let $ = ''
  const len = id.length
  if (len === 1) {
    return '*'
  } else {
    if (len <= 5) {
      gap = 1
    } else if (len <= 11) {
      gap = 2
    } else if (len >= 12 && len <= 17) {
      gap = 3
    } else {
      gap = 4
    }
    const c = Math.ceil(id.length / 2)
    const s = c - gap
    const e = c + gap
    for (let i = 0; i < gap * 2; i++) {
      $ += '*'
    }
    return id.replace(id.substring(s, e), $)
  }
}

/**
 * 邮箱部分字符加密
 * @param email
 * @returns {*}
 */
export function encryEmail(email) {
  const str = email.split('@')[0]
  const len = str.length
  let reg
  let $ = '$1'
  if (len === 1) {
    reg = /(.{0}).+(.{0}@.+)/g
    $ += '*'
  } else if (len <= 3) {
    reg = /(.{1}).+(.{0}@.+)/g
    $ += '**'
  } else if (len <= 5) {
    reg = /(.{2}).+(.{0}@.+)/g
    for (let i = 0; i < str.length - 2; i++) {
      $ += '*'
    }
  } else if (len === 6) {
    reg = /(.{2}).+(.{1}@.+)/g
    for (let i = 0; i < str.length - 3; i++) {
      $ += '*'
    }
  } else {
    reg = /(.{2}).+(.{2}@.+)/g
    for (let i = 0; i < str.length - 4; i++) {
      $ += '*'
    }
  }
  $ += '$2'
  return email.replace(reg, $)
}
