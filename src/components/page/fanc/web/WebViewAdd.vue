<template>
    <div style="background: white">
        <el-row>
            <el-col :span="4" style="height: 100vh;background: #f4f4f4">
                <div id="tree"></div>
                <input type="text" id="searchCatalog" style="border-radius: 5px;height: 30px;width: 200px"
                       @keyup="searchCatalog"/>
            </el-col>
            <el-col :span="10" style="background: #111">
            </el-col>
            <el-col :span="8">

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import swal from 'sweetalert2';
    export default {
        name: 'webauto',
        data() {
            return {
                catalogList: [],
                cases:[]
            };
        },
        created() {
            // async function f() {
            //     this.catalogList = await axios.get(this.$api.catalogUrl);
            //     console.log(this.catalogList)
            // }
            this.$fetch(this.$api.catalogUrl).then(
                response => {
                    console.log(JSON.stringify(response.result));
                }
            );
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
                    'data': [{
                        'id': 1,
                        'text': '首页目录',
                        'icon': 'el-icon-folder-opened',
                        'parentId': 0,
                        'type': 'interface',
                        'children': [{
                            'id': 4,
                            'text': '课程表',
                            'icon': 'el-icon-folder-opened',
                            'parentId': 1,
                            'type': 'interface',
                            'children': [{
                                'id': 6,
                                'text': '学生课程表',
                                'icon': 'el-icon-folder-opened',
                                'parentId': 4,
                                'type': 'interface',
                                'children': []
                            }, {
                                'id': 7,
                                'text': '老师课程表',
                                'icon': 'el-icon-folder-opened',
                                'parentId': 4,
                                'type': 'interface',
                                'children': []
                            }]
                        }, {
                            'id': 5,
                            'text': '课外作业',
                            'icon': 'el-icon-folder-opened',
                            'parentId': 1,
                            'type': 'interface',
                            'children': []
                        }]
                    }, {
                        'id': 2,
                        'text': '语文目录',
                        'icon': 'el-icon-folder-opened',
                        'parentId': 0,
                        'type': 'interface',
                        'children': []
                    }, {
                        'id': 3,
                        'text': '数学目录',
                        'icon': 'el-icon-folder-opened',
                        'parentId': 0,
                        'type': 'interface',
                        'children': []
                    }]

                },

                'types': {
                    'default': {
                        'icon': 'el-icon-folder-opened'
                    },
                    'file': {
                        'icon': 'el-icon-folder-opened'
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
                        _this.$del(_this.$api.catalogUrl+"?catalogId="+data.node.id).then(
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
            }).on('select_node.jstree', function (e, data) {
                _this.$fetch(_this.$api.catalogUrl+"/cases/"+data.node.id).then(
                    response => {
                        if (response.code == 0){
                            _this.cases = response.result
                        }else {
                            swal(
                                'Fail!',
                                '获取脚本列表失败',
                                'error'
                            )
                        }
                    }
                ).catch(
                    err = {}
                )
            })
        },
        methods: {
            searchCatalog() {
                var to = false;
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function() {
                    var v = $('#searchCatalog').val();
                    $('#tree').jstree(true).search(v);
                }, 250);
            }
        }
    };
</script>

<style scoped>

</style>