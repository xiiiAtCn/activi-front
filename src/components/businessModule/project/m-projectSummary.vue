<template lang="html">
  <div class="ps-content">
    <Row>
      <Col span="20">
        <h2 style="color: #9f9f9f;font-weight:normal;">项目概览</h2>
      </Col>
      <Col span="4">
        <Button type="primary" @click="startProject">新建项目</Button>
      </Col>
    </Row>
    <Row>
      <ul class="proj-panel">
        <li>
          <div class="proj-panel-item">
            <Row style="padding-bottom:10px;margin-top: 10px;border-bottom:1px solid rgba(150,150,150,0.09);">
              <Col span="12">
                <div class="proj-name-icon"></div>
                <a target="_blank" class="proj-name" href="/layoutContent/05/纳爱斯脱硫脱硝DCS系统/projectOut">纳爱斯脱硫脱硝DCS系统</a>
              </Col>
              <Col span="12" class="detail-progress">
                <div class="progress-left">
                  <div class="info">
                    工作进度
                  </div>
                  <div class="pro-bg"></div>
                  <div class="pro-cont"></div>
                </div>
                <div class="progress-right">
                  <div class="info">
                    25/323
                  </div>
                </div>
              </Col>
              <Col span="12" class="simp-progress">
                <div class="pro-bg"></div>
                <div class="pro-cont"></div>
                <div class="pro-percent">63%</div>
              </Col>
            </Row>
            <Row>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    成本使用率
                  </div>
                </div>
                <div class="p-c-img"></div>
              </Col>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    未解决问题
                  </div>
                </div>
                <div class="p-c-img2"></div>
              </Col>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    未解决风险
                  </div>
                </div>
                <div class="p-c-img2"></div>
              </Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">1232.00</Col>
              <Col span="8" class="p-c-info">23</Col>
              <Col span="8" class="p-c-info">34</Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">计划成本</Col>
              <Col span="8" class="p-c-info">已识别问题</Col>
              <Col span="8" class="p-c-info">已识别风险</Col>
            </Row>
            <Row>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">232.00</Col>
              <Col span="8" class="p-c-info">1</Col>
              <Col span="8" class="p-c-info">3</Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">实际金额</Col>
              <Col span="8" class="p-c-info">未解决问题</Col>
              <Col span="8" class="p-c-info">未解决风险</Col>
            </Row>
          </div>
        </li>
        <li>
          <div class="proj-panel-item">
            <Row style="padding-bottom:10px;margin-top: 10px;border-bottom:1px solid rgba(150,150,150,0.09);">
              <Col span="12">
                <div class="proj-name-icon"></div>
                <a target="_blank" class="proj-name" href="/layoutContent/05/后台管理系统/projectOut">后台管理系统</a>
              </Col>
              <Col span="12" class="detail-progress">
                <div class="progress-left">
                  <div class="info">
                    工作进度
                  </div>
                  <div class="pro-bg"></div>
                  <div class="pro-cont"></div>
                </div>
                <div class="progress-right">
                  <div class="info">
                    25/323
                  </div>
                </div>
              </Col>
              <Col span="12" class="simp-progress">
                <div class="pro-bg"></div>
                <div class="pro-cont"></div>
                <div class="pro-percent">63%</div>
              </Col>
            </Row>
            <Row>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    成本使用率
                  </div>
                </div>
                <div class="p-c-img"></div>
              </Col>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    未解决问题
                  </div>
                </div>
                <div class="p-c-img2"></div>
              </Col>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    未解决风险
                  </div>
                </div>
                <div class="p-c-img2"></div>
              </Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">1232.00</Col>
              <Col span="8" class="p-c-info">23</Col>
              <Col span="8" class="p-c-info">34</Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">计划成本</Col>
              <Col span="8" class="p-c-info">已识别问题</Col>
              <Col span="8" class="p-c-info">已识别风险</Col>
            </Row>
            <Row>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">232.00</Col>
              <Col span="8" class="p-c-info">1</Col>
              <Col span="8" class="p-c-info">3</Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">实际金额</Col>
              <Col span="8" class="p-c-info">未解决问题</Col>
              <Col span="8" class="p-c-info">未解决风险</Col>
            </Row>
          </div>
        </li>
        <li>
          <div class="proj-panel-item">
            <Row style="padding-bottom:10px;margin-top: 10px;border-bottom:1px solid rgba(150,150,150,0.09);">
              <Col span="12">
                <div class="proj-name-icon"></div>
                <a target="_blank" class="proj-name" href="/layoutContent/05/纳爱斯脱硫脱硝DCS系统/projectOut">纳爱斯脱硫脱硝DCS系统</a>
              </Col>
              <Col span="12" class="detail-progress">
                <div class="progress-left">
                  <div class="info">
                    工作进度
                  </div>
                  <div class="pro-bg"></div>
                  <div class="pro-cont"></div>
                </div>
                <div class="progress-right">
                  <div class="info">
                    25/323
                  </div>
                </div>
              </Col>
              <Col span="12" class="simp-progress">
                <div class="pro-bg"></div>
                <div class="pro-cont"></div>
                <div class="pro-percent">63%</div>
              </Col>
            </Row>
            <Row>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    成本使用率
                  </div>
                </div>
                <div class="p-c-img"></div>
              </Col>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    未解决问题
                  </div>
                </div>
                <div class="p-c-img2"></div>
              </Col>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    未解决风险
                  </div>
                </div>
                <div class="p-c-img2"></div>
              </Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">1232.00</Col>
              <Col span="8" class="p-c-info">23</Col>
              <Col span="8" class="p-c-info">34</Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">计划成本</Col>
              <Col span="8" class="p-c-info">已识别问题</Col>
              <Col span="8" class="p-c-info">已识别风险</Col>
            </Row>
            <Row>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">232.00</Col>
              <Col span="8" class="p-c-info">1</Col>
              <Col span="8" class="p-c-info">3</Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">实际金额</Col>
              <Col span="8" class="p-c-info">未解决问题</Col>
              <Col span="8" class="p-c-info">未解决风险</Col>
            </Row>
          </div>
        </li>
        <li>
          <div class="proj-panel-item">
            <Row style="padding-bottom:10px;margin-top: 10px;border-bottom:1px solid rgba(150,150,150,0.09);">
              <Col span="12">
                <div class="proj-name-icon"></div>
                <a target="_blank" class="proj-name" href="/layoutContent/05/项目管理系统/projectOut">项目管理系统</a>
              </Col>
              <Col span="12" class="detail-progress">
                <div class="progress-left">
                  <div class="info">
                    工作进度
                  </div>
                  <div class="pro-bg"></div>
                  <div class="pro-cont"></div>
                </div>
                <div class="progress-right">
                  <div class="info">
                    25/323
                  </div>
                </div>
              </Col>
              <Col span="12" class="simp-progress">
                <div class="pro-bg"></div>
                <div class="pro-cont"></div>
                <div class="pro-percent">63%</div>
              </Col>
            </Row>
            <Row>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    成本使用率
                  </div>
                </div>
                <div class="p-c-img"></div>
              </Col>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    未解决问题
                  </div>
                </div>
                <div class="p-c-img2"></div>
              </Col>
              <Col span="8" style="padding: 20px;">
                <div class="p-c-circle">
                  <div class="info" style="margin-top:25px;">
                    73%
                  </div>
                  <div class="info">
                    未解决风险
                  </div>
                </div>
                <div class="p-c-img2"></div>
              </Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">1232.00</Col>
              <Col span="8" class="p-c-info">23</Col>
              <Col span="8" class="p-c-info">34</Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">计划成本</Col>
              <Col span="8" class="p-c-info">已识别问题</Col>
              <Col span="8" class="p-c-info">已识别风险</Col>
            </Row>
            <Row>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
              <Col span="8"><hr style="border: 1px solid #d9d9d9;width: 50px; margin: 5px auto;"></Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">232.00</Col>
              <Col span="8" class="p-c-info">1</Col>
              <Col span="8" class="p-c-info">3</Col>
            </Row>
            <Row>
              <Col span="8" class="p-c-info">实际金额</Col>
              <Col span="8" class="p-c-info">未解决问题</Col>
              <Col span="8" class="p-c-info">未解决风险</Col>
            </Row>
          </div>
        </li>
      </ul>
    </Row>
  </div>
</template>

<script>
/* eslint-disable */
import {dispatch} from  '../../../utils/actionUtils'
export default {
        data () {
            return {
            }
        },
        methods: {
            startProject () {
                dispatch({
                  type: "link",
                  url: "/api/formsNew/formCheckCreate/c135e649-b3b2-43c9-91db-000a7d7bd0bc/项目立项申请?jobId=CREATE1141774432957440_1141779972453376",
                  at : "/layoutContent/05/page"
                })
            }
        }
    }
</script>

<style lang="css">
.detail-progress{
  display: none;
}
.proj-panel-item:hover .proj-name-icon{
  border-color: #666;
}
.proj-panel-item:hover .proj-name{
  color: #666;
}

.proj-panel-item:hover .detail-progress{
  display: block;
}
.proj-panel-item:hover .simp-progress{
  display:none;
}
.simp-progress{
  height: 38px;
}
.simp-progress .pro-bg{
  background:rgba(225,225,225,0.33);
  box-shadow:inset -2px 3px 5px 0 rgba(136,136,136,0.50);
  border-radius:60.63px;
  width:192px;
  height:12px;
  margin-top:14px;
}
.simp-progress .pro-cont{
  margin-top: -12px;
  width: 126px;
  height: 12px;
  background:url(../../../assets/img/proj/color-progress-bg.png);
}
.simp-progress .pro-percent{
  width:192px;
  text-align: center;
  color: #fff;
  margin-top: -15px;
}
.p-c-info{
  font-size:14px;
color:#6f6f6f;
text-align:center;
line-height: 25px;
}
.p-c-circle{
  width: 97px;
  height: 97px;
  border: 4px solid #feece9;
  border-radius: 50px;
  margin: 0px auto;
}
.p-c-img{
  margin: -97px auto 0px;
  background: url(../../../assets/img/proj/p-c-circle1.png);
  width: 97px;
  height: 97px;
}
.p-c-img2{
  margin: -97px auto 0px;
  background: url(../../../assets/img/proj/p-c-circle2.png);
  width: 97px;
  height: 97px;
}
.p-c-circle .info{
  text-align: center;
  vertical-align: middle;
}
.progress-left{
  background:#ffffff;
background-image:linear-gradient(-180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.05) 100%);
box-shadow:3px 2px 3px 0 #cacaca, inset 0 1px 2px 0 rgba(255,255,255,0.50);
border-radius:2px 2px 0 0;
width:60%;
height:33px;
display:inline-block;
}
.progress-left .info{
  float:left;
  margin-left: 10px;
  margin-top: 3px;
  font-size:14px;
color:#6f6f6f;
}
.progress-right .info{
  float:left;
  margin-left: 10px;
  margin-top: 5px;
  font-size:14px;
color:#ffffff;
}
.progress-left .pro-bg{
  background:#e2e2e2;
box-shadow:inset -1px 1px 2px 0 rgba(136,136,136,0.50);
border-radius:20px;
width:119px;
height:4px;
margin-top: 25px;
margin-left: 10px;
}
.progress-left .pro-cont{
  background:#1fbba6;
background-image:linear-gradient(-180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.05) 100%);
box-shadow:inset 0 1px 2px 0 rgba(255,255,255,0.50);
border-radius:20px;
width:71px;
height:4px;
margin-top: -4px;
margin-left: 10px;
}
.progress-right{
  margin-left: -5px;
  background:#ffffff;
background-image:linear-gradient(-180deg, #7ac4f4 2%, #369ad9 100%);
box-shadow:3px 2px 3px 0 #cacaca, inset 0 1px 2px 0 rgba(255,255,255,0.50);
border-radius:0 10px 10px 0;
width:30%;
height:33px;
display:inline-block;
}
.ps-content{
  margin:20px;
}
.proj-panel li{
  display: inline-block;
  margin: 20px 12px;
  width:30%;
  background:#ffffff;
box-shadow:2px 5px 15px 2px rgba(0,0,0,0.08), 0 2px 4px 0 rgba(74,73,74,0.15);
border-radius:3px;
height:323px;
min-width: 400px;
}
.proj-panel .proj-name-icon{
width: 20px; height: 20px; border: 2px solid #ddd; border-radius:10px;float:left;margin: 10px 0 0 10px;
}
.proj-panel .proj-name{
  font-size:14px;
color:#d7d7d8;
float: left;
margin: 10px 0 0 10px;
}
</style>
