<template>
    <div class="nav-select-container">
        <div class="nav-item-container">
            <span>{{ titleText }}</span>
            <Icon 
                type="chevron-right" 
                class="nav-arrow">
            </Icon>
        </div>
        <div
            v-for="(select, index) in selectData" 
            :key="index"
            class="nav-item-container">
            <Select 
                v-model="tempSelect[index]"
                size="small"
                class="nav-item">
                <Option 
                    v-for="option in select.child" 
                    @click.native="selectChanged(select, index, option.value)"
                    :key="option.value"
                    :value="option.value">
                    {{ option.label }}
                </Option>
            </Select>
            <Icon 
                type="chevron-right" 
                v-show="index !== selectData.length - 1"
                class="nav-arrow">
            </Icon>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import { deepCopy } from 'utils/utils'
import mixin from '../mixin'
import Mutations from 'store/Mutation'

export default {
    mixins: [mixin],
    data () {
        return {
            // 当前选中值
            tempSelect: [],
            selectData: []
        }
    },
    methods: {
        // 设置对应项的selected并emit事件
        selectChanged (select, index, value) {
            select.selected = value
            let i = this.findSelectIndex(select.id)
            let tempData = deepCopy(this.selectData)
            tempData[i] = select
            // 清除选中之后的数据
            let data = tempData.slice(0, i + 1)
            this.selectData = data
            // 清除选中之后的数据
            this.tempSelect.splice(i + 1, this.tempSelect.length - i)
            if (this.$store.state.componentPageData[this.id] === this.currentId) {
                this.getSelectData()
            } else {
                this.$store.commit(Mutations.SET_COMPONENT_DATA, {id: this.id, data: this.currentId})
            }
        },
        // 根据id找出对应位置
        findSelectIndex (id) {
            for (let i = 0; i < this.selectData.length; i++) {
                if (this.selectData[i].id === id) {
                    return i
                }
            }
        },
        /**
         * 获取数据
         */
        getSelectData () {
            this.getData('selectData', (data, err) => {
                if (data) {
                    this.selectData.push(data)
                }
            })
        },
        watchValuesChanged () {
            this.getSelectData()
        }
    },
    computed: {
        titleText () {
            return _.get(this.define, 'titleText', '筛选结果')
        },
         // 当前选中的最后一项的id
        currentId () {
            if (this.selectData && this.selectData.length > 0) {
                return this.selectData[this.selectData.length - 1].selected || ''
            } else {
                return ''
            }
        },
    },
    mounted () {
        this.getSelectData()
    }
}
</script>
<style scoped>
.nav-select-container{
    display: inline;
}
.nav-item-container{
    display: inline;
}
.nav-item{
    width: 120px;
}
.nav-arrow{
    margin: 0 10px;
}
</style>