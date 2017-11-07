<template>
    <div class="start_project">
        <Form :model="projectMsg" :label-width="80" ref="projectMsg" :rules="ruleValidate">
            <FormItem label="项目名称" prop="name">
                <Input v-model="projectMsg.name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="立项日期">
                <Row>
                    <Col span="11">
                    <FormItem prop="createdate">
                        <DatePicker type="date" placeholder="选择日期" v-model="projectMsg.createdate"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">项目类型</Col>
                    <Col span="11">
                    <FormItem label="" prop="projecttype">
                        <Input v-model="projectMsg.projecttype" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="负责人">
                <Row>
                    <Col span="11">
                    <FormItem prop="leader">
                        <Input v-model="projectMsg.leader" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">执行人</Col>
                    <Col span="11">
                    <FormItem label="" prop="executor">
                        <Input v-model="projectMsg.executor" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="重要度">
                <Row>
                    <Col span="11">
                    <FormItem prop="importantlevel">
                        <Select v-model="projectMsg.importantlevel" placeholder="请选择">
                            <Option value="1">重要</Option>
                            <Option value="2">中等</Option>
                            <Option value="3">不重要</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">优先度</Col>
                    <Col span="11">
                    <FormItem label="" prop="prioritylevel">
                        <Select v-model="projectMsg.prioritylevel" placeholder="请选择">
                            <Option value="1">紧急</Option>
                            <Option value="2">中等</Option>
                            <Option value="3">不紧急</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="项目预算" prop="budget">
                <Input v-model="projectMsg.budget" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="计划开始">
                <Row>
                    <Col span="11">
                    <FormItem prop="planstartdate">
                        <DatePicker type="date" placeholder="选择日期" v-model="projectMsg.planstartdate"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">计划结束</Col>
                    <Col span="11">
                    <FormItem label="" prop="planenddate">
                        <DatePicker type="date" placeholder="选择日期" v-model="projectMsg.planenddate"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="实际开始">
                <Row>
                    <Col span="11">
                    <FormItem prop="realstartdate">
                        <DatePicker type="date" placeholder="选择日期" v-model="projectMsg.realstartdate"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">实际结束</Col>
                    <Col span="11">
                    <FormItem label="" prop="realenddate">
                        <DatePicker type="date" placeholder="选择日期" v-model="projectMsg.realenddate"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('projectMsg')">提交</Button>
                <Button type="ghost" @click="handleReset('projectMsg')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import Vue from 'vue'
import { dispatch } from '../../../utils/skipUtils'
import { default as fetch, post } from '../../../utils/DefineFetcher'
export default {
    data() {
        return {
            projectMsg: {
                'name': '',
                'createdate': '',
                'leader': '',
                'importantlevel': '',
                'prioritylevel': '',
                'executor': '',
                'budget': '',
                'planstartdate': '',
                'planenddate': '',
                'realstartdate': '',
                'realenddate': '',
                'projecttype': '',

            },
            ruleValidate: {
                name: [
                    { required: true, message: '项目名称不能为空', trigger: 'blur' }
                ],
                createdate: [
                    { required: true, type: 'date', message: '请选择立项时间', trigger: 'blur' }
                ],
                leader: [
                    { required: true,  message: '请输入负责人', trigger: 'blur' }
                ],
                // importantlevel: [
                //     { required: true,  message: '请选择重要度', trigger: 'blur' }
                // ],
                // prioritylevel: [
                //     { required: true, message: '请选择优先度', trigger: 'blur' }
                // ],
                projecttype:[
                    { required: true, message: '请输入项目类型', trigger: 'blur' }
                ],
                executor:[
                    { required: true,  message: '请输入执行人', trigger: 'blur' }
                ],
                budget:[
                    { required: true,  message: '请输入预算', trigger: 'blur' }
                ],
                // planstartdate:[
                //     { required: true, type: 'date', message: '请选择计划开始时间', trigger: 'blur' }
                // ],
                // planenddate:[
                //     { required: true, type: 'date', message: '请选择计划结束时间', trigger: 'blur' }
                // ],
                // realenddate:[
                //     { required: true, type: 'date', message: '请选择实际开始时间', trigger: 'blur' }
                // ],
                // realstartdate: [
                //     { required: true, type: 'date', message: '请选择实际结束时间', trigger: 'blur' }
                // ],
            }
        }
    },
    computed: {
        iconSize() {}
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this._startProject()
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        _startProject() {
            let createdate = (new Date(this.projectMsg.createdate)).getTime()
            this.projectMsg.createdate = createdate
            let planstartdate = (new Date(this.projectMsg.planstartdate)).getTime()
            this.projectMsg.planstartdate = planstartdate
            let planenddate = (new Date(this.projectMsg.planenddate)).getTime()
            this.projectMsg.planenddate = planenddate
            let realstartdate = (new Date(this.projectMsg.realstartdate)).getTime()
            this.projectMsg.realstartdate = realstartdate
            let realenddate = (new Date(this.projectMsg.realenddate)).getTime()
            this.projectMsg.realenddate = realenddate
            console.log(this.projectMsg)
            let url = "/api/aoengine/project"
            let data = this.projectMsg
            post(url, data, (status, res) => {
                if (status) {
                    this.$Message.error("数据 保存失败")
                } else {
                    this.$Message.info("数据保存成功")
                    this.cleanData('projectMsg')
                }
            })
        },
        cleanData(dataName) {
            for (let key in this[dataName]) {
                if (typeof this[dataName][key] === 'object') {
                    this.$set(this[dataName], key, []);
                } else {
                    this.$set(this[dataName], key, '');
                }
            }
            // 清除验证状态
            this.$refs[dataName].resetFields();
        },
    },

}
</script>
<style scoped>
.start_project {
    padding: 20px 20px;
}
</style>