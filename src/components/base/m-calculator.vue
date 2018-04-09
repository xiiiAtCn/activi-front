<template>
    <div style="display: none;">
    </div>
</template>
<script>
    import bus from 'routers/bus'
    import math from 'mathjs'
    import _ from 'lodash'
    export default {
        inject: {
            tmpForm: {
                default: ''
            }
        },
        props: {
            define: {
                type: Object,
                default () {
                    return {}
                }
            },
        },
        computed: {
            fixForm() {
                return this.tmpForm ? this.tmpForm : this.form
            },
            form() {
                return _.get(this.define, 'ui_form', 'form')
            }
        },
        data() {
            return {
                result: ''
            }
        },
        created() {
            bus.$on('calculate', () => {
                this.calculate()
            })
        },
        mounted() {
            let formulas = this.define.formulas
            let prefix = [ '$store','state','formData', this.fixForm]
            let keySet = new Set()
            let containerSet = new Set()
            for(let i=0; i < formulas.length; i++) {
                let formula = formulas[i]
                Object.keys(formula['refField']).forEach(e => {
                    let id = formula['refField'][e]
                    if(containerSet.has(id)) {
                        return
                    } 
                    containerSet.add(id)
                    let bak = prefix.slice()
                    bak.push(id, 'value')
                    keySet.add(bak)
                })
            }
            let self = this
            this.$nextTick(() => {
                keySet.forEach(e => {
                    bus.$watch(function() {
                        console.log(e)
                        return _.get(self, e, '')
                    }, () => {
                        bus.$emit('calculate')
                    })
                })
            })
        },
        methods: {
            calculate() {
                let formulas = this.define.formulas
                for (let i =0 ;i < formulas.length; i++) {
                    let execution = formulas[i]
                    let { formula, resultField, refField } = execution
                    let parameters = {}
                    for(let k of Object.entries(refField)) {
                        let key = k[0]
                        let value = k[1]
                        let parameter = _.get(this.$store, ['state', 'formData', this.fixForm, value, 'value'], '')
                        if(parameter === '') {
                            console.warn(`required paramter ${key} is not an empty string or not exist, 
                            no math calculation will execute and will stop now`)
                            return
                        }
                        parameters[key] = parameter
                    }
                    let func = math.parse(formula)
                    let simplify = math.simplify(func)
                    let result = simplify.eval(parameters)
                    this.finish(resultField, result)
                }
            },
            finish(target, result) {
                bus.$emit('finish', {
                    data:  result,
                    target 
                })
            }
        }
    }
</script>