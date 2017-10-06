<template lang="html">
  <Row>
    <Col span="4">
      <div id="iview-accordion-menu" class="iview-accordion-menu white">
        <div class="iview-accordion-menu-header" id="form">
          <form class="filterform" action="#"><Input class="filterinput" placeholder="输入名称查询设备"></Input></form>
    </div>
        <ul id="demo-list">

          <li :class="{'active':rootMenuActive==='1'}" @click="changeActive('1')"><router-link :class="{'submenu-indicator-minus':rootMenuExpanded==='1'}" to="/layoutContent/06/monitor/levelClassify/tabMapMonitor"><Icon type="waterdrop"></Icon>供水设备<span class="submenu-indicator"  @click="expendState('1')">+</span></router-link>
            <ul class="submenu" v-if="rootShowSubMenu">
              <li v-for="oneLevel in menuData" :class="{'active':subMenuActive===oneLevel.id}" @click.stop="changeActive(oneLevel.id)"><router-link :class="{'submenu-indicator-minus':menuExpanded['level1']===oneLevel.id}" to="/layoutContent/06/monitor/levelProvince">{{oneLevel.alias}}<span class="submenu-indicator"  @click="expendSubState(oneLevel.id, 1)">+</span></router-link>
                <ul class="submenu" v-if="showSubMenu['level1']===oneLevel.id">
                  <li v-for="twoLevel in oneLevel.nodes" :class="{'active':subMenuActive===twoLevel.id}" @click.stop="changeActive(twoLevel.id)"><router-link :class="{'submenu-indicator-minus':menuExpanded['level2']===twoLevel.id}" to="/layoutContent/06/monitor/levelDistrict">{{twoLevel.alias}}<span class="submenu-indicator"  @click="expendSubState(twoLevel.id, 2)">+</span></router-link>
                    <ul class="submenu" v-if="showSubMenu['level2']===twoLevel.id">
                      <li v-for="threeLevel in twoLevel.nodes" :class="{'active':subMenuActive===threeLevel.id}" @click.stop="changeActive(threeLevel.id)"><router-link :class="{'submenu-indicator-minus':menuExpanded['level3']===threeLevel.id}" to="/layoutContent/06/monitor/levelDistrict">{{threeLevel.alias}}<span class="submenu-indicator"  @click="expendSubState(threeLevel.id, 3)">+</span></router-link>
                        <ul class="submenu" v-if="showSubMenu['level3']===threeLevel.id">
                          <li v-for="fourLevel in threeLevel.nodes" :class="{'active':subMenuActive===fourLevel.id}" @click.stop="changeActive(fourLevel.id)"><router-link to="/layoutContent/06/monitor/levelCommunity">{{fourLevel.alias}}</router-link>
                            <span class="iview-accordion-menu-label">3</span>
                            <ul class="submenu">
                                <li v-for="fiveLevel in fourLevel.nodes" :class="{'active':subMenuActive===fiveLevel.id}" @click.stop="changeActive(fiveLevel.id)"><router-link :class="{'submenu-indicator-minus':menuExpanded['level5']===oneLevel.id}" :to="'/layoutContent/06/monitor/levelPump/tabProduceMonitor/'+fiveLevel.dataId">{{fiveLevel.alias}}</router-link></li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
<!--
              <li :class="{'active':subMenuActive=='3-1'}" @click.stop="changeActive('3-1')"><router-link to="/layoutContent/06/monitor/levelProvince">河北省</router-link></li>
              <li :class="{'active':subMenuActive=='3-2'}" @click.stop="changeActive('3-2')"><router-link to="/layoutContent/06/monitor/levelProvince">辽宁省</router-link></li>
              <li :class="{'active':subMenuActive=='3-3'}" @click.stop="changeActive('3-3')"><router-link to="/layoutContent/06/monitor/levelProvince">浙江省</router-link>
                <ul class="submenu">
                  <li :class="{'active':subMenuActive=='3-3-1'}" @click.stop="changeActive('3-3-1')"><router-link to="/layoutContent/06/monitor/levelCity">杭州市</router-link>
                    <ul class="submenu">
                      <li :class="{'active':subMenuActive=='3-3-1-1'}" @click.stop="changeActive('3-3-1-1')"><router-link to="/layoutContent/06/monitor/levelDistrict">上城区</router-link>
                        <ul class="submenu">
                          <li :class="{'active':subMenuActive=='3-3-1-1-1'}" @click.stop="changeActive('3-3-1-1-1')"><router-link to="/layoutContent/06/monitor/levelCommunity">万达小区</router-link></li>
                          <li :class="{'active':subMenuActive=='3-3-1-1-2'}" @click.stop="changeActive('3-3-1-1-2')"><router-link to="/layoutContent/06/monitor/levelCommunity">绿城小区</router-link>
                            <span class="iview-accordion-menu-label">3</span>
                            <ul class="submenu">
                              <li :class="{'active':subMenuActive=='3-3-1-1-2-1'}" @click.stop="changeActive('3-3-1-1-2-1')"><router-link to="/layoutContent/06/monitor/levelPump/tabProduceMonitor/59434f72397d0c5f3e9ebee8">供水机组一</router-link></li>
                              <li :class="{'active':subMenuActive=='3-3-1-1-2-2'}" @click.stop="changeActive('3-3-1-1-2-2')"><router-link to="/layoutContent/06/monitor/levelPump/tabProduceMonitor/5943515e397d0c5f3e9ebefe">供水机组二</router-link></li>
                              <li :class="{'active':subMenuActive=='3-3-1-1-2-3'}" @click.stop="changeActive('3-3-1-1-2-3')"><router-link to="/layoutContent/06/monitor/levelPump/tabProduceMonitor/59435041397d0c5f3e9ebef5">供水机组三</router-link></li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li><router-link to="/layoutContent/06/monitor/levelDistrict">下城区</router-link></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li :class="{'active':subMenuActive=='3-4'}" @click.stop="changeActive('3-4')"><router-link to="/layoutContent/06/monitor/levelProvince">福建省</router-link></li>
-->
            </ul>
          </li>
          <li :class="{'active':rootMenuActive=='2'}" @click="changeActive('2')"><router-link to="/layoutContent/06/monitor/levelClassify/tabMapMonitor" ><Icon type="loop"></Icon>污水处理设备 </router-link>
          </li>
          <li :class="{'active':rootMenuActive=='3'}" @click="changeActive('3')"><router-link to="/layoutContent/06/monitor/levelClassify/tabMapMonitor"><Icon type="soup-can"></Icon>隔油设备</router-link>
            </li>
          </ul>
  </div>
    </Col>
    <Col span="20">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </Col>
  </Row>

</div>
</template>
<script>
//import Vue from 'vue'
//import VueResource from 'vue-resource'
//Vue.use(VueResource)
import $ from 'jquery'

export default {
    data:function() {
            return {
               show3menu:false,
                class3minus:'',

                rootMenuActive: '',
                subMenuActive: '',

                rootMenuExpanded:'',
                rootShowSubMenu: false,
                menuExpanded:{
                  level1:'',
                  level2:'',
                  level3:'',
                  level4:'',
                  level5:''
                },
                showSubMenu: {
                  level1:false,
                  level2:false,
                  level3:false,
                  level4:false,
                  level5:false
                },
                menuData:[]
            }
        },
        methods: {
            expendState:function(id){
              if(this.rootShowSubMenu){
                this.rootShowSubMenu = false
                this.rootMenuExpanded = ''
              }else{
                this.rootShowSubMenu = true
                this.rootMenuExpanded = id
              }
            },
            expendSubState:function(id, i){
              if(this.showSubMenu['level'+i]){
                this.showSubMenu['level'+i] = ''
                this.menuExpanded['level'+i] = ''
              }else{
                this.showSubMenu['level'+i] = id
                this.menuExpanded['level'+i] = id
              }
            },
            changeActive: function (id) {
                this.rootMenuActive = id
                this.subMenuActive = id
            },
           show3:function(){
              if(this.show3menu){
                this.show3menu=false
                this.class3minus=''
              }else{
                this.show3menu=true
                this.class3minus='submenu-indicator-minus'
              }
            }
        },
        mounted:function() {
          var params = {}
          axios.get('/api/monitor/boTree',{'params':params}).then(data =>{
            console.log(data.body)
            this.menuData = data.body.nodes
          },data =>{
            console.log('error')
          })
        }
}
</script>

<style lang="css" scoped>
body{
  overflow-x:hidden;
  overflow-y: scroll;
}
.filterinput{
  padding-right:22px;
	/*background-color:rgba(249, 244, 244, 0);*/
	/*border-radius:15px;
	width:90%;
	height:30px;
	border:thin solid #dddee1;
	text-indent:0.5em;*/
	/*font-weight:bold;*/
	/*color:#FFF;*/
}
#demo-list a{
	overflow:hidden;
	text-overflow:ellipsis;
	-o-text-overflow:ellipsis;
	white-space:nowrap;
	width:100%;
}
.iview-accordion-menu,.iview-accordion-menu * {
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	outline: 0
}

.iview-accordion-menu {
	float: left;
	position: relative;
}

.iview-accordion-menu .iview-accordion-menu-footer,.iview-accordion-menu .iview-accordion-menu-header {
	width: 100%;
	height: 50px;
	padding-left: 22px;
	float: left;
	line-height: 50px;
	font-weight: 600;
	color: #f0f0f0;
	background: #414956
}

.iview-accordion-menu ul {
	margin: 0;
	padding: 0;
	list-style: none
}

.iview-accordion-menu ul li {
	width: 100%;
	display: block;
	float: left;
	position: relative
}

.iview-accordion-menu ul li a {
	width: 100%;
	padding: 14px 22px;
	float: left;
	text-decoration: none;
	color: #f0f0f0;
	font-size: 13px;
	background: #414956;
	white-space: nowrap;
	position: relative;
	overflow: hidden;
	/*-o-transition: color .2s linear,background .2s linear;
	-moz-transition: color .2s linear,background .2s linear;
	-webkit-transition: color .2s linear,background .2s linear;
	transition: color .2s linear,background .2s linear*/
}

.iview-accordion-menu>ul>li.active>a,.iview-accordion-menu>ul>li:hover>a {
	color: #fff;
	background: #3b424d
}

.iview-accordion-menu>ul>li>a {
	/*border-bottom: solid 1px #3b424d*/
}

.iview-accordion-menu ul li a i {
	width: 15px;
	float: left;
	line-height: 18px;
	font-size: 16px;
	text-align: left
}

.iview-accordion-menu .submenu-indicator {
	float: right;
	right: 22px;
	position: absolute;
	line-height: 19px;
	font-size: 20px;
  color: #999;
	-o-transition: transform .3s linear;
	-moz-transition: transform .3s linear;
	-webkit-transition: transform .3s linear;
	-ms-transition: transform .3s linear
}

.iview-accordion-menu ul ul.submenu .submenu-indicator {
	line-height: 16px
}

.iview-accordion-menu .submenu-indicator-minus>.submenu-indicator {
	-ms-transform: rotate(45deg);
	-moz-transform: rotate(45deg);
	-webkit-transform: rotate(45deg);
	transform: rotate(45deg)
}

.iview-accordion-menu ul ul.submenu,.iview-accordion-menu ul ul.submenu li ul.submenu {
	width: 100%;
	/*display: none;*/
	position: static
}

.iview-accordion-menu ul ul.submenu li {
	clear: both;
	width: 100%
}

.iview-accordion-menu ul ul.submenu li a {
	width: 100%;
	float: left;
	font-size: 11px;
	background: #fff;
	border-top: none;
	position: relative;
	border-right: solid 1px #dddee1;
	/*-o-transition: border .2s linear;
	-moz-transition: border .2s linear;
	-webkit-transition: border .2s linear;
	transition: border .2s linear*/
}

.iview-accordion-menu ul ul.submenu li:hover>a {
	border-left-color: #414956
}

.iview-accordion-menu ul ul.submenu>li>a {
	padding-left: 30px
}

.iview-accordion-menu ul ul.submenu>li>ul.submenu>li>a {
	padding-left: 45px
}

.iview-accordion-menu ul ul.submenu>li>ul.submenu>li>ul.submenu>li>a {
	padding-left: 60px
}
.iview-accordion-menu ul ul.submenu>li>ul.submenu>li>ul.submenu>li>ul.submenu>li>a {
	padding-left: 75px
}
.iview-accordion-menu ul ul.submenu>li>ul.submenu>li>ul.submenu>li>ul.submenu>li>ul.submenu>li>a {
	padding-left: 90px
}

.iview-accordion-menu ul li .iview-accordion-menu-label,.iview-accordion-menu ul ul.submenu li .iview-accordion-menu-label {
	min-width: 20px;
	padding: 1px 2px 1px 1px;
	position: absolute;
	right: 18px;
	top: 14px;
	font-size: 11px;
	color: #555;
	text-align: center;
	line-height: 18px;
	background: #f0f0f0;
	border-radius: 100%
}

.iview-accordion-menu ul ul.submenu li .iview-accordion-menu-label {
	top: 12px
}

.ink {
	display: block;
	position: absolute;
	background: rgba(255,255,255,.3);
	border-radius: 100%;
	-webkit-transform: scale(0);
	-moz-transform: scale(0);
	-ms-transform: scale(0);
	-o-transform: scale(0);
	transform: scale(0)
}

.animate-ink {
	-webkit-animation: ripple .5s linear;
	-moz-animation: ripple .5s linear;
	-ms-animation: ripple .5s linear;
	-o-animation: ripple .5s linear;
	animation: ripple .5s linear
}

@-webkit-keyframes ripple {
	100% {
		opacity: 0;
		-webkit-transform: scale(2.5)
	}
}

@-moz-keyframes ripple {
	100% {
		opacity: 0;
		-moz-transform: scale(2.5)
	}
}

@-o-keyframes ripple {
	100% {
		opacity: 0;
		-o-transform: scale(2.5)
	}
}

@keyframes ripple {
	100% {
		opacity: 0;
		transform: scale(2.5)
	}
}

.blue.iview-accordion-menu .iview-accordion-menu-footer,.blue.iview-accordion-menu .iview-accordion-menu-header,.blue.iview-accordion-menu ul li a {
	background: #4A89DC
}

.blue.iview-accordion-menu>ul>li.active>a,.blue.iview-accordion-menu>ul>li:hover>a {
	background: #3e82da
}

.blue.iview-accordion-menu>ul>li>a {
	border-bottom-color: #3e82da
}

.blue.iview-accordion-menu ul ul.submenu li:hover>a {
	border-left-color: #3e82da
}

.green.iview-accordion-menu .iview-accordion-menu-footer,.green.iview-accordion-menu .iview-accordion-menu-header,.green.iview-accordion-menu ul li a {
	background: #03A678
}

.green.iview-accordion-menu>ul>li.active>a,.green.iview-accordion-menu>ul>li:hover>a {
	background: #049372
}

.green.iview-accordion-menu>ul>li>a {
	border-bottom-color: #049372
}

.green.iview-accordion-menu ul ul.submenu li:hover>a {
	border-left-color: #049372
}

.red.iview-accordion-menu .iview-accordion-menu-footer,.red.iview-accordion-menu .iview-accordion-menu-header,.red.iview-accordion-menu ul li a {
	background: #ED5565
}

.red.iview-accordion-menu>ul>li.active>a,.red.iview-accordion-menu>ul>li:hover>a {
	background: #DA4453
}

.red.iview-accordion-menu>ul>li>a {
	border-bottom-color: #DA4453
}

.red.iview-accordion-menu ul ul.submenu li:hover>a {
	border-left-color: #DA4453
}

.white.iview-accordion-menu .iview-accordion-menu-footer,.white.iview-accordion-menu .iview-accordion-menu-header,.white.iview-accordion-menu ul li a {
	background: #fff;
	color: #555
}

.white.iview-accordion-menu>ul>li.active>a,.white.iview-accordion-menu>ul>li:hover>a {
	/*background: #f0f0f0*/
  border-right: 2px solid #2d8cf0;
}

.white.iview-accordion-menu>ul>li>a {
	/*border-bottom-color: #f0f0f0*/
  border-right: 1px solid #dddee1;
}

.white.iview-accordion-menu ul ul.submenu li:hover>a {
	border-right: 2px solid #2d8cf0;
}
.white.iview-accordion-menu ul ul.submenu li.active>a {
	border-right: 2px solid #2d8cf0;
}

.white.iview-accordion-menu ul ul.submenu li a {
	color: #555;
}

.white.iview-accordion-menu>ul>li>a>.ink {
	background: rgba(0,0,0,.1)
}

.black.iview-accordion-menu .iview-accordion-menu-footer,.black.iview-accordion-menu .iview-accordion-menu-header,.black.iview-accordion-menu ul li a {
	background: #292929
}

.black.iview-accordion-menu>ul>li.active>a,.black.iview-accordion-menu>ul>li:hover>a {
	background: #222
}

.black.iview-accordion-menu>ul>li>a {
	border-bottom-color: #222
}

.black.iview-accordion-menu ul ul.submenu li:hover>a {
	border-left-color: #222
}
.iview-accordion-menu ul ul.submenu>li>ul.submenu>li>ul.submenu>li>ul.submenu>li>a{
  padding-left: 75px;
}
.submenu-indicator:hover{
  color: #2d8cf0;
}
</style>
