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
              name:"机组一",
              position:"浙江省台州市温岭市"
            }
          ],
            tableColumns1: [
              {
                      type:'index',
                      width: 60,
                      title:'序号'
                  },{
                    title: '泵房名称',
                    key: 'name'
                },
                {
                    title: '泵房位置',
                    key: 'position',
                    render: (h, params) => {
                        return h('a', [
                          h('Icon', {
                              props: {
                                type:'location'
                              },
                              style:{
                                marginRight: '10px',
                              }
                          }, ''),
                            h('span', {
                                style: {
                                }
                            }, params.row.position)

                        ]);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        // this.show(params.index)
                                    }
                                }
                            }, '查看泵房')
                        ]);
                    }
                }
            ]
        }
    }
}
</script>

<style lang="css">
</style>
