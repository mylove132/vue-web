<template>
    <div>
        <el-row>
            <el-col :span="6">
                <el-row>
                    <el-select v-model="userId" clearable placeholder="请选择用户" style="width: 32%;margin-left: 2px" @change="queryCatalogList">
                        <el-option
                                v-for="item in userList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="envId" clearable placeholder="请选择环境" style="width: 32%;margin-left: 2px" @change="queryCatalogList">
                        <el-option
                                v-for="item in envList"
                                :key="item.id"
                                :label="item.env"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-row>
                <div id="caseTree" style="margin-top: 50px"></div>
            </el-col>
            <el-col :span="18"></el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: 'AddInterfaceCaseView',
        data(){
            return{
                userId:'',
                envId:'',
                userList:[],
                envList:[],
                catalogList:[]
            }
        },
        mounted() {
            this.$fetch(this.$api.catalogUrl+"?userId="+this.userId+"&envId="+this.envId).then(
                response => {
                    this.catalogList = response.result
                }
            )
            const _this = this;
            var treeObj = $('#caseTree').jstree({
                'plugins': ['contextmenu', 'dnd', 'search', 'state'],
                'core': {
                    'animation': 0,
                    'check_callback': true,
                    'force_text': true,
                    'themes': { "variant" : "large",'stripes': true },
                    'data':_this.catalogList
                },
                "contextmenu":{
                    select_node:false,
                    show_at_node:true,
                    items:{
                        "新建目录":{
                            "label":"新建目录",
                            "icon": "el-icon-plus",
                            "action":function(data){
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, {}, "last", function (new_node) {
                                    try {
                                        new_node.text="new fold";
                                        inst.edit(new_node);
                                    } catch (ex) {
                                        setTimeout(function () { inst.edit(new_node); },0);
                                    }
                                });
                            }
                        },
                        "修改目录":{
                            "separator_before"	: false,
                            "separator_after"	: false,
                            "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                            "label"				: "修改目录",
                            "shortcut_label"	: 'F2',
                            "icon"				: "el-icon-edit",
                            "action"			: function (data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.edit(obj);
                            }
                        },
                        "删除目录":{
                            "separator_before"	: false,
                            "icon"				: false,
                            "separator_after"	: false,
                            "_disabled"			: false, //(this.check("delete_node", data.reference, this.get_parent(data.reference), "")),
                            "label"				: "删除目录",
                            "icon"				:"el-icon-delete",
                            "action"			: function (data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                if(inst.is_selected(obj)) {
                                    inst.delete_node(inst.get_selected());
                                }
                                else {
                                    inst.delete_node(obj);
                                }
                            }
                        }
                    }
                },
            }).on('delete_node.jstree', function (e, data) {
                    swal({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        if (result.value){
                            _this.$del(_this.$api.catalogUrl+"/"+data.node.id).then(
                                response => {
                                    if (response.code == 0){
                                        data.instance.refresh();
                                        swal({
                                                position: 'top-end',
                                                type: 'success',
                                                title: 'delete success',
                                                showConfirmButton: false,
                                                timer: 1500
                                            }
                                        )
                                    }else {
                                        data.instance.refresh();
                                        swal({
                                            position: 'top-end',
                                            icon: 'error',
                                            title: 'delete fail',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    }
                                }
                            ).catch(
                                err => {
                                    data.instance.refresh();
                                }
                            )
                        }else {
                            data.instance.refresh();
                        }

                    })
                }
            ).on('rename_node.jstree', function (e, data) {
                const param = {
                    "id":data.node.id,
                    "text":data.node.text
                };
                _this.$put(_this.$api.catalogUrl,_this.qs.stringify(param)).then(response => {
                    if (response.code == 0){
                        data.instance.refresh();
                        swal({
                                position: 'top-end',
                                type: 'success',
                                title: '修改成功',
                                showConfirmButton: false,
                                timer: 1500
                            }
                        )
                    }else {
                        data.instance.refresh();
                        swal({
                                position: 'top-end',
                                type: 'error',
                                title: '修改失败',
                                showConfirmButton: false,
                                timer: 1500
                            }
                        )
                    }
                }).catch(
                    err => {
                        data.instance.refresh();
                    }
                )
            }).on('select_node.jstree', function (e, data) {
                _this.$fetch(_this.$api.case_url+"?catalogId="+data.node.id).then(
                    response => {
                        if (response.code == 0){
                            _this.caseList = response.result;
                            Bus.$emit('caseList',_this.caseList);
                            localStorage.setItem("catalogId",data.node.id);
                        }else {
                            swal({
                                position: 'center',
                                icon: 'error',
                                title: '获取目录下脚本失败',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }
                )
            })
        },
        methods:{
            queryCatalogList(){},
        }
    }

</script>

<style scoped>

</style>