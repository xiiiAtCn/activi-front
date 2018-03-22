<template>
    <div style="display: none;">
    </div>
</template>
<script>
    import bus from 'routers/bus'
    import math from 'mathjs'
    import _ from 'lodash'
    export default {
        props: {
            define: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data() {
            return {
                refField: [],
                formula: '',
                resultField: '',
                result: ''
            }
        },
        created() {
            bus.$on('calculate', () => {
                this.calculate()
            })
        },
        mounted() {
            this.refField = this.define.refField instanceof Array ? this.define.refField : []
            this.formula = this.define.formula
            this.resultField = this.define.resultField
            bus.$emit('calulate')
        },
        methods: {
            calculate() {
                let parameters = {}
                for(let i = 0; i < this.refField.length; i++) {
                    let key = this.refField[i]
                    let value = _.get(this.$store, ['formData', 'form', key], '')
                    if(value === '') {
                        console.warn(`required paramter ${key} is not an empty string or not exist, 
                        no math calculation will execute and will stop now`)
                        return
                    }
                    parameters[key] = value
                }
                let formula = math.parse(this.formula)
                let simplify = math.simplify(formula)
                this.result = simplify.eval(parameters)
                this.finish()
            },
            finish() {
                bus.$emit('finish', {
                    data:  this.result,
                    target: this.resultField
                })
            }
        }
    }
</script>