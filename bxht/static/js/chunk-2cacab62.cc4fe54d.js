(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2cacab62"],{aaf1:function(t,e,a){"use strict";a("d89c")},ca51:function(t,e,a){"use strict";a.d(e,"a",(function(){return o}));var n=a("b775");function o(t){return Object(n["a"])({url:"/AdminServlet",method:"post",data:t})}},d89c:function(t,e,a){},ea87:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"main"},[a("div",{staticClass:"dashboards"},[a("div",{staticClass:"header"},[t._v("\n      工单统计\n    ")]),t._v(" "),a("div",{staticClass:"content"},[t.data?a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:6}},[a("dashboard",{attrs:{color:"#58B5FB",icon:"dashboard-zbxd",value:t.data.zbxd,label:"总报修单"}})],1),t._v(" "),a("el-col",{attrs:{span:6}},[a("dashboard",{attrs:{color:"#13ce66",icon:"dashboard-wcbxd",value:t.data.zwxd,label:"总完成维修单"}})],1),t._v(" "),a("el-col",{attrs:{span:6}},[a("dashboard",{attrs:{color:"#7A65F2",icon:"dashboard-zzbxd",value:t.data.zzwx,label:"正在维修中"}})],1),t._v(" "),a("el-col",{attrs:{span:6}},[a("dashboard",{attrs:{color:"#FF625B",icon:"dashboard-cxbxd",value:t.data.zcxd,label:"总撤销单"}})],1)],1):t._e()],1)]),t._v(" "),a("div",{staticClass:"chart"},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:8}},[a("div",{staticClass:"pj-chart fl"},[a("div",{staticClass:"header"},[t._v("评价统计")]),t._v(" "),a("v-chart",{attrs:{options:t.pieOptions,theme:"macarons",autoresize:""}})],1)]),t._v(" "),a("el-col",{attrs:{span:16}},[a("div",{staticClass:"bx-chart fr"},[a("div",{staticClass:"header"},[t._v("报修统计")]),t._v(" "),a("v-chart",{attrs:{options:t.barOptions,theme:"macarons",autoresize:""}})],1)])],1)],1)])},o=[],s=a("ca51"),i={name:"index",components:{Dashboard:function(){return a.e("chunk-20f81e95").then(a.bind(null,"0adf"))}},data:function(){return{pieOptions:{tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{left:"center",bottom:"20",data:["1星","2星","3星","4星","5星"],textStyle:{color:"#fff"}},series:{name:"维修单评价统计",type:"pie",roseType:"radius",radius:["30%","75%"],center:["50%","40%"],data:[{value:1,name:"1星",id:"pj1"},{value:1,name:"2星",id:"pj2"},{value:1,name:"3星",id:"pj3"},{value:1,name:"4星",id:"pj4"},{value:1,name:"5星",id:"pj5"}],label:{formatter:"{b} : {c} ({d}%)"},animationEasing:"cubicInOut",animationDuration:1e3}},barOptions:{tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{top:10,left:"2%",right:"2%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:["本年报修量","本年完成量","本月报修量","本月完成量","今日报修量","今日完成量"],axisTick:{alignWithLabel:!0}}],yAxis:[{type:"value",axisTick:{show:!1},splitLine:{show:!1},splitArea:{show:!0}}],series:{type:"bar",barWidth:"40%",data:[{id:"yearbx",name:"本年报修量",value:0,itemStyle:{color:"#FBD437"}},{id:"yearwx",name:"本年完成量",value:0,itemStyle:{color:"#FBD437"}},{id:"monthbx",name:"本月报修量",value:0,itemStyle:{color:"#B6A2DE"}},{id:"monthwx",name:"本月完成量",value:0,itemStyle:{color:"#B6A2DE"}},{id:"daybx",name:"今日报修量",value:0,itemStyle:{color:"#4ECB73"}},{id:"daywx",name:"今日完成量",value:0,itemStyle:{color:"#4ECB73"}}]}},timer:null,data:""}},mounted:function(){this.getDatas(),this.autoMonitor(),this.autoFullScreen()},methods:{autoFullScreen:function(){console.log("-----------"),document.documentElement.RequestFullScreen&&document.documentElement.RequestFullScreen(),console.log(document.documentElement.mozRequestFullScreen),document.documentElement.mozRequestFullScreen&&document.documentElement.mozRequestFullScreen(),document.documentElement.webkitRequestFullScreen&&document.documentElement.webkitRequestFullScreen(),document.documentElement.msRequestFullscreen&&document.documentElement.msRequestFullscreen()},getDatas:function(){var t=this;Object(s["a"])({op:"adminindex"}).then((function(e){e?t.getDatasSucc(e.obj):t.$message.error("数据获取异常，请检查接口")})).catch((function(){t.$message.error("数据获取失败，请检查接口")}))},getDatasSucc:function(t){this.data=t;var e=this.pieOptions.series.data;e.map((function(e){e.value=t[e.id]}));var a=this.barOptions.series.data,n=JSON.parse(this.data.tj);a.map((function(t){t.value=n[t.id]}))},autoMonitor:function(){this.stopMonitor();var t=this.$store.getters.config.indextime;t&&(this.timer=setInterval(this.getDatas,1e3*t))},stopMonitor:function(){clearInterval(this.timer),this.timer=null}}},r=i,l=(a("aaf1"),a("2877")),c=Object(l["a"])(r,n,o,!1,null,"cc4d912e",null);e["default"]=c.exports}}]);