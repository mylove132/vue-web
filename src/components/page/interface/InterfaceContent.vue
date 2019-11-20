<template>
    <div style="height: 50vh;overflow-y: auto">
        <el-row>
            <el-col :span="16">
                <el-input v-model="url" size="medium" class="input-with-select"
                          style="width: 95%;height:42px;border-radius: 5px;margin-left:8px;">
                    <el-select v-model="request_way_id" id="requestWay" slot="prepend" style="width: 120px" placeholder="请选择">
                        <el-option
                                v-for="item in request_way"
                                :key="item.id"
                                :label="item.way"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-input>
            </el-col>
            <el-col :span="2">
                <el-button
                        style="background-color: #097bed;margin-left:2px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;"
                        @click="runTest">Send
                </el-button>
            </el-col>
            <el-col :span="2">
                <el-button
                        style="background-color: #f47023;margin-left:16px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;border: #ff4b00 1px solid"
                        @click="save">Save<i class="el-icon-download el-icon--right"></i></el-button>
            </el-col>
        </el-row>
        <el-row style="margin-top: 20px;margin-left: 10px">
            <el-tabs v-model="activeName">
                <el-tab-pane label="Header" name="header">
                    <el-row style="margin-left: 0px">
                        <el-table :data="headerInput" border stripe highlight-current-row
                                  style="width: 100%;">
                            <el-table-column prop="name" label="Key">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name" placeholder="key" v-on:focus="addInput">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="Value">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.value" placeholder="value"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="">
                                <template scope="scope">
                                    <el-button
                                            v-show="headerInput.length > 1"
                                            type="danger"
                                            plain
                                            icon="el-icon-delete"
                                            @click.native.prevent="delRow(scope.$index, headerInput)"
                                            size="small">
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="Body" name="body" :disabled="request_way_id === 1">
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
                            <el-tab-pane label="FORM-DATA" name="form">
                                <el-table :data="paramInput" border stripe highlight-current-row
                                          style="width: 100%;">
                                    <el-table-column prop="name" label="Key">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.name" placeholder="key"
                                                      v-on:focus="addParamInput">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="value" label="Value">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.value" placeholder="value"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="">
                                        <template scope="scope">
                                            <el-button
                                                    v-show="paramInput.length > 1"
                                                    type="danger"
                                                    plain
                                                    icon="el-icon-delete"
                                                    @click.native.prevent="delRow(scope.$index, paramInput)"
                                                    size="small">
                                            </el-button>
                                        </template>
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
    import swal from 'sweetalert2';

    export default {
        name: 'InterfaceContent',
        data() {
            return {
                url: '',
                request_way: [],
                request_way_id: '',
                isShowBody: false,
                activeName: 'header',
                paramActiveName: 'form',
                jsonParam: '',
                headerInput: [{
                    name: '',
                    value: ''
                }],
                paramInput: [{
                    name: '',
                    value: ''
                }]
            };
        },
        props: {},
        created() {
            this.$fetch(this.$api.request_way_url).then(
                response => {
                    this.request_way = response.result;
                }
            );
        },
        methods: {
            handleHeaderAdd() {
            },
            handleHeadereDel(index) {
            },
            clearHeader() {
            },
            addInput() {
                this.headerInput.push({
                    name: '',
                    value: ''
                });
            },
            addParamInput() {
                this.paramInput.push({
                    name: '',
                    value: ''
                });
            },
            delRow(index, rows) {
                rows.splice(index, 1);
            },
            runTest() {
                if (this.url == null || this.url == '') {
                    swal({
                            position: 'center',
                            type: 'warning',
                            title: 'url不能为空',
                            showConfirmButton: false,
                            timer: 1500
                        }
                    );
                    return;
                } else {
                    let jy = this.fIsUrL(this.url);
                    if (!jy) {
                        swal({
                                position: 'center',
                                type: 'warning',
                                title: 'url格式不正常',
                                showConfirmButton: false,
                                timer: 1500
                            }
                        );
                        return;
                    }
                }
                let headerObj = {};
                this.headerInput.map(function(e,item) {
                    if (e.name != "" && e.name != null){
                        headerObj[e.name] = e.value;
                    }

                });
                let paramObj = {};
                this.paramInput.map(function(e,item) {
                    if (e.name != "" && e.name != null){
                        paramObj[e.name] = e.value;
                    }

                });
                this.$post(this.$api.run_interface_url, this.qs.stringify({
                    url: this.url,
                    header: JSON.stringify(headerObj),
                    param: paramObj,
                    requestWay: $("#requestWay").val(),
                    paramType: 'form'
                })).then(
                    response => {
                        this.$emit('getChildResult', response.result);
                    }
                ).catch(
                    err => {
                        console.log('运行接口失败:' + err.message);
                        swal({
                                position: 'top-end',
                                type: 'error',
                                title: '请求失败',
                                showConfirmButton: false,
                                timer: 1500
                            }
                        );
                    }
                );
            },
            save() {
            },
            fIsUrL(str_url) {
                var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
                    + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
                    + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
                    + '|' // 允许IP和DOMAIN（域名）
                    + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
                    + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
                    + '[a-z]{2,6})' // first level domain- .com or .museum
                    + '(:[0-9]{1,4})?' // 端口- :80
                    + '((/?)|' // a slash isn't required if there is no file name
                    + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
                var re = new RegExp(strRegex);
                if (re.test(str_url)) {
                    return (true);
                } else {
                    return (false);
                }
            }
        }
    };
</script>

<style scoped>
    .input-with-select {
        height: 42px;
        background-color: rgba(1, 1, 1, 0.1);
    }
</style>
