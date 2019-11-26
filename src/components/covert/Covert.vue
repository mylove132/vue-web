<template>
    <div id="covert" style="height: 100vh;background: #f4f4f4">
        <el-row style="margin-left: 20px;height: 30px;">
       Language：<el-select v-model="value" placeholder="请选择" @change="covertLanguage">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        </el-row>
        <el-dialog title="展示代码" :visible.sync="dialogTableVisible" center :append-to-body='true' :lock-scroll="false" width="50%" style="">
            <div>
                <el-button

                        type="primary"
                        style="float: right;margin-bottom: 5px"
                        v-clipboard:copy="code"
                        v-clipboard:success="copySuccess"
                        v-clipboard:error="copyError">Copy</el-button>
            </div>
            <div style="clear:both">
                <pre v-highlight><code v-html="code" class="java"></code></pre>
            </div>
        </el-dialog>
        <el-row style="margin-top: 50px">
            <div @click="test">
                <pre v-highlight><code v-html="code" class="java"></code></pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    import swal from 'sweetalert2'
    export default {
        name: 'Covert',
        data(){
            return{
                options: [{
                    value: '1',
                    label: 'Curl'
                }],
                dialogTableVisible:false,
                value: '',
                content:'',
                code:"package com.blingabc.auto.controller;\n" +
                    "\n" +
                    "import com.blingabc.auto.beans.CatalogVO;\n" +
                    "import com.blingabc.auto.common.ResultBody;\n" +
                    "import com.blingabc.auto.dao.CatalogVOMapper;\n" +
                    "import com.blingabc.auto.service.ICatalogService;\n" +
                    "import org.springframework.beans.factory.annotation.Autowired;\n" +
                    "import org.springframework.web.bind.annotation.*;\n" +
                    "\n" +
                    "@RequestMapping(\"/api/catalog\")\n" +
                    "@RestController\n" +
                    "public class CatalogCrontroller {\n" +
                    "\n" +
                    "    @Autowired\n" +
                    "    private ICatalogService catalogService;\n" +
                    "\n" +
                    "    @RequestMapping(value = \"\",method = RequestMethod.GET)\n" +
                    "    public ResultBody getCatalogListCrontroller(String type, int userId, @RequestParam(value = \"envId\",defaultValue = \"1\") int envId){\n" +
                    "        return ResultBody.success(catalogService.queryCatalogListService(type,userId, envId));\n" +
                    "    }\n" +
                    "\n" +
                    "    @RequestMapping(value = \"\", method = RequestMethod.PUT)\n" +
                    "    public ResultBody updateCatalogCrontroller(CatalogVO catalogVO){\n" +
                    "        return catalogService.updateCatalogService(catalogVO);\n" +
                    "    }\n" +
                    "\n" +
                    "    @RequestMapping(value = \"\", method = RequestMethod.POST)\n" +
                    "    public ResultBody addCatalogCrontroller(CatalogVO catalogVO){\n" +
                    "        return catalogService.addCatalogService(catalogVO);\n" +
                    "    }\n" +
                    "\n" +
                    "    @RequestMapping(value = \"{catalogId}\", method = RequestMethod.DELETE)\n" +
                    "    public ResultBody delCatalogCrontroller(@PathVariable(\"catalogId\") int catalogId){\n" +
                    "        return catalogService.delCatalogService(catalogId);\n" +
                    "    }\n" +
                    "}\n"
            }
        },
        methods:{
            covertLanguage(){

            },
            test(){
                this.dialogTableVisible = true;
            },
            copySuccess(){
                this.$notify({
                    title: 'Copy成功',
                    message: '',
                    type: 'success'
                });
            },
            copyError(){
                this.$notify.error({
                    title: 'Copy失败',
                    message: ''
                });
            }
        }
    };
</script>

<style scoped>

</style>