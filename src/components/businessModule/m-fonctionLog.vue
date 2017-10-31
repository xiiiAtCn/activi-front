<template>
    <div class="function_log">
        <div class="head">
            <div class="m logo">
                <div class="l">
                    <img src="../../assets/img/yushi-logo.png">
                </div>
                <div class='l'>
                    <span> | </span>
                    <h2>一站式管理系统</h2>
                </div>
                <div class="r">
                    <a href="javascript:window.close()" class="close">关闭</a>
                </div>
            </div>
        </div>
        <div class="m main">
            <div style="text-align: center;padding:30px 0">
                <h1 style="color:#107bed;font-size:30px;">Toptimus 功能日志</h1>
            </div>
            <div class="main_con">
                <div class="main_item" v-for="item in returnData">
                    <div class="con_time">
                        <span class="year">{{item.year}}</span>
                        <div class="yearLineTwo" v-if="item.year===''"></div>
                        <div class="year_line" v-else></div>
                        <span class="circle"></span>
                    </div>
                    <div class="con_item" v-for="val in item.data">
                        <div class="l month">
                            <span class="month_item">{{val.month}}.{{val.day}}</span>
                            <span class="update">已更新</span>
                        </div>
                        <div class="l line"></div>
                        <div class="l contain" @click="detailCon(item)">
                            <h3>{{val.title}}</h3>
                            <p v-for="kid in val.con">{{kid}}</p>
                        </div>
                        <!--  <span v-if="item.showFlag" ><Icon class="l target" style="color:#107bed" type="chevron-down"></Icon></span>
                        <span v-else><Icon class="l target" type="chevron-right"></Icon></span> -->
                        <div style="clear:both;"></div>
                        <div class="main_contain" v-if="item.showFlag" v-for="leafItem in val.leaf_contain">
                            <div class="row_line"></div>
                            <h5 style="margin-top:20px;">{{leafItem.leaf_title}}</h5>
                            <p>{{leafItem.leaf_con}}</p>
                            <Card style="margin-top:10px;">
                                <img style="width:100%;height:100%" :src="leafItem.img" />
                            </Card>
                        </div>
                    </div>
                    <div style="clear:both"></div>
                </div>
            </div>
        </div>
        <!-- <div class="bottom">
        </div> -->
    </div>
</template>
<script>
import { dispatch } from '../../utils/skipUtils'
export default {
    data() {
        return {
            yearLineStyle: false,
            returnData: []
        }
    },
    computed: {

    },
    methods: {
        changetitle() {
            document.title = '功能日志'
        },
        detailCon(val) {
            val.showFlag = !val.showFlag
        },
    },
    mounted() {
        this.changetitle();
        let data = [{
            showFlag: false,
            'year': '2017',
            'data': [{
                'month': '10',
                'day': '21',
                'title': '新增功能点',
                'con': {
                    "0": '1. 全局：主菜单优化/单据栅格布局',
                    "1": '2. 项目管理：项目空间优化/新建项目/项目概览',
                    "2": '3. 视图信息：管理工作中心/AO详细菜单选项&布局/部门人员/BO视图'
                },
                'leaf_contain': []
            }]
        }]
        this.returnData = data
    }
}
</script>

<style scoped>
html,
body {
    height: 100%;
    margin: 0;
    padding: 0;

}

.m {
    width: 1200px;
    margin: 0 auto;
}

.l {
    float: left;
    height: 100%;
}

.r {
    float: right;
}

.function_log {
    width: 114%;
    background: #F4F5F9;
    background: url('../../assets/img/cloud_bottom.png') no-repeat bottom #f4f5f9;
    background-size: contain;
}

.head {
    height: 60px;
    line-height: 60px;
    border-bottom: 2px solid #2276dc;
    background: #FCFDFD;
    z-index: 5;
    top: 0;
}

.logo {
    height: 100%
}

.logo img {
    height: 60px;
    display: inline-block;
}

.logo span {
    font-size: 24px;
    display: inline-block;
    margin: 0 10px;
}

.logo h2 {
    display: inline-block;
    left: 125px;
    color: #abb1ba
}

.r button {
    margin: 0 10px;
}

.main {
    height: 100%;
    position: relative;
    background: rgba(252,253,253,0.5);
    /*overflow: auto;*/
    height:910px;
    padding-bottom: 40px;


}

.main_con {
    width: 100%;
    /*  height: 130px;*/
    padding: 0 20px;
}

.con_time {
    float: left;
    width: 5%;
    height: 100%;
    text-align: center;
}

.main_item {
    width: 100%;
    padding: 0 20px;

}

.con_item {
    width: 92%;
    min-height: 100px;
    float: right;
    margin-top: 30px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.06);
    padding: 10px 10px;
    cursor: pointer;
    background: #fff;
}

.line {
    width: 2px;
    height: 60px;
    background: #ccc;
    margin-top: 10px;
}

.month {
    width: 10%;
    text-align: center;
    padding-top: 15px;
}

.month_item {
    display: block;
    color: #107bed;
    font-size: 20px;
}

.update {
    display: block;
    font-size: 12px;
    color: #107bed;
}

.contain {
    width: 70%;
    height: 100%;
    margin: 0 30px;
}

.contain h3 {
    padding-bottom: 10px;
}

.target {
    font-size: 36px;
    color: #ccc;
    padding-top: 20px;
    padding-left: 30px;
}

.year {
    display: block;
    color: #107bed;
    font-size: 16px;
}

.yearLineTwo {
    width: 2px;
    height: 70px;
    background: #107bed;
    margin: 0 auto;
}

.year_line {
    width: 2px;
    height: 40px;
    background: #107bed;
    margin: 0 auto;
}

.circle {
    display: block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #107bed;
    margin: 0 auto;
    margin-top: 5px;
}

.main_contain {
    margin-top: 20px;
    width: 100%;
    height: 100%;
    padding: 10px 40px;
}

.row_line {
    width: 100%;
    height: 1px;
    background: #ccc
}
.close{
   display: inline-block;
   width:60px;
   height:30px;
   line-height:33px;
   text-align: center;
   background:#2d8cf0;
   border-radius:4px;
   color:#fff;
   margin-right:20px;
}
</style>
