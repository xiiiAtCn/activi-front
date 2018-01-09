<template>
    <div>
        <Row>
            <mBoFilter
                :relation="filterDefine"
            />
        </Row>
        <Row class="chart-box">
            <barLineComposeChart
                :relation="chartDefine"
            />
        </Row>
    </div>
    
</template>
<script>
import _ from 'lodash'

export default {
    props: {
        define: {
            type: Object
        }
    },
   computed: {
       filterDefine () {
           return _.get(this.define, 'filterRelation', {})
       },
       chartDefine () {
           return _.get(this.define, 'chartRelation', {})
       }
   }
}
</script>
<style scoped>
.chart-box{
    margin-top: 50px;
}
</style>