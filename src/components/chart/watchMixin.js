import _ from 'lodash'
export const mixin = {
    watch: {
        chartData (newVal, oldVal) {
            if (!_.isEqual(newVal, oldVal)) {
                this.draw(newVal, oldVal)
            }
        }
    }
}