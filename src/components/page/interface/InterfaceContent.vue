<template>
    <div style="overflow-y: auto">
        <el-row>
            <el-col :span="16">
                <el-input v-model="url" size="medium" class="input-with-select"
                          style="width: 95%;height:42px;border-radius: 5px;margin-left:8px;">
                    <el-select v-model="request_way_id" id="requestWay" slot="prepend" style="width: 120px"
                               placeholder="请选择">
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
                        v-loading.fullscreen.lock="loadRunTest"
                        @click="runTest">Send
                </el-button>
            </el-col>
            <el-col :span="2">
            <el-button
                    style="background-color: #f47023;margin-left:16px;color: white;margin-top: 3px;width: 80px;height:38px;border-radius: 5px;border: #ff4b00 1px solid"
                    @click="save">Save<i class="el-icon-download el-icon--right"></i></el-button>
        </el-col>
            <el-dialog title="接口保存" :visible.sync="dialogTableVisible" center :append-to-body='true' :lock-scroll="false" width="30%" style="">
                <save-collection v-bind:saveData="saveObj" @saveCatalogResult="getChildSaveResult"></save-collection>
            </el-dialog>
        </el-row>
        <el-row style="margin-top: 20px;margin-left: 10px">
            <el-tabs v-model="activeName">
                <el-tab-pane label="Header" name="header">
                    <el-row style="margin-left: 0px">
                        <el-table :data="headerInput" border stripe highlight-current-row
                                  style="width: 100%;">
                            <el-table-column prop="name" label="Key">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name" placeholder="key" v-on:blur="addInput(scope)">
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
                <el-tab-pane label="Body" name="body" :disabled="request_way_id === 1 || request_way_id == ''">
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
                                <el-button type="primary" v-if="isform" round style="float: right;margin-right: 10px;margin-bottom: 5px" @click="isform=false">Buld Edit</el-button>
                                <el-button type="success" v-else="isform" @click="covertFanc" round style="float: right;margin-right: 10px;margin-bottom: 5px">Key-Value Edit</el-button>
                                <el-table :data="paramInput" border stripe highlight-current-row
                                          v-if="isform"
                                          style="width: 100%;">
                                    <el-table-column prop="name" label="Key">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.name" placeholder="key"
                                                      v-on:blur="addParamInput(scope)">
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
                                <el-input
                                        type="textarea"
                                        :rows="13"
                                        placeholder="请输入内容"
                                        v-else="isform"
                                        v-model="covertParam">
                                </el-input>
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
    import SaveCollection from '../collections/SaveCollection';

    export default {
        name: 'InterfaceContent',
        components: { SaveCollection },
        data() {
            return {
                isform:true,
                covertParam:'',
                url: '',
                request_way: [],
                request_way_id: '',
                isShowBody: false,
                activeName: 'header',
                paramActiveName: 'form',
                dialogTableVisible:false,
                jsonParam: '',
                loadRunTest:false,
                headerInput: [{
                    name: '',
                    value: ''
                }],
                paramInput: [{
                    name: '',
                    value: ''
                }],
                saveObj:{}
            };
        },
        props: [
        ],
        created() {
            this.$fetch(this.$api.request_way_url).then(
                response => {
                    this.request_way = response.result;
                }
            );
        },
        methods: {
            covertFanc(){
                this.paramInput = this.covertParam.split('\n').map(v=>{ let arr = v.match(/([^:\s]+):\s?(.*)/i); return { name: arr[1], value: arr[2]}});
                this.isform = false;
            },
            getChildSaveResult(data){
                this.dialogTableVisible = !data;
            },
            addInput(scope) {
                console.log(scope);
                if (scope.row.name != '') {
                    this.headerInput.push({
                        name: '',
                        value: ''
                    });
                }
            },
            addParamInput(scope) {
                if (scope.row.name != '') {
                    this.paramInput.push({
                        name: '',
                        value: ''
                    });
                }

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
                }
                let paramType = null;
                if ($('#requestWay').val() == 'get') {
                    paramType = null;
                } else {
                    paramType = this.paramActiveName == 'json' ? 'json' : 'form';
                }
                let headerObj = {};
                this.headerInput.map(function(e, item) {
                    if (e.name != '' && e.name != null) {
                        headerObj[e.name] = e.value;
                    }

                });
                let paramObj = {};
                if (this.request_way_id == 1 || this.request_way_id == '') {
                    paramObj = null;
                } else {
                    this.paramInput.map(function(e, item) {
                        if (e.name != '' && e.name != null) {
                            paramObj[e.name] = e.value;
                        }
                    });
                }
                let par = '';
                if (paramType == 'json'){
                    par = this.jsonParam;
                }else {
                    par = JSON.stringify(paramObj);
                }
                this.loadRunTest = true;
                this.$post(this.$api.run_interface_url, this.qs.stringify({
                    url: this.url,
                    header: JSON.stringify(headerObj),
                    param: par,
                    requestWay: $('#requestWay').val(),
                    paramType: paramType
                })).then(
                    response => {
                        this.loadRunTest = false;
                        if (typeof (response.result.result) == 'string') {
                            try {
                                let res = JSON.parse(response.result.result);
                                this.$emit('getChildResult', res);
                            } catch (e) {
                                this.$emit('getChildResult', response.result);
                            }
                        }

                    }
                );
            },
            save() {
                if (this.url == ''){
                    swal({
                            position: 'center',
                            type: 'warning',
                            title: 'url不能为空',
                            showConfirmButton: false,
                            timer: 1500
                        }
                    );
                    return;
                }else {
                    this.saveObj.url = this.url;
                }
                let paramType = null;
                if ($('#requestWay').val() == 'get') {
                    paramType = null;
                } else {
                    paramType = this.paramActiveName == 'json' ? 'json' : 'form';
                }
                this.saveObj.paramType = paramType;

                let headerObj = {};
                this.headerInput.map(function(e, item) {
                    if (e.name != '' && e.name != null) {
                        headerObj[e.name] = e.value;
                    }

                });
                this.saveObj.header = JSON.stringify(headerObj);

                let paramObj = {};
                if (this.request_way_id == 1 || this.request_way_id == '') {
                    paramObj = null;
                } else {
                    this.paramInput.map(function(e, item) {
                        if (e.name != '' && e.name != null) {
                            paramObj[e.name] = e.value;
                        }
                    });
                }
                let par = '';
                if (paramType == 'json'){
                    par = this.jsonParam;
                }else {
                    par = JSON.stringify(paramObj);
                }
                this.saveObj.param = par;
                this.dialogTableVisible = true;
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
