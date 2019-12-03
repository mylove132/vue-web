<template>
    <div>
        <el-row>
            <el-row style="margin-top: 0px;margin-bottom: 5px;height: 60px;background: #f4f4f4;width: 100%">
                <div style="margin-left: 10px;color: #483D8B;margin-top: 20px;font-weight: bold">用例列表</div>
                <div style="margin-bottom: 50px">
                    <el-button type="danger" icon="el-icon-delete" style="float: right;margin-top: -30px;margin-right: 10px" @click="delCase">删除</el-button>
                    <el-popover
                            placement="right"
                            width="200"
                            trigger="click">
                        <el-select v-model="caseTypeId" clearable placeholder="请选择用例类型" @change="selectCaseType" >
                            <el-option
                                    v-for="item in caseTypeList"
                                    :key="item.id"
                                    :label="item.caseType"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-button type="primary" icon="el-icon-search"  slot="reference" style="margin-top: -30px;margin-right: 5px;float: right">新增</el-button>
                    </el-popover>

                    <el-dialog title="新增接口用例" :visible.sync="dialogTableVisible" center :append-to-body='true' :lock-scroll="false" width="70%" style="">
                        <add-interface-case-view></add-interface-case-view>
                    </el-dialog>
                    <el-dialog title="新增Web用例" :visible.sync="webDialogTableVisible" center :append-to-body='true' :lock-scroll="false" width="70%" style="">
                        <add-web-case-view></add-web-case-view>
                    </el-dialog>
                    <el-dialog title="新增App用例" :visible.sync="appDialogTableVisible" center :append-to-body='true' :lock-scroll="false" width="70%" style="">
                        <add-app-case-view></add-app-case-view>
                    </el-dialog>
                </div>
                <el-table
                        ref="multipleTable"
                        @selection-change="handleSelectionChange"
                        :data="caseList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="接口名称">
                                            <span>{{ props.row.name }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="CASE">
                                            <span>{{ props.row.cases }}</span>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="创建时间">
                                            <span>{{ props.row.createTime }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="请求类型">
                                            <el-select v-model="props.row.requestWayId" disabled>
                                                <el-option v-for="item in requestWayList" :key="item.way" :value="item.id" :label="item.way"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>


                                </el-row>

                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="用例 ID"
                            prop="id">
                    </el-table-column>
                    <el-table-column
                            label="商品名称"
                            prop="name">
                    </el-table-column>
                    <el-table-column
                            label="创建时间"
                            prop="createTime">
                    </el-table-column>
                    <el-table-column
                            align="right">
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mini"
                                    placeholder="输入关键字搜索"/>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        align="right"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5,10,15]"
                        :page-size="pagesize"
                        layout="total,jumper,prev, pager, next,sizes"
                        :total="caseListTotal"
                ></el-pagination>
            </el-row>
        </el-row>

    </div>
</template>

<script>
    import swal from 'sweetalert2';
    import { Loading } from 'element-ui';
    import Bus from '../../Bus'
    import AddInterfaceCaseView from './AddInterfaceCaseView';
    import AddAppCaseView from './AddAppCaseView';
    import AddWebCaseView from './AddWebCaseView';
    export default {
        name: 'InterfaceListView',
        data() {
            return {
                dialogTableVisible:false,
                webDialogTableVisible:false,
                appDialogTableVisible:false,
                caseTypeId:'',
                caseTypeList:[],
                search:'',
                caseList:[],
                requestWayList:[],
                currentPage: 1, //初始页
                pagesize: 5,    //    每页的数据
                caseListTotal:0,
                multipleSelection:[]
            }
        },
        created() {
            this.$fetch(this.$api.request_way_url).then(
                response => {
                    this.requestWayList = response.result
                }
            )
        },
        components:{
            AddInterfaceCaseView,
            AddAppCaseView,
            AddWebCaseView
        },
        created(){
            this.$fetch(this.$api.case_type_url).then(
                response => {
                    if (response.code == 0){
                        this.caseTypeList = response.result;
                    }
                }
            )
        },
        mounted(){
            const _this = this;
            Bus.$on('caseList',function(val) {
                let item = [];
                item = val.list;
                for (var i =0;i<item.length;i++){
                    item[i].createTime = _this.convertDate(item[i].createTime)
                }
                _this.caseList = item;
                _this.caseListTotal = val.total;
            })
        },
        methods:{
            selectCaseType(val){
                if (val == 1){
                    this.dialogTableVisible = true;
                    this.appDialogTableVisible = false;
                    this.webDialogTableVisible = false;
                }else if (val == 2){
                    this.dialogTableVisible = false;
                    this.appDialogTableVisible = false;
                    this.webDialogTableVisible = true;
                }else if (val == 3){
                    this.dialogTableVisible = false;
                    this.appDialogTableVisible = true;
                    this.webDialogTableVisible = false;
                }
            },
            convertDate(date){
                return date.replace(/(T)([\d:]+)(\.000\+0000)/g, ' $2');
            },
            handleSelectionChange(val){
               this.multipleSelection = val;
            },
            handleSizeChange:function(size){
                this.pagesize = size;
                this.hadleGetFilesListApi();
            },
            // 控制页面的切换
            handleCurrentChange: function(currentPage) {
                this.currentPage = currentPage;
                // console.log(currentPage)
                this.hadleGetFilesListApi();
            },
            //对所有数据进行分页处理 发送请求
            hadleGetFilesListApi() {
                let loading = Loading.service({ fullscreen: true ,background:'rgba(1,1,1,0.8)',spinner:'el-icon-loading'});
                this.queryCaseList(this.currentPage, this.pagesize)
                    .then(res => {
                        loading.close();
                        this.caseListTotal = res.result.total
                        let item = [];
                        item = res.result.list;
                        for (var i =0;i<item.length;i++){
                            item[i].createTime = this.convertDate(item[i].createTime)
                        }
                        this.caseList = item;
                    }).catch(res => {
                    loading.close();
                });
            },
            queryCaseList(page, size) {
                return this.$fetch(this.$api.case_url+'?catalogId='+localStorage.getItem('catalogId')+'&currentPage='+page+"&pageSize="+size);
            },
            addCase(){
                this.dialogTableVisible = true;
            },
            delCase(){
                let ids = []
                this.multipleSelection.forEach(col =>{
                    ids.push(col.id)
                });
                const _this = this;
                if (ids.length > 0){
                    swal({
                        title: 'Are you sure?',
                        text: "确认是否删除",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: '删除'
                    }).then((result) => {
                        if (result.value){
                            _this.$del(_this.$api.case_url+"?caseIds="+ids).then(
                                response => {
                                    if (response.code == 0){
                                        _this.$fetch(_this.$api.case_url+"?catalogId="+localStorage.getItem("catalogId")).then(
                                            response => {
                                                if (response.code == 0){
                                                    this.caseList = response.result.list;
                                                }
                                            }
                                        );
                                        swal({
                                            title:"删除成功",
                                            type:"success"
                                        });
                                    }
                                }
                            )
                        }
                    })

                }else {
                    swal({
                            position: 'center',
                            type: 'warning',
                            title: '请勾选删除用例ID',
                            showConfirmButton: false,
                            timer: 1500
                        }
                    );
                }

            }
        }
    };
</script>

<style scoped>

</style>