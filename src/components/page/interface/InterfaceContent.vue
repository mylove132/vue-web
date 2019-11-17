<template>
    <div>
        <el-row>
            <el-col :span="16">
                <el-input v-model="url" class="input-with-select" style="width: 90%;border: #f47023 1px solid;border-radius: 5px;margin-left:10px;">
                    <el-select v-model="request_way" slot="prepend" style="width: 120px" placeholder="请选择">
                        <el-option label="餐厅名" value="1"></el-option>
                        <el-option label="订单号" value="2"></el-option>
                        <el-option label="用户电话" value="3"></el-option>
                    </el-select>
                </el-input>
            </el-col>
            <el-col :span="2">
                <el-button style="background-color: #097bed;margin-left:10px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;">Send</el-button>
            </el-col>
            <el-col :span="2">
                <el-button style="background-color: #f47023;margin-left:40px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;border: #ff4b00 1px solid">Save</el-button>
            </el-col>
        </el-row>
        <el-row style="margin-left: 20px">
            <HeaderView></HeaderView>
        </el-row>
    </div>
</template>

<script>
    import HeaderView from '@/components/page/interface/HeaderView'
    export default {
        name: 'InterfaceContent',
        data(){
            return{
                url:'',
                request_way:''
            }
        },components:{
            HeaderView
        }
    };
</script>

<style scoped>

</style>
