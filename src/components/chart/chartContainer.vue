<template>
    <div>
        <div class="test-chart-container">
            <barLineComposeChart
                :define="stackChartData"
                :barClick="searchData"
            />
        </div>
    </div>
</template>
<script>
import Request from 'utils/request-addon'

import mock from 'mockjs'
const { Random } = mock

const urlObj = {
    stackChartData: '/test/stackChart'
},
xAxisType = ["value", "category"],
seriesType = ["bar", "line"],
category = ['category1', 'category2']

let legend = []
let seriesData = []
for (let i = 0; i < 6; i++) {
    let province = Random.province()
    while (legend.includes(province)) {
        province = Random.province()
    }
    legend.push(province)
    seriesData.push({
        "type|1": seriesType,
        "data|12": ["@string('number', 3)"],
        "name": province,
        "stack": function () {
            return this.type === seriesType[0] ? mock.mock({"test|1": category}).test : null
        },
        "yAxisIndex": i < 6 ? 0 : 1,
        "xAxisIndex": 0
    })
}

mock.mock(urlObj.stackChartData, {
    "legend": {
        "data": legend
    },
    "xAxis": [{
        "type": xAxisType[1],
        "data": "@range(1, 13, 1)",
        "unit": "@cword('个斤米')"
    }],
    "yAxis": [{
        type: xAxisType[0],
        "unit": "@cword('个斤米')"
    }],
    "series": seriesData,
    "title": {
        text: '@title(3, 5)',
        subtext: '@title(3, 5)'
    },
    'tooltip|3': [{
        label: '@cword(1, 5)',
        value: '@sentence(3)'
    }]
})

export default {
    props: {
        chartData: {
            type: Object,
            default () {
                return {}
            }
        },
        searchAction: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            stackChartData: {}
        }
    },
    mounted() {
        this.searchData()
    },
    methods: {
        searchData () {
            let request = new Request()
            request.setUrl(urlObj.stackChartData).forGet((data, err) => {
                console.log(`stackChartData: ${data}`)
                this.stackChartData = data
            })
        }
    }
}
</script>
<style scoped>
.sport-chart-container{
    width: 500px;
    height: 300px;
    border: 1px solid yellowgreen;
    float: left;
}
</style>


