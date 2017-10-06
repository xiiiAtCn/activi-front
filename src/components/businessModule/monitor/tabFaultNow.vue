<template lang="html">
  <div class="" style="padding:20px;">
    <Table :data="tableData1" :columns="tableColumns1" stripe></Table>
  </div>
</template>

<script>
/* eslint-disable */
export default {
    data: function() {
        return {
          tableData1:[
            {

              position:"浙江省台州市温岭市",
              name:"机组一",
              deviceName:"系统",
              param:"故障代码",
              paramVal:"缺水故障(1)",
              faultType:"故障",
              faultDesc:"机组故障",
              happenTime:"2013-02-29 23:11:22"
            }
          ],
            tableColumns1: [
              {
                      type:'index',
                      width: 60,
                      title:'序号'
                  },
                {
                    title: '泵房位置',
                    key: 'position'
                },
                {
                  title: '机组名称',
                  key: 'name'
                },
                {
                  title: '设备名称',
                  key: 'deviceName'
                },
                {
                  title: '参数',
                  key: 'param'
                },
                {
                  title: '参数值',
                  key: 'paramVal'
                },
                {
                  title: '问题类型',
                  key: 'faultType',
                  render: (h, params) => {
                      return h('Tag', {
                          props: {
                              type: 'dot',
                              color: 'red'
                          }
                      }, params.row.faultType);
                  }
                },
                {
                  title: '问题描述',
                  key: 'faultDesc'
                },
                {
                  title: '发生时间',
                  key: 'happenTime'
                }
            ]
        }
    }
}
</script>

<style lang="css">
</style>
