<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="接口名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="环境" prop="env">
                <el-select v-model="ruleForm.env" placeholder="请选择环境" @change="selectEnv">
                    <el-option v-for="item in envList" :label="item.env" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择目录" prop="catalog">
                    <el-cascader  v-model="ruleForm.catalog" :options="catalogList"
                                  :props="{ checkStrictly: true,value:'id',label:'text' }" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="断言" prop="assert">
                <el-row>
                    <el-col :span="10">
                        <el-select v-model="ruleForm.assert" placeholder="请选择断言类型" @change="selectAssert">
                            <el-option v-for="item in assertTypeList" :label="item.type" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        <el-input v-model="ruleForm.assert_name" v-show="ruleForm.assert > 0" style="margin-left: -6px" placeholder="请输入断言名称"></el-input>
                    </el-col>
                    <el-col :span="7">
                        <el-input v-model="ruleForm.assert_val" v-show="ruleForm.assert > 0" style="margin-left: 5px" placeholder="请输入断言内容"></el-input>
                    </el-col>
                </el-row>


            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import swal from 'sweetalert2';
    export default {
        name: 'SaveCollection',
        data(){
            return{
                saveResult:false,
                catalogList:[],
                assertTypeList:[],
                envList:[],
                ruleForm:{
                    name:'',
                    env:'',
                    catalog:'',
                    assert:'',
                    assert_name:'',
                    assert_val:''
                },
                rules:{
                    name: [
                        { required: true, message: '请输入接口名称', trigger: 'blur' }
                    ],
                    env: [
                        { required: true, message: '请选择环境', trigger: 'change' }
                    ],
                    catalog: [
                        { required: true, message: '请选择保存目录', trigger: 'change' }
                    ],
                    assert: [
                        { required: true, message: '请选择断言类型', trigger: 'change' }
                    ],
                    assert_name: [
                        { required: true, message: '请输入断言名称', trigger: 'blur' }
                    ],
                    assert_val: [
                        { required: true, message: '请输入断言内容', trigger: 'blur' }
                    ],
                }
            }
        },
        created(){
            this.$fetch(this.$api.env_url).then(
                response => {
                    if (response.code == 0){
                        this.envList = response.result;
                    }else {
                        alert("获取环境目录失败")
                    }
                }
            );
            this.$fetch(this.$api.assert_type_url).then(
                response => {
                    if (response.code == 0){
                        this.assertTypeList = response.result;
                    }else {
                        alert("获取环境目录失败")
                    }
                }
            )
        },
        props:{
            saveData:{}
        },
        methods:{
            selectAssert(val){

            },
            selectEnv(){
                this.$fetch(this.$api.catalogUrl+"?type=interface&userId=1&envId="+this.ruleForm.env).then(
                    response => {
                        if (response.code == 0){
                            this.catalogList = response.result;
                        }
                    }
                )
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let catalogId = null;
                        if (this.ruleForm.catalog.length == 1){
                            catalogId = this.ruleForm.catalog[0];
                        }else {
                            let index = this.ruleForm.catalog.length;
                            catalogId = this.ruleForm.catalog[index-1];
                        }
                        const assertVO = {
                            name:this.ruleForm.assert_name,
                            assertTypeId:this.ruleForm.assert,
                            val:this.ruleForm.assert_val
                        }
                        this.$post(this.$api.interface_case_url,this.qs.stringify({
                            name:this.ruleForm.name,
                            url:this.saveData.url,
                            catalogId:catalogId,
                            paramType:this.saveData.paramType,
                            param:this.saveData.param,
                            requestWayId:this.saveData.requestWayId,
                            header:this.saveData.header,
                            assertObj:JSON.stringify(assertVO)
                        })).then(
                            response => {
                                if (response.code == 0){
                                    this.saveResult = true;
                                    swal({
                                            position: 'center',
                                            type: 'success',
                                            title: '保存成功',
                                            showConfirmButton: false,
                                            timer: 1500
                                        }
                                    );

                                    this.$emit('saveCatalogResult',this.saveResult);

                                }else {
                                    swal({
                                            position: 'center',
                                            type: 'error',
                                            title: '保存目录失败',
                                            showConfirmButton: false,
                                            timer: 1500
                                        }
                                    );
                                }
                            }
                        )
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    };
</script>

<style scoped>

</style>