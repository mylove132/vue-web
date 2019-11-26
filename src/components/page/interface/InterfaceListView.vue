<template>
    <div>
        <el-row>
            <el-row style="margin-top: 0px;margin-bottom: 5px;height: 60px;background: #f4f4f4;width: 100%">
                <div style="margin-left: 10px;color: #483D8B;margin-top: 20px;font-weight: bold">用例列表</div>
                <div style="margin-bottom: 50px">
                    <el-button type="danger" icon="el-icon-delete" style="float: right;margin-top: -30px;margin-right: 10px">删除</el-button>
                    <el-button type="warning" icon="el-icon-edit" style="float: right;margin-top: -30px;margin-right: 10px">编辑</el-button>
                    <el-button type="primary" icon="el-icon-search" style="margin-top: -30px;margin-right: 5px;float: right">新增</el-button>
                </div>
                <el-table
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
                                        <el-form-item label="URL">
                                            <span>{{ props.row.url }}</span>
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
<!--        <el-row style="margin-top: 200px">-->
<!--            <el-row style="margin-top: 0px;margin-bottom: 5px;height: 60px;background: #f4f4f4;width: 100%">-->
<!--                <div style="margin-left: 10px;color: #483D8B;margin-top: 20px;font-weight: bold">接口列表</div>-->
<!--                <div>-->
<!--                    <el-button type="danger" icon="el-icon-delete" style="float: right;margin-top: -30px;margin-right: 10px">删除</el-button>-->
<!--                    <el-button type="warning" icon="el-icon-edit" style="float: right;margin-top: -30px;margin-right: 10px">编辑</el-button>-->
<!--                    <el-button type="primary" icon="el-icon-search" style="margin-top: -30px;margin-right: 5px;float: right">新增</el-button>-->
<!--                </div>-->

<!--            </el-row>-->
<!--            <el-table-->
<!--                    @selection-change="handleSelectionChange"-->
<!--                    :data="caseList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->
<!--                    tooltip-effect="dark"-->
<!--                    style="width: 100%">-->
<!--                <el-table-column-->
<!--                        type="selection"-->
<!--                        width="55">-->
<!--                </el-table-column>-->
<!--                <el-table-column type="expand">-->
<!--                    <template slot-scope="props">-->
<!--                        <el-form label-position="left" inline class="demo-table-expand">-->
<!--                            <el-row>-->
<!--                                <el-col :span="12">-->
<!--                                    <el-form-item label="接口名称">-->
<!--                                        <span>{{ props.row.name }}</span>-->
<!--                                    </el-form-item>-->
<!--                                </el-col>-->
<!--                                <el-col :span="12">-->
<!--                                    <el-form-item label="URL">-->
<!--                                        <span>{{ props.row.url }}</span>-->
<!--                                    </el-form-item>-->
<!--                                </el-col>-->

<!--                            </el-row>-->
<!--                            <el-row>-->
<!--                                <el-col :span="12">-->
<!--                                    <el-form-item label="创建时间">-->
<!--                                        <span>{{ props.row.createTime }}</span>-->
<!--                                    </el-form-item>-->
<!--                                </el-col>-->
<!--                                <el-col :span="12">-->
<!--                                    <el-form-item label="请求类型">-->
<!--                                        <el-select v-model="props.row.requestWayId" disabled>-->
<!--                                            <el-option v-for="item in requestWayList" :key="item.way" :value="item.id" :label="item.way"></el-option>-->
<!--                                        </el-select>-->
<!--                                    </el-form-item>-->
<!--                                </el-col>-->


<!--                            </el-row>-->

<!--                        </el-form>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        label="用例 ID"-->
<!--                        prop="id">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        label="商品名称"-->
<!--                        prop="name">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        label="创建时间"-->
<!--                        prop="createTime">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                        align="right">-->
<!--                    <template slot="header" slot-scope="scope">-->
<!--                        <el-input-->
<!--                                v-model="search"-->
<!--                                size="mini"-->
<!--                                placeholder="输入关键字搜索"/>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--            </el-table>-->
<!--            <el-pagination-->
<!--                    align="right"-->
<!--                    background-->
<!--                    @size-change="handleSizeChange"-->
<!--                    @current-change="handleCurrentChange"-->
<!--                    :current-page="currentPage"-->
<!--                    :page-sizes="[5,10,15]"-->
<!--                    :page-size="pagesize"-->
<!--                    layout="total,jumper,prev, pager, next,sizes"-->
<!--                    :total="caseListTotal"-->
<!--            ></el-pagination>-->
<!--        </el-row>-->

    </div>
</template>

<script>
    import Bus from '../../Bus'
    export default {
        name: 'InterfaceListView',
        data() {
            return {
                search:'',
                caseList:[],
                requestWayList:[],
                currentPage: 1, //初始页
                pagesize: 5,    //    每页的数据
                caseListTotal:0,
            }
        },
        created() {
            this.$fetch(this.$api.request_way_url).then(
                response => {
                    this.requestWayList = response.result
                }
            )
        },
        mounted(){
            const _this = this;
            Bus.$on('caseList',function(val) {
                let item = [];
                item = val;
                for (var i =0;i<item.length;i++){
                    item[i].createTime = _this.convertDate(item[i].createTime)
                }
                _this.caseList = item;
            })
        },
        methods:{
            convertDate(date){
                return date.replace(/(T)([\d:]+)(\.000\+0000)/g, ' $2');
            },
            handleSelectionChange(){

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
                        this.caseList = res.result.list;
                    }).catch(res => {
                    loading.close();
                });
            },
            queryCaseList(page, size) {
                return this.$fetch(this.$api.interface_case_url+'?currentPage='+page+"&pageSize="+size);
            }
        }
    };
</script>

<style scoped>

</style>