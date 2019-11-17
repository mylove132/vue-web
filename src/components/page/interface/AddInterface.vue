<template>
    <div style="width: 300vh">
        <el-row>
            <el-col :span="10">
                <el-tabs v-model="editableTabsValue"
                         style="background-color: white;height: 100vh;width: 100%;background-color: #f0f0f0" type="card" closable
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
                <el-button style="margin-top: 8px" type="primary" @click="addTab(editableTabsValue)" icon="el-icon-plus">新建</el-button>
            </el-col>
        </el-row>

    </div>
</template>
<script>
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
                    title: 'New Tba',
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
        }
    };
</script>
