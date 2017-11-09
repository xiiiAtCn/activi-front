import _ from 'lodash'
import { FORM_ELEMENT_VALUE, ADD_NEW_OBJECT } from 'store/Mutation'
const mixin = {
    props: {
        define: {
            type: Object,
            default: {}
        }
    },
    computed: {
        readonly() {
            return _.get(this.define, 'readonly', false)
        },
        required() {
            return _.get(this.define, 'required', true)
        },
        name() {
            return _.get(this.define, 'name', Math.random())
        },
        title() {
            return _.get(this.define, 'title', '')
        },
        labelLength() {
            return _.get(this.define, 'labelLength', 2)
        },
        labelOffset() {
            return _.get(this.define, 'labelOffset', 0)
        },
        contentLength() {
            return _.get(this.define, 'contentLength', 22)
        },
        contentOffset() {
            return _.get(this.define, 'contentOffset', 0)
        },
        errorOffset() {
            let offset = parseInt(this.labelLength) + parseInt(this.labelOffset) + parseInt(this.contentOffset)
            if(isNaN(offset)) {
                offset = this.labelLength
            }
            return offset
        },
        dataType() {
            return _.get(this.define, 'dataType', 'String')
        },
        form() {
            return _.get(this.define, 'form', 'form')
        },
        reset() {
            return _.get(this.$store.state.formData[this.form], 'reset', false)
        },
        hasError: {
            get() {
                let key = this.form + 'checkResult'
                if(this.$store.state.formData[key] === undefined) {
                    this.$store.commit(ADD_NEW_OBJECT,
                        {
                            attribute: key, 
                            value: {}
                        }
                    )
                }
                return _.get(this.$store.state.formData[key], this.name, false)
            }
        },
        validate() {
            return _.get(this.$store.state.formData[this.form], 'validate', false)
        },
        uid() {
            return _.get(this.define, 'ui_id', Math.random())
        },
        objectModel: {
            get() {
                console.log(`get objectModel from vuex ${this.name}`)
                debugger
                let form = _.get(this.$store.state.formData, this.form)
                if(form === undefined ) {
                    this.$store.commit(ADD_NEW_OBJECT, 
                        {
                            attribute: this.form, 
                            value: {
                                loading:true,
                                reset:false,
                                validate:false,
                                visible:false
                            }
                        }
                    )
                }
                let value = _.get(this.$store.state.formData[this.form], this.name)
                if(value === undefined) {
                    switch(this.dataType) {
                    case 'String':
                        this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: {value: ''}, form: this.form})
                        break
                    case 'Array':
                        this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: {value: []}, form: this.form})
                        break
                    case 'Date':
                        this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: {value: ''}, form: this.form})
                        break
                    case 'Object':
                        this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: {value: {}}, form: this.form})
                    }
                }
                let tmp = _.get(this.$store.state.formData[this.form], [this.name, 'value'], '')
                if(tmp !== '') {
                    if(this.dataType === 'Date') {
                        console.log(`tmp is ${tmp}`)
                        if(!Object.prototype.toString.apply(tmp) === '[object Date]')
                            tmp = new Date(tmp.replace(/-/g, '/'))
                    }
                }
                return tmp
            },
            set(value) {
                //数组暂不支持，需要特殊处理
                console.log(`typeof value is ${typeof value}`)
                debugger
                if(typeof value === 'string' || value instanceof Date)
                    this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: {value}, form: this.form})
                else
                    this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: value, form: this.form})
            }
        },
        isRelated() {
            return _.get(this.define, 'isRelated', false)
        },
        //关联对象
        boundTarget() {
            if(this.isRelated) {
                let targetId = _.get(this.define, ['relation', 'target'], '')
                return _.get(this.$store.state.formData[this.form], targetId, '')
            } else {
                return ''
            }
        }
    },
    watch: {
        validate(newVal) {
            if(newVal) {
                this.valid()
            }
        },
        boundTarget(newVal, oldVal) {
            if(!_.isEqual(newVal, oldVal)) {
                this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: {value:''}, form: this.form})
            }
        }
    },
    data(){
        return {
            errorMessage: ''
        }
    },
}

export default mixin