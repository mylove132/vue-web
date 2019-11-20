<template>
    <div style="ackground-color: #f0f0f0;width: 100vh;min-width: 80vh">
        <div class="row" style="color: white;background: rgba(1,1,1,0.2);width: 100%;height: 60px">

            <div style="float: right;margin-top: 10px;margin-right: 20px;margin-bottom: 5px;">
                <el-button type="primary" icon="el-icon-setting" size="medium" circle></el-button>
            </div>

            <div  style="float: right;margin-top: 10px;margin-right: 10px">
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

                <el-tabs v-model="editableTabsValue"
                         type="card" closable
                         @tab-remove="removeTab">
                    <el-tab-pane
                            v-for="(item, index) in editableTabs"
                            :key="item.name"
                            :label="item.title"
                            :name="item.name"
                    >
                        <component :is="item.content" @getChildResult="getResult"></component>
                    </el-tab-pane>
                </el-tabs>
        </div>
        <div class="row" style="margin-top: 20px">
            <div style="height: 50px;background: #1f2f3d;color: white;text-align: center;">Response</div>
            <div style="background: #f4f4f4;height: 20vh">
                <el-tabs v-model="httpRequestActiveName">
                    <el-tab-pane label="请求报文" name="request">用户管理</el-tab-pane>
                    <el-tab-pane label="响应内容" name="response">
                        <json-viewer
                        :value="result"
                        :expand-depth="5"
                        copyable
                        boxed
                        sort
                        style="overflow-y: auto"
                        ></json-viewer>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
    import swal from 'sweetalert2';
    import InterfaceContent from '@/components/page/interface/InterfaceContent'
    export default {
        name: 'AddInterface',
        components:{
            InterfaceContent
        },
        data() {
            return {
                envs:[],
                envId:'',
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
            getResult(result){
                this.result = result;
            }
            ,
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

            }
        }
    };
</script>
