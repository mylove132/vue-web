<template>
    <div style="background: white;overflow-y: auto">
        <el-row>
            <el-col :span="5" style="height: 100vh;background: #f4f4f4;margin-left: 5px;box-shadow: 2px 0 5px -1px #cccccc;">
                <el-row>
                </el-row>
                <el-tabs v-model="activeName" type="card" style="background-color: #f4f4f4;height: 100vh;">
                    <el-tab-pane label="History" name="history">
                    </el-tab-pane>
                    <el-tab-pane label="Collections" name="collections">
                        <el-row style="height: 30px;margin-bottom: 5px;">
                            <el-select v-model="caseTypeId" clearable placeholder="请选择用例类型" style="width: 32%;margin-left: 2px" @change="queryCatalogList" id="caseTypeId">
                                <el-option
                                        v-for="item in caseTypeList"
                                        :key="item.id"
                                        :label="item.caseType"
                                        :value="item.id">
                                </el-option>
                            </el-select>
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
                        <interface-page v-bind:catalogList="catalogList" v-if="catalogList.length > 0"></interface-page>
                    </el-tab-pane>
                    <el-tab-pane label="Monitor" name="monitor"></el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="13" style="margin-left: 10px;height: 90vh;overflow-y: auto;">
                <add-interface v-if="isShowAddInterface"></add-interface>
                <interface-list-view v-else="isShowAddInterface"></interface-list-view>
            </el-col>
            <el-col :span="5" style="margin-left: 10px;overflow-y: auto;">
                <covert></covert>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Bus from '../../Bus'
    import InterfacePage from '../collections/Interface_Page'
    import AddInterface from './AddInterface'
    import Covert from '../../covert/Covert'
    import InterfaceListView from './InterfaceListView';
    export default {
        name: 'interfaceauto',
        data() {
            return {
                caseTypeId:'',
                caseTypeList:[],
                userId:'',
                userList:[],
                envId:'',
                envList:[],
                catalogList:[],
                isShowAddInterface:false,
                activeName:'collections'
            };
        },
        created(){
            this.$fetch(this.$api.case_type_url).then(response => {
                this.caseTypeList = response.result
            });
            this.$fetch(this.$api.env_url).then(response => {
                this.userList = response.result
            });
            this.$fetch(this.$api.env_url).then(response => {
                this.envList = response.result
            });
        },
        mounted(){
            this.$fetch(this.$api.catalogUrl).then(
                response => {
                    this.catalogList = response.result;
                }
            )
        },
        computed:{
           getCaseList(){
               this.caseList = this.$refs.collectionsChild.caseList
           }
        },
        components:{
            InterfacePage,
            AddInterface,
            Covert,
            InterfaceListView
        },
        methods:{
            queryCatalogList(){
                this.$fetch(this.$api.catalogUrl+"?caseTypeId="+this.caseTypeId+"&userId="+this.userId+"&envId="+this.envId).then(
                    response => {
                        this.catalogList = response.result;
                    }
                )
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
    .icon-warp{
        font-size: 20px;
    }
</style>
