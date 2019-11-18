<template>
    <div style="width: 300vh;height: 100vh">
        <el-row>
            <el-col :span="10">
                <el-tabs v-model="editableTabsValue"
                         style="background-color: white;height: 100vh;width: 100%;background-color: #f0f0f0"
                         type="card" closable
                         @tab-remove="removeTab">
                    <el-tab-pane
                            v-for="(item, index) in editableTabs"
                            :key="item.name"
                            :label="item.title"
                            :name="item.name"
                    >
                        <component :is="item.content"></component>
                    </el-tab-pane>
                </el-tabs>
            </el-col>

            <el-col :span="4">
                <el-link icon="el-icon-plus" style="margin-left: -260px;color: #f07423;margin-top: 10px" @click="addTab(editableTabsValue)">New Tab</el-link>
            </el-col>
        </el-row>

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
                editableTabsValue: '1',
                editableTabs: [{
                    title: 'New Tab',
                    name: '1',
                    content: InterfaceContent
                }],
                tabIndex: 1
            };
        },
        methods: {
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
