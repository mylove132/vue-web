<template>
    <div>
<div style="height: 40vh;margin-top: 5px;margin-left: -8px">
    <el-tabs v-model="activeName">
        <el-tab-pane label="Header" name="header">
            <el-table
                    :data="headerInput"
                    style="width: 100%">
                <el-table-column
                        prop="key"
                        label="Key"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="value"
                        label="Value"
                        width="180">
                </el-table-column>
                <el-table-column>
                </el-table-column>
            </el-table>
            <a style="margin-left: 100px" class="button" type="primary" v-show="headerInput.length" @click="clearHeader">一键清空</a>
            <ul style="list-style: none">
                <li v-for="(item,index) in headerInput">
                    <el-input v-model="item.name" placeholder="请输入key" style="width: 200px"></el-input>
                    <el-input v-model="item.value" placeholder="请输入value" style="margin-left: 10px;width: 200px"></el-input>
                    <el-button class="button" type="danger" @click="handleHeadereDel(index)" plain icon="el-icon-delete" style="margin-left:10px;"></el-button>
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="body" name="body"></el-tab-pane>
    </el-tabs>
</div>
    <div style="height: 30px;background-color: #cccccc;width: 100%;margin-left: -8px">
        Response
    </div>
    <div></div>
    </div>
</template>

<script>
    export default {
        name: 'HeaderView',
        data(){
            return{
                activeName:'header',
                headerInput:[{}]
            }
        },
        methods:{
            handleHeaderAdd(){},
            handleHeadereDel(index){},
            clearHeader(){},

        }
    };
</script>

<style scoped>

</style>
