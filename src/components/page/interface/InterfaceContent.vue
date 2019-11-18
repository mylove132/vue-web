<template>
    <div>
        <el-row>
            <el-col :span="16">
                <el-input v-model="url" class="input-with-select" style="width: 95%;height:42px;border-radius: 5px;margin-left:10px;">
                    <el-select v-model="request_way" slot="prepend" style="width: 120px" placeholder="请选择">
                        <el-option label="GET" value="1"></el-option>
                        <el-option label="POST" value="2"></el-option>
                        <el-option label="DELETE" value="3"></el-option>
                    </el-select>
                </el-input>
            </el-col>
            <el-col :span="2">
                <el-button style="background-color: #097bed;margin-left:6px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;">Send</el-button>
            </el-col>
            <el-col :span="2">
                <el-button style="background-color: #f47023;margin-left:3px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;border: #ff4b00 1px solid">Save<i class="el-icon-download el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-row style="margin-left: 20px">

            <el-table :data="headerInput" border stripe style="width: 100%;">
                <el-table-column prop="name" label="Key">
                    <template slot-scope="scope">
                        <el-input  v-model="scope.row.name" placeholder="key"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="value" label="Value">
                    <template slot-scope="scope">
                        <el-input  v-model="scope.row.value" placeholder="value"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                </el-table-column>
            </el-table>
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
                headerInput:[{
                    name:'',
                    value:''
                },
                    {
                        name:'',
                        value:''
                    }]
            }
        },
        methods:{
            handleHeaderAdd(){},
            handleHeadereDel(index){},
            clearHeader(){},
            handleAdd(){
                this.formInput.push({
                    name: 'zsss',
                    value: 'sssz'
                });
            },
        }
    };
</script>

<style scoped>
.input-with-select{
    height: 42px;
    background-color: rgba(1,1,1,0.1);
}
</style>
