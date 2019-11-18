<template>
    <div style="height: 50vh;overflow-y: auto">
        <el-row>
            <el-col :span="16">
                <el-input v-model="url" size="medium" class="input-with-select" style="width: 95%;height:42px;border-radius: 5px;margin-left:8px;">
                    <el-select v-model="request_way" slot="prepend" style="width: 120px" placeholder="请选择">
                        <el-option label="GET" value="1"></el-option>
                        <el-option label="POST" value="2"></el-option>
                        <el-option label="DELETE" value="3"></el-option>
                    </el-select>
                </el-input>
            </el-col>
            <el-col :span="2">
                <el-button style="background-color: #097bed;margin-left:2px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;">Send</el-button>
            </el-col>
            <el-col :span="2">
                <el-button style="background-color: #f47023;margin-left:16px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;border: #ff4b00 1px solid">Save<i class="el-icon-download el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-row style="margin-top: 20px;margin-left: 10px">
            <el-tabs v-model="activeName">
                <el-tab-pane label="Header" name="header">
                    <el-row style="margin-left: 0px">
                        <el-table :data="headerInput" border stripe  highlight-current-row
                                  style="width: 100%;">
                            <el-table-column prop="name" label="Key">
                                <template slot-scope="scope">
                                    <el-input  v-model="scope.row.name" placeholder="key" v-on:focus="addInput">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="Value">
                                <template slot-scope="scope">
                                    <el-input  v-model="scope.row.value" placeholder="value"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="">
                                <el-button type="danger" v-show="headerInput.length > 1" @click="delRow" icon="el-icon-delete" plain></el-button>

                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="Body" name="body" :disabled="request_way === '1'">
                    <el-row style="margin-left: 0px">
                        <el-tabs v-model="paramActiveName">
                            <el-tab-pane label="JSON" name="json">
                                <el-input
                                        style="margin-left: -5px;border-radius: 5px;"
                                        type="textarea"
                                        :autosize="{ minRows: 10, maxRows: 6}"
                                        placeholder="请输入json参数"
                                        v-model="jsonParam">
                                </el-input>

                            </el-tab-pane>
                            <el-tab-pane label="FORM DATA" name="form">
                                <el-table :data="paramInput" border stripe  highlight-current-row
                                          style="width: 100%;">
                                    <el-table-column prop="name" label="Key">
                                        <template slot-scope="scope">
                                            <el-input  v-model="scope.row.name" placeholder="key" v-on:focus="addParamInput">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="value" label="Value">
                                        <template slot-scope="scope">
                                            <el-input  v-model="scope.row.value" placeholder="value"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="">
                                        <el-button type="danger" v-show="paramInput.length > 1" @click="delParamRow" icon="el-icon-delete" plain></el-button>

                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>

                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'InterfaceContent',
        data(){
            return{
                url:'',
                request_way:'',
                isShowBody:false,
                activeName:'header',
                paramActiveName:'form',
                jsonParam:'',
                headerInput:[{
                    name:'',
                    value:''
                }],
                paramInput:[{
                    name:'',
                    value:''
                }]
            }
        },
        methods:{
            handleHeaderAdd(){},
            handleHeadereDel(index){},
            clearHeader(){},
            addInput(){
                this.headerInput.push({
                    name: '',
                    value: ''
                });
            },
            addParamInput(){
                this.paramInput.push({
                    name: '',
                    value: ''
                });
            },
            delRow(index){
                this.headerInput.splice(index, 1)
            },
            delParamRow(index){
                this.paramInput.splice(index, 1)
            }
        }
    };
</script>

<style scoped>
.input-with-select{
    height: 42px;
    background-color: rgba(1,1,1,0.1);
}
</style>
