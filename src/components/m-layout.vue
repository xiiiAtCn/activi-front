<template>
  <div>
    <div class="layout" v-if="menu">
      <Menu mode="horizontal" :theme="menu.theme" @on-select="loadPage">
        <div class="layout-assistant">
          <Menu-item v-for="(menuItem, key) in menu.items" :name="key" :key="key">
            <!--<div v-on:click="loadPage(menuItem.action)">{{{menuItem.text}}{menuItem.text}}</div>-->
            {{menuItem.text}}
          </Menu-item>
        </div>
      </Menu>
      <div class="layout-content">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
      <div class="layout-copy">
        2011-2016 &copy;  杭州昱石网络科技
      </div>
    </div>

    <div class="layout" v-if="leftMenu">
      <Row type="flex">
        <i-col span="4" class="layout-menu-left">
          <Menu width="auto" :theme="leftMenu.theme" @on-select="loadPageLeft">
            <Menu-item v-for="(menuItem, key) in leftMenu.items" :name="key" :key="key">
              <Icon :type="menuItem.icon" v-if="menuItem.icon"></Icon>
              {{menuItem.text}}
            </Menu-item>
          </Menu>
        </i-col>
        <i-col span="19">
          <div class="layout-content">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </i-col>
      </Row>
    </div>

  </div>
</template>
<script>
  import { dispatch } from '../utils/skipUtils'
  import router from '../router'

  export default {
    router,
    data () {
      return {
        menu: false,
        leftMenu: {
          theme: 'light',
          items: {
            boMaintenance: {
              text: '设备管理',
              icon: 'gear-b',
              action: {
                type: 'link',
                url: '/api/init/boMaintenance?at=/layoutContent/05/page'
              }
            },
            formMaintenance: {
              text: '表单管理',
              icon: 'ios-paper',
              action: {
                type: 'link',
                url: '/api/init/formMaintenance?at=/layout/page'
              }
            },
            formMaintenanceNew: {
              text: '新表单管理',
              icon: 'ios-paper',
              action: {
                type: 'link',
                url: '/api/initNew/formMaintenanceNew?at=/layout/page'
              }
            },
            workflowMaintenance: {
              text: '流程管理',
              icon: 'pull-request',
              action: {
                type: 'link',
                url: '/api/init/workflowMaintenance?at=/layout/page'
              }
            },
            test: {
              text: '测试',
              icon: 'pull-request',
              action: {
                type: 'link',
                url: '/api/bo/lists/listViewDefine?at=/layout/page'
              }
            },
            treeTest: {
              text: '树',
              icon: 'transgender',
              action: {
                type: 'link',
                url: '/api/bo/tree/listBoTreeDefine?at=/layout/page'
              }
            }

          }

        }
      }
    },
    methods: {
      loadPage: function (name) {
        let actionDefine = this.menu.items[name]
        dispatch(actionDefine.action)
      },
      loadPageLeft: function (name) {
        let actionDefine = this.leftMenu.items[name]
        dispatch(actionDefine.action)
      }
    }
//        watch: {
//            $route () {
//                this.meta = null;
//                fetch(this.$route.query.url, (err, post) => {
//                    if (err) {
//                        this.errorMessage = err.message
//                    } else {
//                        this.meta = post;
//                        this.define = post.ui_define;
//                        this.content = post.ui_content;
//                        if (this.define.data_url) {
//                            var url = this.define.data_url;
//                            store.dispatch("putData", {'url': url})
//                        } else {
//                            store.dispatch("clearData", {})
//                        }
//                    }
//                })
//            },
//            dataUrl: function (newUrl, oldUrl) {
//                store.dispatch("putData", {'url': newUrl})
//            },
//            'define.status_url': function (to, from) {
//                if (this.define.status_url) {
//                    store.dispatch("putStatus", {'url': this.define.status_url})
//                }
//            }
//        },
//        beforeRouteEnter(to, from, next) {
//            fetch(to.query.url, (err, post) => {
//                if (err) {
//                    console.log('main error:', err.message);
//                    next(false)
//                } else {
//                    next(vm => {
//                        vm.meta = post;
//                        vm.define = post.ui_define;
//                        vm.content = post.ui_content;
//                        vm.dataUrl = inn(post, null, "ui_define", "data_url");
//                        document.title = vm.define.title;
//                    })
//                }
//            })
//        }
  }
</script>
<style scoped>
</style>
