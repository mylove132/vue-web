<template>
    <div>
        <el-row style="height: 5vh;border-radius: 5px;">

            <el-input
                    @keyup.native="searchCatalog(searchText)"
                    prefix-icon="el-icon-search"
                    v-model="searchText"
                    style="border: 1px solid #6666FF;border-radius: 5px;width: 98%;margin-left: 1px"
                    clearable>
            </el-input>
        </el-row>
        <div id="tree" style="margin-top: 10px"></div>
        <el-button style="width: 100%;background-color: #6666FF;color: white;border-radius: 5px;margin-top: 20px">
            添加根目录
        </el-button>
    </div>
</template>

<script>
    import swal from 'sweetalert2';
    export default {
        name: 'Interface_Page',
        data(){
            return{
                searchText:'',
            }
        },
        mounted() {
            const _this = this;
            var treeObj = $('#tree').jstree({
                'plugins': ['contextmenu', 'dnd', 'search', 'state', 'types', 'wholerow'],
                'core': {
                    'animation': 0,
                    'check_callback': true,
                    'force_text': true,
                    'themes': { 'stripes': true },
                    'data': function (obj, callback) {
                        var jsonstr="[]";
                        var jsonarray = eval('('+jsonstr+')');
                        $.ajax({
                            type: "GET",
                            url: _this.$api.catalogUrl+"?type=interface",
                            dataType:"json",
                            async: false,
                            success:function(result) {
                                var arrays= result.result;
                                for (var i=0;i<arrays.length;i++){
                                    jsonarray.push(arrays[i]);
                                }
                            }

                        });
                        callback.call(this, jsonarray);
                    }
                },

                'types': {
                    'default': {
                        'icon': 'el-icon-folder-opened'
                    },
                    'file': {
                        'icon': 'el-icon-folder-opened'
                    }
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
                        _this.$del(_this.$api.catalogUrl+"/"+data.node.id).then(
                            response => {
                                if (response.code == 0){
                                    data.instance.refresh();
                                    swal(
                                        'Deleted!',
                                        'Your file has been deleted.',
                                        'success'
                                    )
                                }else {
                                    data.instance.refresh();
                                    swal(
                                        'Fail!',
                                        '删除失败',
                                        'error'
                                    )
                                }
                            }
                        ).catch(
                            err => {
                                data.instance.refresh();
                            }
                        )
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
                        swal(
                            '修改成功!',
                            'Your file has been update.',
                            'success'
                        )
                    }else {
                        data.instance.refresh();
                        swal(
                            'Fail!',
                            '修改失败',
                            'error'
                        )
                    }
                }).catch(
                    err => {
                        data.instance.refresh();
                    }
                )
            })
            //     .on('select_node.jstree', function (e, data) {
            //     _this.$fetch(_this.$api.catalogUrl+"/cases/"+data.node.id).then(
            //         response => {
            //             if (response.code == 0){
            //                 _this.cases = response.result
            //             }else {
            //                 swal(
            //                     'Fail!',
            //                     '获取脚本列表失败',
            //                     'error'
            //                 )
            //             }
            //         }
            //     ).catch(
            //         err = {}
            //     )
            // })
        },
        methods: {
            searchCatalog(keyword) {
                var to = false;
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function() {
                    $('#tree').jstree(true).search(keyword);
                }, 250);
            }
        }
    };
</script>

<style scoped>

</style>
