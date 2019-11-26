<template>
    <div style="ackground-color: #f0f0f0;">
        <div class="row" style="color: white;background: rgba(1,1,1,0.2);width: 100%;height: 60px;overflow-x: auto">

            <div style="float: right;margin-top: 10px;margin-right: 20px;margin-bottom: 5px;">
                <el-button @click="env_setting" type="primary" icon="el-icon-setting" size="medium" circle></el-button>
            </div>
            <el-dialog title="环境变量" :visible.sync="dialogTableVisible" center :append-to-body='true' :lock-scroll="false" width="50%" style="border-radius: 8px">
                <env-variable></env-variable>
            </el-dialog>
            <div  style="float: right;margin-top: 10px;margin-right: 20px">
                <el-select v-model="envId" clearable placeholder="请选择环境">
                    <el-option
                            v-for="item in envs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div style="float: right;margin-top: 10px;margin-right: 20px" >
                <el-button type="primary" icon="el-icon-plus" @click="addTab(editableTabsValue)"round>新增tab</el-button>
            </div>
        </div>
        <div class="row" style="clear:both;background-color: #f4f4f4">
            <div style="close:both">
                <el-tabs v-model="editableTabsValue"
                         type="card" closable
                         @tab-remove="removeTab">
                    <el-tab-pane
                            v-for="(item, index) in editableTabs"
                            :key="item.name"
                            :label="item.title"
                            :name="item.name"
                    >
                        <component :is="item.content" ref="childData" @getChildResult="getResult"></component>
                    </el-tab-pane>
                </el-tabs>
            <el-dialog title="接口保存" :visible.sync="saveDialogTableVisible" center :append-to-body='true' :lock-scroll="false" width="50%" style="">
                <save-collection v-bind:saveData="saveObj" @saveCatalogResult="getSaveResult"></save-collection>
            </el-dialog>
            </div>
        </div>
        <div class="row" style="margin-top: 20px">
            <div style="height: 50px;background: #1f2f3d;color: white;text-align: center;padding-top: 20px">Response</div>
            <div>
                <el-tabs v-model="httpRequestActiveName">
                    <el-tab-pane label="请求报文" name="request">请求报文头</el-tab-pane>
                    <el-tab-pane label="响应内容" name="response">
                        <json-viewer
                        :value="result"
                        :expand-depth="5"
                        copyable
                        boxed
                        sort
                        style="height:500px;overflow-y: auto"
                        ></json-viewer>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
    import swal from 'sweetalert2';
    import InterfaceContent from '../interface/InterfaceContent'
    import EnvVariable from '../../env/EnvVariable'
    import SaveCollection from '../collections/SaveCollection';
    export default {
        name: 'AddInterface',
        components:{
            InterfaceContent,EnvVariable,SaveCollection
        },
        data() {
            return {
                saveObj:{},
                envs:[],
                envId:'',
                dialogTableVisible:false,
                saveDialogTableVisible:false,
                httpRequestActiveName:'response',
                editableTabsValue: '1',
                editableTabs: [{
                    title: 'New Tab',
                    name: '1',
                    content: InterfaceContent
                }],
                result:{
                },
                tabIndex: 1
            };
        },
        methods: {
            covertParam(){
                alert("aassas")
                this.isform = false;
            },
            getResult(result){
                this.result = result;
            },
            getSaveResult(result){
              this.saveDialogTableVisible =!result;
            },
            addTab(targetName) {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs.push({
                    title: 'New Tab',
                    name: newTabName,
                    content: InterfaceContent
                });
                this.editableTabsValue = newTabName;
            },
            removeTab(targetName) {
                swal({
                    title: 'Are you sure?',
                    text: "请确认是否需要保存",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Save'
                }).then((result) => {
                    if (result.value){
                        let url = this.$refs.childData[0].url;
                        if (url == null || url == ""){
                            swal({
                                    position: 'center',
                                    type: 'warning',
                                    title: 'url不能为空',
                                    showConfirmButton: false,
                                    timer: 1500
                                }
                            );
                            return;
                        }
                        this.saveObj.url = url;
                        let paramType = null;
                        if ($('#requestWay').val() == 'get') {
                            paramType = null;
                        } else {
                            paramType = this.$refs.childData[0].paramActiveName == 'json' ? 'json' : 'form';
                        }
                        this.saveObj.paramType=paramType;
                        let headerObj = {};
                        this.$refs.childData[0].headerInput.map(function(e, item) {
                            if (e.name != '' && e.name != null) {
                                headerObj[e.name] = e.value;
                            }
                        });
                        this.saveObj.header=JSON.stringify(headerObj);
                        let paramObj = {};
                        if (this.$refs.childData[0].request_way_id == 1 || this.$refs.childData[0].request_way_id == '') {
                            paramObj = null;
                        } else {
                            this.$refs.childData[0].paramInput.map(function(e, item) {
                                if (e.name != '' && e.name != null) {
                                    paramObj[e.name] = e.value;
                                }
                            });
                        }
                        let par = '';
                        if (paramType == 'json'){
                            par = this.$refs.childData[0].jsonParam;
                        }else {
                            par = JSON.stringify(paramObj);
                        }
                        this.saveObj.param=par;
                        this.saveDialogTableVisible = true;
                    }else {
                        let tabs = this.editableTabs;
                        let activeName = this.editableTabsValue;
                        if (activeName === targetName) {
                            tabs.forEach((tab, index) => {
                                if (tab.name === targetName) {
                                    let nextTab = tabs[index + 1] || tabs[index - 1];
                                    if (nextTab) {
                                        activeName = nextTab.name;
                                    }
                                }
                            });
                        }

                        this.editableTabsValue = activeName;
                        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                    }
                })

            },
            env_setting(){
             this.dialogTableVisible = true;
            }
        }
    };
</script>
