<template>
  <div class="layout">
    <Row type="flex" v-if="details">
      <div class="container">
        <div class="at-grid" data-column="4" style="margin-left: -100px">
          <div class="at-column" v-for="(item, index) in details" :key="index" @click="dispatchAction(item.url)">
            <div class="at-user">
              <div class="at-user__avatar">
                <Icon :type="item.icon" style="color: #2d8cf0"></Icon>
              </div>
              <div class="at-user__avatar_r">
                <div class="at-user__name">
                  {{item.title}}
                </div>
                <div class="at-user__title">
                  {{item.detail}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Row>
  </div>
</template>
<script>
import { dispatch } from '../utils/actionUtils'

//  Vue.use(VueResource)

export default {
    data () {
        return {
            details: []
        }
    },
    methods: {
        getMenu: function () {
            let systemKey = localStorage.getItem('systemKey')
            let params = {
                'id': this.$route.params.id,
                systemKey
            }
            this.setUrl('/api/module/leftMenu')
                .setQuery(params)
                .forGet(computedAry => {
                    if (computedAry.length % 4 !== 0) {
                        if (computedAry.length > 4) {
                            let pushTimes = 4 - computedAry.length % 4
                            for (let i = 0; i < pushTimes; i++) {
                                computedAry.push({})
                            }
                        }
                    }
                    this.details = computedAry
                })
        },
        dispatchAction (url) {
            dispatch(url)
        }
    },
    mounted () {
        this.getMenu()
    },
    watch: {
        '$route': function () {
            this.getMenu()
        }
    }
}
</script>
<style scoped>

  a {
    display: block;
    color: #6F808A;
  }

  .at-grid {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    background: #FFF;
    /*border: 1px solid #E2E9ED;*/
  }

  .at-grid[data-column="1"] .at-column {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    -ms-flex-preferred-size: 100%;
    flex-basis: 100%;
  }

  .at-grid[data-column="2"] .at-column {
    width: 50%;
    max-width: 50%;
    min-width: 50%;
    -ms-flex-preferred-size: 50%;
    flex-basis: 50%;
  }

  .at-grid[data-column="3"] .at-column {
    width: 33.33333%;
    max-width: 33.33333%;
    min-width: 33.33333%;
    -ms-flex-preferred-size: 33.33333%;
    flex-basis: 33.33333%;
  }

  .at-grid[data-column="4"] .at-column {
    width: 25%;
    max-width: 25%;
    min-width: 25%;
    -ms-flex-preferred-size: 25%;
    flex-basis: 25%;
  }

  .at-grid[data-column="5"] .at-column {
    width: 20%;
    max-width: 20%;
    min-width: 20%;
    -ms-flex-preferred-size: 20%;
    flex-basis: 20%;
  }

  .at-grid[data-column="6"] .at-column {
    width: 16.66667%;
    max-width: 16.66667%;
    min-width: 16.66667%;
    -ms-flex-preferred-size: 16.66667%;
    flex-basis: 16.66667%;
  }

  .at-grid[data-column="7"] .at-column {
    width: 14.28571%;
    max-width: 14.28571%;
    min-width: 14.28571%;
    -ms-flex-preferred-size: 14.28571%;
    flex-basis: 14.28571%;
  }

  .at-grid[data-column="8"] .at-column {
    width: 12.5%;
    max-width: 12.5%;
    min-width: 12.5%;
    -ms-flex-preferred-size: 12.5%;
    flex-basis: 12.5%;
  }

  .at-grid[data-column="9"] .at-column {
    width: 11.11111%;
    max-width: 11.11111%;
    min-width: 11.11111%;
    -ms-flex-preferred-size: 11.11111%;
    flex-basis: 11.11111%;
  }

  .at-column {
    z-index: 0;
    height: 120px;
    position: relative;
    background: #FFF;
    /*box-shadow: 0 0 0 1px #E2E9ED;*/
    border-right: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    /*border-right: 1px solid #E2E9ED;*/
    padding: 10px;
    /*padding-right: 20px;*/
    cursor: pointer;
    /*margin-bottom: 20px;*/
    /*box-sizing: border-box;*/
    /*-webkit-transition: box-shadow 0.2s ease, z-index 0s 0.2s ease, -webkit-transform 0.2s ease;*/
    /*transition: box-shadow 0.2s ease, z-index 0s 0.2s ease, -webkit-transform 0.2s ease;*/
    /*transition: box-shadow 0.2s ease, transform 0.2s ease, z-index 0s 0.2s ease;*/
    /*transition: box-shadow 0.2s ease, transform 0.2s ease, z-index 0s 0.2s ease, -webkit-transform 0.2s ease;*/
  }

  .at-column:nth-child(1), .at-column:nth-child(5), .at-column:nth-child(9), .at-column:nth-child(13), .at-column:nth-child(17), .at-column:nth-child(21), .at-column:nth-child(25) {
    border-left: 0;
  }

  .at-column:nth-child(4), .at-column:nth-child(8), .at-column:nth-child(12), .at-column:nth-child(16), .at-column:nth-child(20), .at-column:nth-child(24), .at-column:nth-child(28) {
    border-right: 0;
  }

  .at-column:nth-last-child(1), .at-column:nth-last-child(2), .at-column:nth-last-child(3), .at-column:nth-last-child(4) {
    border-bottom: 0;
  }

  /*.at-column:before {*/
  /*content: "";*/
  /*display: block;*/
  /*padding-top: 100%;*/
  /*}*/
  .at-column:hover {
    z-index: 1;
    /*box-shadow: 0 8px 50px rgba(0, 0, 0, 0.2);*/
    /*-webkit-transform: scale(1.05);*/
    /*transform: scale(1.05);*/
    background: #f3f3f3;
    -webkit-transition: box-shadow 0.2s ease, z-index 0s 0s ease, -webkit-transform 0.2s ease;
    transition: box-shadow 0.2s ease, z-index 0s 0s ease, -webkit-transform 0.2s ease;
    transition: box-shadow 0.2s ease, transform 0.2s ease, z-index 0s 0s ease;
    transition: box-shadow 0.2s ease, transform 0.2s ease, z-index 0s 0s ease, -webkit-transform 0.2s ease;
  }

  .at-column:hover .at-social {
    margin: 16px 0 0;
    opacity: 1;
  }

  @media (max-width: 800px) {
    .at-column {
      width: 50% !important;
      max-width: 50% !important;
      min-width: 50% !important;
      -ms-flex-preferred-size: 50% !important;
      flex-basis: 50% !important;
    }
  }

  @media (max-width: 600px) {
    .at-column {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
      -ms-flex-preferred-size: 100% !important;
      flex-basis: 100% !important;
    }
  }

  .at-user {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    text-align: center;
    margin-top: 4px;
    /*margin-bottom: 20px;*/
  }

  .at-user__avatar_r {
    padding-right: 50px;
  }

  .at-user__avatar {
    width: 50px;
    height: 50px;
    /*border-radius: 100%;*/
    margin: 10px 22px 0 22px;
    overflow: hidden;
  }

  .at-user__avatar i {
    display: block;
    width: 100%;
    max-width: 100%;
    font-size: 50px;
  }

  .at-user__name {
    color: #313435;
    font-family: 'Roboto', sans-serif;
    font-size: 1.1rem;
    font-weight: bold;
    /*line-height: 2.625rem;*/
    margin-bottom: 8px;
    text-align: left;
  }

  .at-user__title {
    width: 100%;
    height: 40px;
    color: #6F808A;
    margin: 0 10px 10px 0;
    word-wrap: break-word;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: left;
  }

  .at-social {
    margin: 0 0 -18px;
    opacity: 0;
    -webkit-transition: margin 0.2s ease, opacity 0.2s ease;
    transition: margin 0.2s ease, opacity 0.2s ease;
  }

  .at-social__item {
    display: inline-block;
    margin: 0 10px;
  }

  .at-social__item a {
    display: block;
  }

  .at-social__item svg {
    fill: #515F65;
    display: block;
    height: 18px;
    -webkit-transition: fill 0.2s ease;
    transition: fill 0.2s ease;
  }

  .at-social__item svg:hover {
    fill: #788D96;
  }

  .container {
    width: 100%;
    margin: 80px auto;
    box-sizing: border-box;
    -webkit-transform-origin: top center;
    transform-origin: top center;
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
  }

</style>
