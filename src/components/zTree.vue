<template>
    <div id="areaTree"  class="boxshadow">
        <div class="box-title">
        </div>
        <div class="tree-box">
            <div class="zTreeDemoBackground left">
                <ul id="treeDemo" class="ztree"></ul>
            </div>
        </div>
    </div>
</template>
 
<script>
    import "../../static/plugin/ztree/js/jquery-1.7.2.min.js"
    import "../../static/plugin/niceScroll/jquery.nicescroll.js"
    import "../../static/plugin/ztree/js/jquery.ztree.core.min.js"
    import "../../static/plugin/ztree/js/jquery.ztree.excheck.min.js"
    export default {
        name: 'areaTree',
        components:{
        },
        data:function(){
            return{
                setting:{
                    data: {  
                        simpleData: {  
                            enable: true  
                        }  
                    },
                    callback: {
                        onClick: this.zTreeOnClick,
                        onExpand: this.zTreeOnExpand,
                        beforeCollapse: this.zTreeOnCollapse
                    }
                },
                zNodes:[]
            }
        },
        methods:{
            niceScroll: function () {
                // alert(navigator.userAgent.indexOf("Firefox"))
                if(navigator.userAgent.indexOf("Firefox") > -1){
                    $('#treeDemo').niceScroll({
                        cursorwidth: "0px", /*像素光标的宽度*/
                        autohidemode: 'hidden'
                    })
                } else {
                    $('#treeDemo').niceScroll({
                        cursorcolor: "#bcbdbd",
                        cursorwidth: "12px", /*像素光标的宽度*/
                    })
                }
                $('#treeDemo').css('overflow', 'auto')
            },
            /*将接口数组转化为ztree列表可执行*/
            resizeZtreeList: function (obj) {
                var zNode = []
                obj.forEach( (i) => {
                    var item = {
                        id: i.id,
                        name: i.name,
                        open: false,
                        icon: i.icon,
                        pid: i.PARENTID,
                        children: null
                    }
                    if (i.haschildren != '0') {
                        /*如果当前存在孩子节点,设置其状态[],表示有孩子*/
                        item.children = []
                    }
                    zNode.push(item)
                })
                return zNode
            },
            /*id:功能位置id   show:是否展示子元素*/
            setId: function (id, show = false) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo")
                var node = zTree.getNodeByParam("id",id );
                zTree.cancelSelectedNode();//先取消所有的选中状态
                zTree.selectNode(node,true);//将指定ID的节点选中
                if (show) {
                    zTree.expandNode(node, true, false);//将指定ID节点展开
                }
            },
            /*刷新zTree数据*/
            freshArea: function (zNodes) {
                this.zNodes = zNodes
                console.log('当前组装好的数据:' + JSON.stringify(this.zNodes))
                $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes)
                // this.niceScroll()
            },
            /*zTree节点点击事件,非+-号,是名称上的点击事件*/
            zTreeOnClick: function (event, treeId, treeNode) {
                this.$emit('setLocationId', treeNode.id)
                console.log(treeNode.tId + ", " + treeNode.name)
            },
            /*节点扩展事件*/
            zTreeOnExpand: function (event, treeId, treeNode) {
                // debugger
                this.post(this.INTERFACE.getLocationsTreeByParams, {parentid: treeNode.id}, (isSuccess, res) => {
                    if (isSuccess) {
                        /* 避免用户过快操作*/
                        if (treeNode.open && (treeNode.children.length === 0)) {
                            var treeObj = $.fn.zTree.getZTreeObj("treeDemo")
                            treeObj.addNodes(treeNode, this.resizeZtreeList(res))
                            setTimeout(() => {
                                $('#treeDemo').getNiceScroll().resize()
                            },300)
                        }                      
                    }
                },true)
            },
            /*节点即将收起事件*/
            zTreeOnCollapse: function (treeId, treeNode) {
                // debugger
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo")
                treeObj.removeChildNodes(treeNode)
                treeObj.addNodes(treeNode, [])
                setTimeout(() => {
                    $('#treeDemo').getNiceScroll().resize()
                },300)
                console.log(JSON.stringify(treeNode))
            }
        },
        mounted: function () {
            setTimeout(() => {
                this.niceScroll()
            },300)
            
        }
    }
</script>
<style>
/*#areaTree ::-webkit-scrollbar {display: none}*/
#treeDemo{
    overflow: auto!important;
}
.ztree li span.button.item_ico_docu{
    background: url(../../static/img/item_close.png) 0 0 no-repeat;
    margin-right: 2px;
    vertical-align: top;
}
.ztree li .curSelectedNode span.button.item_ico_docu{
    background: url(../../static/img/item_open.png) 0 0 no-repeat;
    margin-right: 2px;
    vertical-align: top;
}
#areaTree{
    background: #fff;
    width: 200px;
    border: 1px solid #e5e5e5;    
    margin-bottom: 2px;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
}
.box-title{
    border-radius: 3px 3px 0 0;
    background-color: #f5f5f5;
}
.box-title a{
    color: #2fa4e7;
    text-decoration: none;
    font-size: 14px;    
    display: block;
    padding: 8px 15px;
    cursor: pointer;
}
.box-title .fa{
    float: right;
    line-height: 20px;
}
</style>
