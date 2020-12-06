export default {
  // 区域二维码地址
  // qrcode: 'http://yiban.glmc.edu.cn/bx/eid=', // 某区域的某个地方的二维码id
  // 图片地址
  // bxdimg: 'http://yiban.gxun.edu.cn/bx/bxdimg/',

  // 申报详情页面路径，需要与移动端申报详情页面一致，不可更改
  declareDetailsPath: 'declare-details/:id',
  // 接单人在职状态描述 value对应接口的state  tag为<el-tag>样式
  states: [
    { text: '在职', value: 1, tag: 'success' },
    { text: '休假', value: 2, tag: 'danger' },
    { text: '离职', value: 3, tag: 'info' }
  ],
  // 审核员职务
  job: [
    { text: '普通职员', value: 1, tag: 'pramiry' },
    { text: '高级职员', value: 2, tag: 'success' }
  ],
  // 工单进度
  progress: [
    { text: '未派单', value: 0, tag: 'danger' },
    { text: '已派单', value: 1, tag: 'primary' },
    { text: '已维修', value: 2, tag: 'success' },
    { text: '撤销单', value: 3, tag: 'info' }
  ],
  // 校区
  campus: [
    { text: '临桂校区', value: 0 },
    { text: '东城校区', value: 1 }
  ],
  // 审核状态
  shState: [
    { text: '未审核', value: 0, tag: 'info' },
    { text: '审核通过', value: 1, tag: 'success' },
    { text: '审核不通过', value: 2, tag: 'danger' }
  ],
  // 区域
  area: ['公共区', '办公区', '生活区', '学习区'],
  // 报修类别
  repairCategory: ['房间灯', '洗手台灯', '厕所灯', '阳台灯', '房间门锁', '厕所门锁', '阳台门锁', '水龙头', '厕所冲水阀', '天花板', '下水道', '热水问题', '风扇', '空调', '插座', '凳子', '桌子', '床', '窗帘', '开关', '其它'],
  // 服务评价文字表述
  evaluate: ['极差', '失望', '一般', '满意', '很满意'],
  // 分页的信息
  paging: {
    currentPage: 1,
    pagesizes: [10, 20, 30, 50, 70, 90],
    pagesize: 50
  }
}
