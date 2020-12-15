<template>
    <div class="tree-box">
      <div class="zTreeDemoBackground left">
        <ul id="treeDemo" class="ztree"></ul>
      </div>
    </div>
</template>

<script>
  export default {
    name: "zTree",
    data:function(){
      return{
        setting:{
          view: {
            addHoverDom: this.addHoverDom,
            removeHoverDom: this.removeHoverDom,
            selectedMulti: false
          },
          edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: this.showRemoveBtn,
            showRenameBtn: this.showRenameBtn,
            showAddBtn: this.showAddBtn
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            beforeDrag: this.beforeDrag,
            beforeEditName: this.beforeEditName,
            beforeRemove: this.beforeRemove,
            beforeRename: this.beforeRename,
            onRemove: this.onRemove,
            onRename: this.onRename
          }
        },
        zNodes:[
          {id:1, pId:0, name: "父节点1"},
          {id:11, pId:1, name: "子节点1"}
        ],
        className : "dark",
        newCount : 1

      }
    },
    methods:{
      beforeDrag: function (treeId, treeNodes) {
        return false;
      },
      beforeEditName: function (treeId, treeNode) {
        this.className = (this.className === "dark" ? "":"dark");
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        setTimeout(function() {
          if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
            setTimeout(function() {
              zTree.editName(treeNode);
            }, 0);
          }
        }, 0);
        return false;
      },
      beforeRemove: function(treeId, treeNode) {
        this.className = (this.className === "dark" ? "":"dark");
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.selectNode(treeNode);
        return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
      },
      beforeRename: function(treeId, treeNode, newName, isCancel) {
        this.className = (this.className === "dark" ? "":"dark");
        if (newName.length == 0) {
          setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.cancelEditName();
            alert("耗材名称不能为空.");
          }, 0);
          return false;
        }
        return true;
      },
      // showRemoveBtn: function(treeId, treeNode) {
      //   return !treeNode.isFirstNode;
      // },
      // showRenameBtn: function(treeId, treeNode) {
      //   return !treeNode.isLastNode;
      // },



      addHoverDom: function(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
        var addStr = "<span class='button add'  id='addBtn_" + treeNode.tId
          + "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_"+treeNode.tId);
        var newCount=1;
        if (btn) btn.bind("click", function(){
          var zTree = $.fn.zTree.getZTreeObj("treeDemo");
          zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
          return false;
        });
      },
      removeHoverDom: function(treeId, treeNode) {
        $("#addBtn_"+treeNode.tId).unbind().remove();
      },


  },
    mounted(){
      $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    }
  }
</script>

<style>
  @import '../../ztree/css/zTreeStyle/zTreeStyle.css';


  .box-title a{
    color: #2fa4e7;
    text-decoration: none;font-size:14px;    display: block;
    padding: 8px 15px;cursor: pointer;
  }

</style>
