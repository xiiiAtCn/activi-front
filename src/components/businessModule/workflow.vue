<template lang="html">
    <div class="workflow-content">
         <Row class="tab_workflow">
              <Table :data="tableData" :columns="tableColumns"></Table>
         </Row>
         <Row class="show_workflow">
                <Row class="tab_workCenter">
                    <Button type="info" >文字信息</Button>
                    <Button type="info" @click="showFrame">图形信息</Button>
                </Row>
                 <h4 style="margin:10px 0;">{{this.name}} -->{{this.person}}</h4>
                  <p>目标：成果物META-NAME/BO-META-NAME</p>

                  <table id="nav">
                        <thead>
                          <tr :space="60" direction="vertical" process-status="finish" finish-status="wait">
                            <td v-for="(item, index) in steps.step" :active="steps.active" :key="item.title" :title="item.title" @click="jump(index)" :id="index">{{item.title}}</td>
                          </tr>
                        </thead>
                  </table>


                 <Row id="detail">
                    <Row class='common' index="0" style="margin-top:0">
                        <p style="">CHECK-LIST一览：</p>
                        <Table :data="tableData1" :columns="tableColumns1"></Table>
                    </Row>
                    <Row class='common' index="1">
                        <p style="">关联实体：</p>
                        <Table :data="tableData1" :columns="tableColumns1"></Table>
                    </Row>
                    <Row class='common' index="2">
                        <p style="">输入单据：</p>
                        <Table :data="tableData1" :columns="tableColumns1"></Table>
                    </Row>
                    <Row class='common' index="3">
                        <p style="">输出单据：</p>
                        <Table :data="tableData1" :columns="tableColumns1"></Table>
                    </Row>
                 </Row>
         </Row>
    </div>
</template>
<script>
export default {
    props:{
      statusId:{
        type: Number,
        default: null
      }
    },
    data: function () {
    return {
      showFlag : false,
      total : 0,
      steps: {
            active: 0,
            step: [
                  {title: 'CHECK-LIST一览'},
                  {title: '关联实体'},
                  {title: '输入单据'},
                  {title: '输出单据'}
                ]
          },
          name:'',
          person:'',
          tableData:[
              {
                'index':'1',
                'name':'job-meta1',
                'mainPerson':'张三',
              },
              {
                'index':'2',
                'name':'job-meta2',
                'mainPerson':'李四',
              },
               {
                'index':'3',
                'name':'job-meta3',
                'mainPerson':'溜溜',
              },
          ],
          tableColumns: [
                { title: '#',
                    key: 'index',
                    width:100,
                    align:'center'
                },
                {
                    title: '名称',
                    align:'center',
                    render: (h, params) => {
                        return h('a',{
                           on:{
                               click:()=>{
                                  this.showFlag=true
                                  this.name=params.row.name
                                  this.person=params.row.mainPerson
                               }
                           }
                       },params.row.name)
                    }
                },
                {
                    title: '负责人',
                    key: 'mainPerson',
                    align:'center'
                },
          ],
          tableColumns1:[
              {
                  title: '序号',
                  key: 'index',
                  align:'center'
              },
              {
                  title: '名称',
                  key: 'name',
                  align:'center'
              },

          ],
          tableData1:[
            {
              'index':'1',
              'name':'xxx单据',

            },
            {
              'index':'2',
              'name':'yyy单据',
            },
            {
              'index':'3',
              'name':'yyy单据',
            },
            {
              'index':'4',
              'name':'yyy单据',
            },
            {
              'index':'5',
              'name':'yyy单据',
            },
            {
              'index':'6',
              'name':'yyy单据',
            },
            {
              'index':'7',
              'name':'yyy单据',
            },
          ]
        }
    },
    computed:{
    },
    methods: {
        jump (index) {
          let jump = document.querySelectorAll('.common')
          this.total = jump[index].offsetTop
          console.log('纵坐标', this.total)
          document.getElementById('detail').scrollTop =this.total
        },
      onScroll () {
          if (this.total >= 1245) {
            this.steps.active = 3
          } else if (scrolled < 1245 && scrolled >= 830) {
            this.steps.active = 2
          } else if (scrolled < 830 && scrolled >= 415) {
            this.steps.active = 1
          } else {
            this.steps.active = 0
          }
      },
      showFrame(){

      }
    },
    mounted() {
        this.$nextTick(function () {
          window.addEventListener('scroll', this.onScroll)
        })
    }
}

</script>

<style scoped>
/*vue-transition*/
.workflow-content{
  margin: 20px 0;
  margin-left:30px;
  min-height:900px;
}
.tab_workflow{
  width: 30%;
  min-height: 200px;
  float: left;
  overflow-x: hidden;
}
.show_workflow{
    width: 65%;
    min-height: 800px;
    float: right;
}
.common{
  margin:20px 0;
  transition:all linear 5s 0s
}
#nav{
  margin:20px 0;
}
#nav td{
  float:left;
  padding:0 20px;
  cursor: pointer;
  width:150px;
  height:30px;
  line-height: 30px;
  text-align: center;
  border:1px solid #ccc;
}

table{
  border:1px solid #909090;
}
#detail{
  width:100%;
  height:400px;
  overflow-y:auto;
  position: absolute;
}
.focus{
  background: #2db7f5
}
</style>
