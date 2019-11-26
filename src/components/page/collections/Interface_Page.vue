<template>
    <div>
        <el-row style="height: 5vh;border-radius: 5px;">
            <div style="height: 60px;background: #e8e8e8;width: 100%" v-if="isSearch">
                <el-button type="primary" icon="el-icon-folder-add" size="medium" style="float:right;margin-top: 10px;margin-right: 10px;font-size: 20px"  circle></el-button>
                <el-button type="primary" icon="el-icon-search" size="medium" @click="seachDir" style="float:right;margin-top: 10px;margin-right: 20px;font-size: 20px" circle></el-button>

            </div>
            <div v-else="isSearch">
                <el-input
                        @keyup.native="searchCatalog(searchText)"
                        prefix-icon="el-icon-search"
                        v-model="searchText"
                        style="border: 1px solid #6666FF;border-radius: 5px;width: 87%;margin-left: 1px;margin-left: 10px;margin-top: 10px"
                        clearable>
                </el-input>
                <el-link style="margin-left: 20px" @click="closeSearch" icon="el-icon-close"></el-link>
            </div>


            <el-dialog title="添加根目录" :visible.sync="dialogTableVisible" center :append-to-body='true' :lock-scroll="false" width="30%" style="">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="根目录名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="环境" prop="env">
                        <el-select v-model="ruleForm.env" placeholder="请选择环境">
                            <el-option v-for="item in envList" :label="item.env" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-row>
        <div id="tree" style="margin-top: 50px"></div>

    </div>
</template>

<script>
    import swal from 'sweetalert2';
    import Bus from '../../Bus'
    export default {
        name: 'Interface_Page',
        data(){
            return{
                isSearch:true,
                searchText:'',
                userList:[],
                caseList:[],
                envList:{},
                dialogTableVisible:false,
                ruleForm:{
                    name:'',
                    env:''

                },
                rules:{
                    name: [
                        { required: true, message: '请输入接口名称', trigger: 'blur' }
                    ],
                    env: [
                        { required: true, message: '请选择环境', trigger: 'change' }
                    ]
                }
            }
        },
        props:[
            "catalogList"
        ],
        mounted() {
            console.log(this.catalogList)
            const _this = this;
                var treeObj = $('#tree').jstree({
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
                    _this.$fetch(_this.$api.interface_case_url+"?catalogId="+data.node.id).then(
                        response => {
                            if (response.code == 0){
                                _this.caseList = response.result.list;
                                Bus.$emit('caseList',_this.caseList);
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
        methods: {
            searchCatalog(keyword) {
                var to = false;
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function() {
                    $('#tree').jstree(true).search(keyword);
                }, 250);
            },
            addRootDir(){
                this.$fetch(this.$api.env_url).then(
                    response => {
                        if (response.code == 0){
                            this.envList = response.result;
                        }else {
                            alert("获取环境目录失败")
                        }
                    }
                )
                this.dialogTableVisible = true;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$post(this.$api.catalogUrl,this.qs.stringify({
                            text:this.ruleForm.name,
                            envId:this.ruleForm.env
                        })).then(
                            response => {
                                if (response.code == 0){
                                    this.dialogTableVisible = false;
                                    swal({
                                            position: 'center',
                                            type: 'success',
                                            title: '保存成功',
                                            showConfirmButton: false,
                                            timer: 1500
                                        }
                                    );
                                }else {
                                    swal({
                                            position: 'center',
                                            type: 'error',
                                            title: '保存目录失败',
                                            showConfirmButton: false,
                                            timer: 1500
                                        }
                                    );
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
            seachDir(){
                this.isSearch = false;
            },
            closeSearch(){
                this.isSearch = true;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    };
</script>

<style scoped>

</style>
