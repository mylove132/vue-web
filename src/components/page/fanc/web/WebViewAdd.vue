<template>
    <div style="background: white">
        <el-row>
            <el-col :span="5" style="height: 100vh;background: #f4f4f4;margin-left: 5px;box-shadow: 2px 0 5px -1px #cccccc;">
                <el-tabs v-model="activeName" type="card" style="background-color: #f4f4f4;height: 100vh;">
                    <el-tab-pane label="History" name="history">
                    </el-tab-pane>
                    <el-tab-pane label="Collections" name="collections">
                        <InterfacePage></InterfacePage>
                    </el-tab-pane>
                    <el-tab-pane label="Task" name="task"></el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="6" style="margin-left: 10px">
                <AddInterface></AddInterface>
            </el-col>
            <el-col :span="8">

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import swal from 'sweetalert2';
    import InterfacePage from '@/components/page/collections/Interface_Page'
    import AddInterface from '@/components/page/interface/AddInterface'
    export default {
        name: 'webauto',
        data() {
            return {
                activeName:'collections'
            };
        },
        components:{
            InterfacePage,
            AddInterface
        }
    };
</script>

<style scoped>

</style>
